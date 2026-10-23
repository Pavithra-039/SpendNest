import { useState } from 'react';
import { generateExportZip, downloadBlob } from './zipExporter';

const FOLDER_STRUCTURE = [
  { folder: 'deal_next_steps/', desc: 'Deal progression, follow-ups, competitor intelligence' },
  { folder: 'sales_coaching/', desc: 'Coach notes, rep feedback, best practices' },
  { folder: 'customer_success/', desc: 'CS escalations, administrative follow-ups' },
  { folder: 'partnerships/', desc: 'Channel partner & referral conversations' },
  { folder: 'vendor_evaluation/', desc: 'Vendor / product evaluation discussions' },
  { folder: 'internal_ops/', desc: 'Internal operations & training records' },
  { folder: 'disqualified/', desc: 'Disqualified or unserviceable leads' },
  { folder: 'daily_briefs/', desc: 'Manager daily intelligence brief' },
  { folder: 'manifest.json', desc: 'Full manifest in JSON format' },
  { folder: 'manifest.csv', desc: 'Full manifest in CSV format' },
];

export default function PageExports({ engine }) {
  const [status, setStatus] = useState('idle'); // idle | generating | done | error
  const [errorMsg, setErrorMsg] = useState('');
  const [manifestPreview, setManifestPreview] = useState(null);

  const handleExport = async () => {
    setStatus('generating');
    setErrorMsg('');
    try {
      const blob = await generateExportZip(engine);
      downloadBlob(blob, `spendnest_revenue_intel_${new Date().toISOString().slice(0, 10)}.zip`);
      // Build manifest preview
      const records = engine.getAllRecordsList();
      const preview = records.map(r => ({
        ref: r.record_ref,
        type: r.source_type,
        state: r.review_state,
        routes: r.active_routes.join('; '),
        override: r.is_manually_overridden,
        freshness: r.analysis_freshness,
      }));
      setManifestPreview(preview);
      setStatus('done');
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  const metrics = engine.getMetrics();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Exports</h1>
        <p className="page-subtitle">Download a complete ZIP archive of all routed conversations</p>
      </div>

      {/* Export action card */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="card-title" style={{ fontSize: 16 }}>Revenue Intelligence Archive</div>
            <div style={{ fontSize: 13.5, color: '#475569', marginTop: 4 }}>
              {metrics.totalRecords} records &bull; {metrics.usableTotal} analyzed &bull; {metrics.manualOverridesCount} manual overrides
            </div>
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleExport}
            disabled={status === 'generating'}
          >
            {status === 'generating' ? (
              <>
                <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                Generating...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download ZIP
              </>
            )}
          </button>
        </div>

        {status === 'done' && (
          <div style={{ marginTop: 16, padding: '10px 14px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 8, fontSize: 13.5, color: '#065F46' }}>
            Export generated and download started.
          </div>
        )}

        {status === 'error' && (
          <div style={{ marginTop: 16, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, fontSize: 13.5, color: '#991B1B' }}>
            Error: {errorMsg}. Make sure JSZip is loaded via public/jszip.min.js.
          </div>
        )}
      </div>

      {/* Folder structure */}
      <div className="card mb-6">
        <div className="card-header">
          <div className="card-title">Archive Structure</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {FOLDER_STRUCTURE.map(item => (
            <div key={item.folder} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>
                {item.folder.endsWith('/') ? '📁' : '📄'}
              </span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, fontFamily: 'monospace', color: '#0F172A' }}>{item.folder}</div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manifest preview */}
      {manifestPreview && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Manifest Preview</div>
            <span className="badge badge-green">{manifestPreview.length} records</span>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: 480, overflowY: 'auto' }}>
            <table className="export-manifest-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Type</th>
                  <th>State</th>
                  <th>Routes</th>
                  <th>Override</th>
                  <th>Freshness</th>
                </tr>
              </thead>
              <tbody>
                {manifestPreview.map(row => (
                  <tr key={row.ref}>
                    <td><span className="ref-badge" style={{ fontSize: 11 }}>{row.ref}</span></td>
                    <td><span className={`badge ${row.type === 'call' ? 'badge-blue' : 'badge-accent'}`} style={{ fontSize: 11 }}>{row.type}</span></td>
                    <td style={{ fontSize: 12 }}>{row.state}</td>
                    <td style={{ fontSize: 11.5, maxWidth: 240, color: '#475569' }}>{row.routes}</td>
                    <td>
                      {row.override
                        ? <span className="badge badge-amber" style={{ fontSize: 11 }}>Yes</span>
                        : <span className="badge badge-default" style={{ fontSize: 11 }}>No</span>}
                    </td>
                    <td style={{ fontSize: 11.5, color: '#94A3B8' }}>{row.freshness}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
