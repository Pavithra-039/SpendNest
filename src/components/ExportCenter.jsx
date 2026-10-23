import React, { useState } from 'react';
import { 
  Download, 
  FolderTree, 
  FileText, 
  Table, 
  Code, 
  CheckCircle, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { CONVERSATION_ANALYSES } from '../data/analyses';

export default function ExportCenter({ records, onDownloadZip, isExporting }) {
  const [manifestView, setManifestView] = useState('json');

  // Compute manifest rows dynamically from current state
  const routeFolderMap = {
    'Deal Next Steps': 'deal_next_steps',
    'Sales Coaching': 'sales_coaching',
    'Customer Success & Risk': 'customer_success',
    'Partnership / Channel': 'partnerships',
    'Vendor / Product Evaluation': 'vendor_evaluation',
    'Internal Operations & Training': 'internal_ops',
    'Disqualified / Unserviceable': 'disqualified',
    'Competitor Intelligence': 'deal_next_steps',
    'Administrative Follow-Up': 'customer_success',
    'Customer Follow-Up': 'deal_next_steps',
    'Nurture / Passive Follow-Up': 'deal_next_steps'
  };

  const manifestRows = records.map(r => {
    const analysis = CONVERSATION_ANALYSES[r.record_ref];
    const outputPaths = [];
    if (analysis) {
      r.active_routes.forEach(route => {
        const folderName = routeFolderMap[route] || 'deal_next_steps';
        outputPaths.push(`${folderName}/${r.record_ref}_${r.source_type}_${folderName}.md`);
      });
    }

    return {
      source_type: r.source_type,
      source_id: r.source_id,
      record_ref: r.record_ref,
      applied_revision: r.applied_revision,
      routes: r.active_routes.join('; '),
      output_paths: outputPaths.join('; ') || 'NONE (Metadata Only)',
      review_state: r.review_state,
      is_manually_overridden: r.is_manually_overridden,
      analysis_freshness: r.analysis_freshness
    };
  });

  // Generate CSV text
  const csvHeaders = ['source_type', 'source_id', 'record_ref', 'applied_revision', 'routes', 'output_paths', 'review_state', 'is_manually_overridden', 'analysis_freshness'];
  const csvContent = [
    csvHeaders.join(','),
    ...manifestRows.map(row => csvHeaders.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  // Generate JSON text
  const jsonContent = JSON.stringify({
    manifest_version: '1.0',
    date_scope: '2026-08-21 (Asia/Kolkata)',
    total_records: manifestRows.length,
    records: manifestRows
  }, null, 2);

  // Group files by folder
  const folderTree = {
    'daily_briefs': ['manager_brief_2026_08_21.md'],
    'deal_next_steps': [],
    'sales_coaching': [],
    'customer_success': [],
    'partnerships': [],
    'vendor_evaluation': [],
    'internal_ops': [],
    'disqualified': []
  };

  records.forEach(r => {
    const analysis = CONVERSATION_ANALYSES[r.record_ref];
    if (analysis) {
      r.active_routes.forEach(route => {
        const folderName = routeFolderMap[route] || 'deal_next_steps';
        if (folderTree[folderName]) {
          const fileName = `${r.record_ref}_${r.source_type}_${folderName}.md`;
          if (!folderTree[folderName].includes(fileName)) {
            folderTree[folderName].push(fileName);
          }
        }
      });
    }
  });

  return (
    <div className="export-container">
      {/* Top Banner */}
      <div className="export-banner">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-emerald-400" />
            <span>Organized Output Folder Structure & Manifest</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete file-based deliverables exported across distinct operational taxonomies. 
            Manifest documents every source record, assigned routes, and file destination paths.
          </p>
        </div>

        <button 
          className="btn-download-archive"
          onClick={onDownloadZip}
          disabled={isExporting}
        >
          <Download className="w-5 h-5 mr-2" />
          <span>{isExporting ? 'Generating Archive...' : 'Download Export Package (.ZIP)'}</span>
        </button>
      </div>

      <div className="export-grid">
        {/* Left Column: Output Folder Tree */}
        <div className="export-folder-card">
          <div className="card-header">
            <h3 className="card-title text-sm flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-emerald-400" />
              <span>Generated Destination Folders</span>
            </h3>
            <span className="badge-tag bg-emerald-950 text-emerald-300 border border-emerald-800">
              {Object.values(folderTree).flat().length} Total Files
            </span>
          </div>

          <div className="folder-tree-body space-y-4">
            {Object.entries(folderTree).map(([folderName, files]) => (
              <div key={folderName} className="folder-node">
                <div className="folder-name">
                  📁 <strong className="text-white">exports/{folderName}/</strong>
                  <span className="text-[11px] text-slate-300 ml-1.5">({files.length} files)</span>
                </div>
                <div className="file-list pl-4 mt-1 border-l border-slate-800 space-y-1">
                  {files.map(file => (
                    <div key={file} className="file-item">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-300">{file}</span>
                    </div>
                  ))}
                  {files.length === 0 && (
                    <div className="text-[11px] text-slate-300 italic pl-1">No active outputs</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Manifest Inspector (JSON / CSV) */}
        <div className="export-manifest-card">
          <div className="card-header flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-indigo-400" />
              <h3 className="card-title text-sm">Machine-Readable Manifest</h3>
            </div>

            <div className="view-toggle">
              <button 
                className={`toggle-btn ${manifestView === 'json' ? 'active' : ''}`}
                onClick={() => setManifestView('json')}
              >
                <Code className="w-3.5 h-3.5 mr-1" />
                <span>manifest.json</span>
              </button>
              <button 
                className={`toggle-btn ${manifestView === 'csv' ? 'active' : ''}`}
                onClick={() => setManifestView('csv')}
              >
                <Table className="w-3.5 h-3.5 mr-1" />
                <span>manifest.csv</span>
              </button>
            </div>
          </div>

          <div className="manifest-code-wrapper">
            <pre className="manifest-pre">
              <code>{manifestView === 'json' ? jsonContent : csvContent}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
