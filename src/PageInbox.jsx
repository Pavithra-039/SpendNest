import { useState } from 'react';
import { CONVERSATION_ANALYSES } from './data/analyses';

const URGENCY_CONFIG = {
  Critical: { cls: 'badge-red', label: 'Critical' },
  High: { cls: 'badge-orange', label: 'High' },
  Medium: { cls: 'badge-blue', label: 'Medium' },
  Low: { cls: 'badge-default', label: 'Low' },
};

const STATE_CONFIG = {
  ANALYZED: { cls: 'badge-green', label: 'Analyzed' },
  AWAITING_UPDATE: { cls: 'badge-amber', label: 'Awaiting Update' },
  BOT_CANCELLED: { cls: 'badge-default', label: 'Bot Cancelled' },
  BOT_NOT_SCHEDULED: { cls: 'badge-default', label: 'Not Scheduled' },
  SILENT_RECORDING: { cls: 'badge-default', label: 'Silent Recording' },
  CALL_METADATA_ONLY: { cls: 'badge-default', label: 'Metadata Only' },
};

const ALL_ROUTES = [
  'Deal Next Steps',
  'Sales Coaching',
  'Customer Success & Risk',
  'Partnership / Channel',
  'Vendor / Product Evaluation',
  'Internal Operations & Training',
  'Disqualified / Unserviceable',
  'Competitor Intelligence',
  'Administrative Follow-Up',
  'Customer Follow-Up',
  'Nurture / Passive Follow-Up',
  'No Usable Text / Background Telephony',
  'No Usable Text / Cancelled Capture',
  'No Usable Text / Unscheduled Capture',
  'No Usable Text / Silent Meeting',
  'Awaiting Late Delivery / No Usable Text',
];

function getRefBadgeCls(ref) {
  if (!ref) return 'background';
  if (ref.startsWith('C')) return 'call';
  if (ref.startsWith('M')) return 'meeting';
  return 'background';
}

function getRep(record) {
  if (record.source_type === 'call') {
    return record.payload?.rep_name || record.payload?.rep_email || '—';
  }
  return record.payload?.organizer_email || '—';
}

function getCompany(ref) {
  return CONVERSATION_ANALYSES[ref]?.company || '—';
}

function getUrgency(ref) {
  return CONVERSATION_ANALYSES[ref]?.urgency || 'Low';
}

export default function PageInbox({ engine }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [overrideRoute, setOverrideRoute] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');

  const records = engine.getAllRecordsList();

  const filtered = records.filter(r => {
    if (filterType !== 'all' && r.source_type !== filterType) return false;
    const urgency = getUrgency(r.record_ref);
    if (filterUrgency !== 'all' && urgency !== filterUrgency) return false;
    if (search) {
      const q = search.toLowerCase();
      const company = getCompany(r.record_ref).toLowerCase();
      const ref = (r.record_ref || '').toLowerCase();
      const rep = getRep(r).toLowerCase();
      if (!company.includes(q) && !ref.includes(q) && !rep.includes(q)) return false;
    }
    return true;
  });

  const openRecord = (record) => {
    setSelectedRecord(record);
    setOverrideRoute('');
  };

  const closePanel = () => {
    setSelectedRecord(null);
    setOverrideRoute('');
  };

  const applyOverride = () => {
    if (!selectedRecord || !overrideRoute) return;
    engine.setManualRoute(selectedRecord.source_type, selectedRecord.source_id, [overrideRoute]);
    // Refresh selected record
    const updated = engine.getRecord(selectedRecord.source_type, selectedRecord.source_id);
    setSelectedRecord(updated);
    setOverrideRoute('');
  };

  const resetOverride = () => {
    if (!selectedRecord) return;
    engine.resetManualRoute(selectedRecord.source_type, selectedRecord.source_id);
    const updated = engine.getRecord(selectedRecord.source_type, selectedRecord.source_id);
    setSelectedRecord(updated);
  };

  const analysis = selectedRecord ? CONVERSATION_ANALYSES[selectedRecord.record_ref] : null;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Inbox</h1>
            <p className="page-subtitle">{filtered.length} of {records.length} conversations</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4" style={{ flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search company, ref, rep..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '7px 12px',
            borderRadius: 6,
            border: '1px solid #E2E8F0',
            fontSize: 13.5,
            outline: 'none',
            width: 220,
            fontFamily: 'inherit'
          }}
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="route-select"
          style={{ width: 140 }}
        >
          <option value="all">All Types</option>
          <option value="call">Calls</option>
          <option value="meeting">Meetings</option>
        </select>
        <select
          value={filterUrgency}
          onChange={e => setFilterUrgency(e.target.value)}
          className="route-select"
          style={{ width: 150 }}
        >
          <option value="all">All Urgency</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Ref</th>
              <th>Company</th>
              <th>Type</th>
              <th>Route(s)</th>
              <th>Urgency</th>
              <th>Rep</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(record => {
              const urgency = getUrgency(record.record_ref);
              const urgCfg = URGENCY_CONFIG[urgency] || URGENCY_CONFIG.Low;
              const stateCfg = STATE_CONFIG[record.review_state] || { cls: 'badge-default', label: record.review_state };
              return (
                <tr
                  key={`${record.source_type}:${record.source_id}`}
                  className="clickable"
                  onClick={() => openRecord(record)}
                >
                  <td>
                    <span className={`ref-badge ${getRefBadgeCls(record.record_ref)}`}>
                      {record.record_ref}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    {getCompany(record.record_ref)}
                    {record.is_manually_overridden && (
                      <span style={{ marginLeft: 6, fontSize: 10, color: '#B45309', background: '#FFFBEB', padding: '1px 5px', borderRadius: 4, border: '1px solid #FDE68A' }}>
                        override
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${record.source_type === 'call' ? 'badge-blue' : 'badge-accent'}`}>
                      {record.source_type}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {record.active_routes.slice(0, 2).map(r => (
                        <span key={r} className="badge badge-default" style={{ fontSize: 11 }}>
                          {r.length > 22 ? r.slice(0, 22) + '...' : r}
                        </span>
                      ))}
                      {record.active_routes.length > 2 && (
                        <span className="badge badge-default" style={{ fontSize: 11 }}>
                          +{record.active_routes.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${urgCfg.cls}`}>{urgCfg.label}</span>
                  </td>
                  <td style={{ color: '#475569', fontSize: 12.5 }}>{getRep(record)}</td>
                  <td>
                    <span className={`badge ${stateCfg.cls}`} style={{ fontSize: 11 }}>{stateCfg.label}</span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
                  No conversations match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-over panel */}
      {selectedRecord && (
        <div className="slide-over-backdrop" onClick={closePanel}>
          <div className="slide-over-panel" onClick={e => e.stopPropagation()}>
            <div className="slide-over-header">
              <div className="slide-over-header-info">
                <div className="flex gap-2 items-center mb-1">
                  <span className={`ref-badge ${getRefBadgeCls(selectedRecord.record_ref)}`}>
                    {selectedRecord.record_ref}
                  </span>
                  {selectedRecord.is_manually_overridden && (
                    <span className="badge badge-amber" style={{ fontSize: 11 }}>Manual Override</span>
                  )}
                </div>
                <div className="slide-over-title">{getCompany(selectedRecord.record_ref)}</div>
                <div style={{ fontSize: 12.5, color: '#94A3B8' }}>
                  {selectedRecord.source_type} &bull; {getRep(selectedRecord)}
                </div>
              </div>
              <button className="slide-over-close" onClick={closePanel}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="slide-over-body">
              {/* Meta grid */}
              <div className="detail-grid mb-4">
                <div className="detail-item">
                  <div className="detail-item-label">Contact</div>
                  <div className="detail-item-value">{analysis?.contact || '—'}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-item-label">Urgency</div>
                  <div className="detail-item-value">
                    <span className={`badge ${(URGENCY_CONFIG[getUrgency(selectedRecord.record_ref)] || URGENCY_CONFIG.Low).cls}`}>
                      {getUrgency(selectedRecord.record_ref)}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-item-label">Review State</div>
                  <div className="detail-item-value">
                    <span className={`badge ${(STATE_CONFIG[selectedRecord.review_state] || { cls: 'badge-default' }).cls}`} style={{ fontSize: 11 }}>
                      {selectedRecord.review_state}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-item-label">Revision</div>
                  <div className="detail-item-value">rev {selectedRecord.applied_revision}</div>
                </div>
              </div>

              {/* Active Routes */}
              <div className="detail-section">
                <div className="detail-section-label">Active Routes</div>
                <div className="route-tags">
                  {selectedRecord.active_routes.map(r => (
                    <span key={r} className={`route-tag${selectedRecord.is_manually_overridden ? ' route-tag-manual' : ''}`}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {analysis && (
                <>
                  <hr className="divider" />

                  {/* Summary */}
                  <div className="detail-section">
                    <div className="detail-section-label">What Happened</div>
                    <div className="detail-section-content">{analysis.summary}</div>
                  </div>

                  {/* Evidence */}
                  <div className="detail-section">
                    <div className="detail-section-label">Supporting Evidence</div>
                    <div className="detail-section-content">{analysis.evidence}</div>
                  </div>

                  {/* Does Not Establish */}
                  <div className="detail-section">
                    <div className="detail-section-label">Boundaries / Uncertainty</div>
                    <div className="detail-section-content">{analysis.doesNotEstablish}</div>
                  </div>

                  {/* Next Steps */}
                  <div className="detail-section">
                    <div className="detail-section-label">Next Steps</div>
                    <div className="detail-section-content" style={{ whiteSpace: 'pre-line' }}>{analysis.nextSteps}</div>
                    <div style={{ marginTop: 8, fontSize: 12.5, color: '#6366F1', fontWeight: 500 }}>
                      Owners: {analysis.owners}
                    </div>
                  </div>

                  {analysis.discrepancy && (
                    <div style={{ padding: '10px 14px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, marginBottom: 16, fontSize: 13, color: '#92400E' }}>
                      <strong>Discrepancy Note:</strong> {analysis.discrepancy}
                    </div>
                  )}
                </>
              )}

              {/* Manual Route Override */}
              <hr className="divider" />
              <div className="detail-section">
                <div className="detail-section-label">Manual Route Override</div>
                <select
                  value={overrideRoute}
                  onChange={e => setOverrideRoute(e.target.value)}
                  className="route-select mb-3"
                >
                  <option value="">Select a route to override...</option>
                  {ALL_ROUTES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={applyOverride}
                    disabled={!overrideRoute}
                  >
                    Apply Override
                  </button>
                  {selectedRecord.is_manually_overridden && (
                    <button className="btn btn-secondary btn-sm" onClick={resetOverride}>
                      Reset to Suggested
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
