import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Phone, 
  Calendar, 
  FileCheck2, 
  FileX2, 
  ShieldAlert, 
  Clock, 
  ArrowUpRight,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { CONVERSATION_ANALYSES, ROUTE_TAXONOMY } from '../data/analyses';

export default function ConversationInbox({ 
  records, 
  engine, 
  onInspectRecord 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPerson, setFilterPerson] = useState('all');
  const [filterRoute, setFilterRoute] = useState('all');
  const [filterState, setFilterState] = useState('all');
  const [filterDiscrepancyOnly, setFilterDiscrepancyOnly] = useState(false);

  const people = engine.getPeopleList();

  // Filtered record list
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      // Type filter
      if (filterType !== 'all' && r.source_type !== filterType) return false;

      // Person filter
      if (filterPerson !== 'all') {
        if (r.source_type === 'call') {
          if (r.payload.rep_name !== filterPerson && r.payload.rep_email !== filterPerson) return false;
        } else {
          if (r.payload.organizer_email !== filterPerson) return false;
        }
      }

      // Route filter
      if (filterRoute !== 'all') {
        if (!r.active_routes.includes(filterRoute)) return false;
      }

      // State filter
      if (filterState !== 'all' && r.review_state !== filterState) return false;

      // Discrepancy filter
      if (filterDiscrepancyOnly && !r.discrepancy_note) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const refMatch = r.record_ref.toLowerCase().includes(q);
        const analysis = CONVERSATION_ANALYSES[r.record_ref];
        const compMatch = analysis && analysis.company.toLowerCase().includes(q);
        const contactMatch = analysis && analysis.contact.toLowerCase().includes(q);
        const titleMatch = r.source_type === 'meeting' && r.payload.title && r.payload.title.toLowerCase().includes(q);
        const outcomeMatch = r.payload.observed_outcome && r.payload.observed_outcome.toLowerCase().includes(q);
        const repMatch = (r.payload.rep_name && r.payload.rep_name.toLowerCase().includes(q)) || 
                         (r.payload.organizer_email && r.payload.organizer_email.toLowerCase().includes(q));

        if (!refMatch && !compMatch && !contactMatch && !titleMatch && !outcomeMatch && !repMatch) {
          return false;
        }
      }

      return true;
    });
  }, [records, filterType, filterPerson, filterRoute, filterState, filterDiscrepancyOnly, searchQuery]);

  return (
    <div className="inbox-container">
      {/* Top Search & Filter Bar */}
      <div className="inbox-toolbar">
        <div className="search-box">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search accounts, contacts, refs (e.g. M07, Cedarwave, StoreHarbor)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="btn-clear" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        <div className="toolbar-controls">
          {/* Source Type Pills */}
          <div className="type-toggle-group">
            <button 
              className={`type-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All ({records.length})
            </button>
            <button 
              className={`type-btn ${filterType === 'call' ? 'active' : ''}`}
              onClick={() => setFilterType('call')}
            >
              Calls (30)
            </button>
            <button 
              className={`type-btn ${filterType === 'meeting' ? 'active' : ''}`}
              onClick={() => setFilterType('meeting')}
            >
              Meetings (14)
            </button>
          </div>

          {/* Person Dropdown */}
          <select 
            value={filterPerson}
            onChange={e => setFilterPerson(e.target.value)}
            className="inbox-select"
          >
            <option value="all">All Reps & Organizers</option>
            <optgroup label="📞 Call Representatives">
              {people.reps.map(r => (
                <option key={r} value={r}>{r} (Rep)</option>
              ))}
            </optgroup>
            <optgroup label="📅 Meeting Organizers">
              {people.organizers.map(o => (
                <option key={o} value={o}>{o} (Org)</option>
              ))}
            </optgroup>
          </select>

          {/* Route Dropdown */}
          <select 
            value={filterRoute}
            onChange={e => setFilterRoute(e.target.value)}
            className="inbox-select"
          >
            <option value="all">All Routing Destinations</option>
            {ROUTE_TAXONOMY.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>

          {/* Discrepancy Toggle */}
          <button 
            className={`btn-discrepancy-toggle ${filterDiscrepancyOnly ? 'active' : ''}`}
            onClick={() => setFilterDiscrepancyOnly(!filterDiscrepancyOnly)}
            title="Show only records where Stored Classification conflicts with actual transcript"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Discrepancies Only</span>
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="inbox-meta-bar">
        <span className="text-xs text-slate-400">
          Showing <strong className="text-white">{filteredRecords.length}</strong> of {records.length} total records
        </span>
        <div className="flex gap-2">
          <span className="status-indicator-pill bg-emerald-950/40 text-emerald-300 border border-emerald-800">
            {records.filter(r => engine.isUsableText(r)).length} Transcripts Usable
          </span>
          <span className="status-indicator-pill bg-slate-800 text-slate-300 border border-slate-700">
            {records.filter(r => !engine.isUsableText(r)).length} Missing / Background
          </span>
        </div>
      </div>

      {/* Main Inbox Table */}
      <div className="inbox-table-card">
        <table className="inbox-table">
          <thead>
            <tr>
              <th className="th-ref">Ref & Type</th>
              <th className="th-entity">Account / Counterpart / Title</th>
              <th className="th-person">Person & Role</th>
              <th className="th-status">Stored Outcome</th>
              <th className="th-route">Assigned Destinations</th>
              <th className="th-review">Intake State</th>
              <th className="th-action">Inspect</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map(r => {
              const isCall = r.source_type === 'call';
              const analysis = CONVERSATION_ANALYSES[r.record_ref];
              const hasText = engine.isUsableText(r);
              const repDisplay = isCall 
                ? (r.payload.rep_name || r.payload.rep_email || 'Unassigned')
                : (r.payload.organizer_email || 'Unassigned');

              return (
                <tr 
                  key={`${r.source_type}:${r.source_id}`}
                  className={`inbox-row ${r.is_manually_overridden ? 'row-overridden' : ''} ${r.discrepancy_note ? 'row-discrepancy' : ''}`}
                  onClick={() => onInspectRecord(r.source_type, r.source_id)}
                >
                  {/* Ref & Type */}
                  <td className="td-ref">
                    <div className="flex items-center gap-2">
                      <span className={`ref-badge ${isCall ? 'badge-call' : 'badge-meeting'}`}>
                        {r.record_ref}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-200 uppercase">
                          {r.source_type}
                        </span>
                        <span className="text-[10px] text-slate-300">
                          Rev {r.applied_revision}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Entity / Title */}
                  <td className="td-entity">
                    <div className="entity-cell">
                      <div className="entity-name">
                        {analysis ? analysis.company : (r.payload.title || 'Outbound Dial')}
                      </div>
                      <div className="entity-contact">
                        {analysis ? analysis.contact : (isCall ? (r.payload.to_number || 'External Phone') : r.payload.provider)}
                      </div>
                      {r.discrepancy_note && (
                        <div className="discrepancy-pill">
                          <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{r.discrepancy_note}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Person & Role */}
                  <td className="td-person">
                    <div className="person-cell">
                      <span className="person-name">{repDisplay}</span>
                      <span className={`role-pill ${isCall ? 'role-rep' : 'role-organizer'}`}>
                        {isCall ? 'Call Rep' : 'Meeting Organizer'}
                      </span>
                    </div>
                  </td>

                  {/* Stored Status */}
                  <td className="td-status">
                    <div className="status-cell">
                      {isCall ? (
                        <>
                          <span className={`outcome-pill outcome-${r.payload.observed_outcome || 'unknown'}`}>
                            {r.payload.observed_outcome || 'Unknown'}
                          </span>
                          <span className="text-[10px] text-slate-300 mt-0.5">
                            {r.payload.is_connected ? 'Connected' : 'Not Connected'} • {r.payload.duration_seconds || 0}s
                          </span>
                        </>
                      ) : (
                        <>
                          <span className={`outcome-pill status-${r.payload.recording_status}`}>
                            {r.payload.recording_status}
                          </span>
                          <span className="text-[10px] text-slate-300 mt-0.5">
                            {r.transcript_payload ? `${r.transcript_payload.turns.length} turns` : 'No payload'}
                          </span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Assigned Routes */}
                  <td className="td-route">
                    <div className="routes-cell">
                      {r.active_routes.map(rt => {
                        const tax = ROUTE_TAXONOMY.find(t => t.id === rt);
                        const colorClass = tax ? `route-${tax.color}` : 'route-slate';
                        return (
                          <span key={rt} className={`route-pill ${colorClass}`}>
                            {rt}
                          </span>
                        );
                      })}
                      {r.is_manually_overridden && (
                        <span className="manual-badge" title="Route was manually set by manager and preserved across batch updates">
                          <ShieldCheck className="w-3 h-3 text-amber-400" />
                          <span>Manual</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Intake Review State */}
                  <td className="td-review">
                    <div className="review-cell">
                      {hasText ? (
                        <span className="review-pill review-analyzed">
                          <FileCheck2 className="w-3 h-3 text-emerald-400" />
                          <span>Analyzed</span>
                        </span>
                      ) : (
                        <span className="review-pill review-missing">
                          <FileX2 className="w-3 h-3 text-slate-400" />
                          <span>{r.review_state}</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="td-action">
                    <button 
                      className="btn-table-inspect"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectRecord(r.source_type, r.source_id);
                      }}
                    >
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
