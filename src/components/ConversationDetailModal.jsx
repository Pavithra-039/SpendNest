import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  User, 
  Phone, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  Check, 
  RotateCcw, 
  Save, 
  Info, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { CONVERSATION_ANALYSES, ROUTE_TAXONOMY } from '../data/analyses';

export default function ConversationDetailModal({ 
  record, 
  engine, 
  onClose, 
  onSaveManualRoute, 
  onResetManualRoute 
}) {
  if (!record) return null;

  const isCall = record.source_type === 'call';
  const analysis = CONVERSATION_ANALYSES[record.record_ref];
  const hasText = engine.isUsableText(record);

  // Local state for route editing
  const [selectedRoutes, setSelectedRoutes] = useState(record.active_routes || []);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [customNote, setCustomNote] = useState('');

  useEffect(() => {
    setSelectedRoutes(record.active_routes || []);
  }, [record]);

  const toggleRoute = (routeId) => {
    if (selectedRoutes.includes(routeId)) {
      if (selectedRoutes.length > 1) {
        setSelectedRoutes(selectedRoutes.filter(r => r !== routeId));
      }
    } else {
      setSelectedRoutes([...selectedRoutes, routeId]);
    }
  };

  const handleSave = () => {
    onSaveManualRoute(record.source_type, record.source_id, selectedRoutes, customNote);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    onResetManualRoute(record.source_type, record.source_id);
    setSelectedRoutes(record.suggested_routes || []);
  };

  const turns = record.transcript_payload ? (record.transcript_payload.turns || []) : [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-lg max-w-5xl" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <span className={`ref-badge-lg ${isCall ? 'badge-call' : 'badge-meeting'}`}>
              {record.record_ref}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="modal-title">
                  {analysis ? analysis.company : (record.payload.title || 'Outbound Dial Inspection')}
                </h3>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {record.source_type.toUpperCase()}
                </span>
                <span className="text-xs bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                  Applied Revision {record.applied_revision}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Source ID: <code className="text-slate-300">{record.source_id}</code> • 
                Timestamp: <strong className="text-slate-200">{isCall ? record.payload.started_at : record.payload.starts_at}</strong>
              </p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        {/* Modal Body - 2 Columns */}
        <div className="modal-body-split">
          {/* Left Column: Full Conversation Evidence */}
          <div className="transcript-pane">
            <div className="pane-header">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Primary Source Conversation Evidence</span>
              </span>
              <span className="text-xs text-slate-400">
                {isCall 
                  ? `Duration: ${record.payload.duration_seconds || 0}s • Talk Time: ${record.payload.talk_time_seconds || 0}s`
                  : `${turns.length} Transcribed Turns • Redacted: true`}
              </span>
            </div>

            <div className="transcript-content">
              {hasText ? (
                isCall ? (
                  /* Call Transcript Viewer */
                  <div className="call-transcript-box">
                    <p className="transcript-text leading-relaxed whitespace-pre-wrap">
                      {record.payload.transcript}
                    </p>
                  </div>
                ) : (
                  /* Meeting Turns Viewer */
                  <div className="meeting-turns-list space-y-3">
                    {turns.map((turn, idx) => (
                      <div key={idx} className="turn-card">
                        <div className="turn-meta">
                          <span className="turn-number">Turn {idx + 1}</span>
                          <span className="turn-speaker">{turn.speaker}</span>
                          <span className="turn-time">{turn.timecode || `${turn.starts_at_seconds}s`}</span>
                        </div>
                        <p className="turn-text">{turn.text}</p>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* No Usable Text State */
                <div className="no-text-card">
                  <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <h4 className="text-sm font-semibold text-white">No Usable Transcript Supplied</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    {record.transcript_payload?.unavailable_reason || 
                     'Background telephony record without audio capture in this test delivery envelope. Stored metadata preserved.'}
                  </p>
                  <div className="text-[11px] text-slate-500 mt-3 border-t border-slate-800 pt-2">
                    Review State: <strong className="text-slate-300">{record.review_state}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Structured Analysis & Manager Routing */}
          <div className="analysis-pane">
            {/* Discrepancy Alert if Stored vs Spoken Mismatch */}
            {record.discrepancy_note && (
              <div className="discrepancy-banner">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-300 text-xs uppercase tracking-wide">
                    Stored System Discrepancy Detected
                  </div>
                  <p className="text-xs text-amber-200/90 mt-0.5">
                    {record.discrepancy_note}
                  </p>
                </div>
              </div>
            )}

            {/* Analysis Block 1: What Happened */}
            <div className="analysis-section">
              <h4 className="section-title">1. What Happened & Why It Matters</h4>
              <p className="section-content">
                {analysis ? analysis.summary : 'No conversational transcript available. Source metadata indicates phone connection state and duration only.'}
              </p>
            </div>

            {/* Analysis Block 2: Supporting Evidence */}
            <div className="analysis-section">
              <h4 className="section-title">2. Supporting Transcript Evidence</h4>
              <div className="evidence-quote-box">
                {analysis ? analysis.evidence : 'N/A - Missing audio text.'}
              </div>
            </div>

            {/* Analysis Block 3: Honest Uncertainty Boundaries */}
            <div className="analysis-section">
              <h4 className="section-title text-slate-300">3. What Evidence Does NOT Establish</h4>
              <p className="section-content text-slate-300 italic">
                {analysis ? analysis.doesNotEstablish : 'Cannot establish customer intent or actual discussion without audio recording.'}
              </p>
            </div>

            {/* Analysis Block 4: Actionable Next Steps */}
            <div className="analysis-section">
              <h4 className="section-title">4. Actionable Next Steps & Stated Ownership</h4>
              <p className="section-content whitespace-pre-line">
                {analysis ? analysis.nextSteps : 'Maintain CRM contact hygiene.'}
              </p>
              {analysis && (
                <div className="owner-badge-box mt-2">
                  <span className="text-xs text-slate-400">Direct Owner(s):</span>
                  <span className="text-xs font-semibold text-white ml-1">{analysis.owners}</span>
                </div>
              )}
            </div>

            {/* Manager Routing & Manual Override Controller */}
            <div className="routing-control-section">
              <div className="flex justify-between items-center mb-2">
                <h4 className="section-title flex items-center gap-1.5 text-white">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Assigned Routing & Destination Control</span>
                </h4>
                {record.is_manually_overridden && (
                  <span className="badge-tag bg-amber-950 text-amber-300 border border-amber-800">
                    Manual Override Active
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 mb-3">
                Select one or more destinations for this conversation's analytical output. 
                Manual changes are permanently saved and survive batch replays.
              </p>

              {/* Multi-route checkboxes */}
              <div className="route-checkbox-grid">
                {ROUTE_TAXONOMY.map(tax => {
                  const isChecked = selectedRoutes.includes(tax.id);
                  return (
                    <label 
                      key={tax.id} 
                      className={`route-checkbox-item ${isChecked ? 'checked' : ''}`}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleRoute(tax.id)}
                        className="sr-only"
                      />
                      <span className={`custom-checkbox ${isChecked ? 'bg-indigo-600 border-indigo-500' : 'border-slate-700'}`}>
                        {isChecked && <Check className="w-3 h-3 text-white" />}
                      </span>
                      <span className="text-xs text-slate-200 select-none">{tax.label}</span>
                    </label>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
                <button 
                  className="btn-reset-route"
                  onClick={handleReset}
                  title="Revert to automated suggestion"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Suggestion</span>
                </button>

                <button 
                  className="btn-save-route"
                  onClick={handleSave}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saveSuccess ? 'Saved & Preserved!' : 'Save Manual Override'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
