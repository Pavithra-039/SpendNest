import React from 'react';
import { 
  Inbox, 
  FileText, 
  BarChart3, 
  RotateCcw, 
  Download, 
  Presentation, 
  Video, 
  ShieldAlert, 
  CheckCircle2, 
  Clock,
  Sparkles
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  metrics, 
  lastBatchEvent, 
  onDownloadZip, 
  isExporting, 
  onOpenReplayModal,
  onResetToCleanPostUpdate
}) {
  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-section">
          <div className="brand-logo">
            <Inbox className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">SpendNest Revenue Intelligence</h1>
              <span className="badge-scope">Asia/Kolkata</span>
            </div>
            <p className="brand-subtitle">
              Manager Review Workspace • <span className="text-white font-medium">21 August 2026</span> • Ingested Intake Assessment
            </p>
          </div>
        </div>

        <div className="header-status-group">
          <div className="status-pill status-pill-batch">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Batch: <strong className="text-white">{lastBatchEvent ? `Rev ${lastBatchEvent.revision} (${lastBatchEvent.batch_id})` : 'Post-Update Ready'}</strong>
            </span>
          </div>

          <div className="status-pill status-pill-coverage">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Coverage: <strong className="text-white">{metrics.usableTotal} / {metrics.totalRecords} ({metrics.coverageRate.toFixed(1)}%)</strong>
            </span>
          </div>

          {metrics.manualOverridesCount > 0 && (
            <div className="status-pill status-pill-override">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Manual Overrides: <strong className="text-white">{metrics.manualOverridesCount} Active</strong>
              </span>
            </div>
          )}

          <div className="header-actions">
            <button 
              className="btn-header btn-replay" 
              onClick={onOpenReplayModal}
              title="Test Replay Contract (Batch Import & Override Preservation)"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>Replay Engine</span>
            </button>

            <button 
              className="btn-header btn-export" 
              onClick={onDownloadZip}
              disabled={isExporting}
              title="Download Complete Manifest & Output Files (.ZIP)"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{isExporting ? 'Packing...' : 'Export ZIP'}</span>
            </button>
          </div>
        </div>
      </div>

      <nav className="header-nav">
        <button 
          className={`nav-tab ${activeTab === 'brief' ? 'active' : ''}`}
          onClick={() => setActiveTab('brief')}
        >
          <FileText className="w-4 h-4" />
          <span>Manager Brief (21 Aug)</span>
          <span className="tab-pill">Priority</span>
        </button>

        <button 
          className={`nav-tab ${activeTab === 'inbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('inbox')}
        >
          <Inbox className="w-4 h-4" />
          <span>Conversation Inbox</span>
          <span className="tab-count">{metrics.totalRecords}</span>
        </button>

        <button 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard & Safe Metrics</span>
        </button>

        <button 
          className={`nav-tab ${activeTab === 'exports' ? 'active' : ''}`}
          onClick={() => setActiveTab('exports')}
        >
          <Download className="w-4 h-4" />
          <span>Exports & Manifest</span>
        </button>

        <button 
          className={`nav-tab ${activeTab === 'slides' ? 'active' : ''}`}
          onClick={() => setActiveTab('slides')}
        >
          <Presentation className="w-4 h-4" />
          <span>5-Slide Presentation</span>
        </button>

        <button 
          className={`nav-tab ${activeTab === 'video' ? 'active' : ''}`}
          onClick={() => setActiveTab('video')}
        >
          <Video className="w-4 h-4" />
          <span>3-Min Video Guide</span>
        </button>
      </nav>
    </header>
  );
}
