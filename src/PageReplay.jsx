import { useState, useRef } from 'react';

const STEPS = [
  {
    title: 'Reset State',
    desc: 'Clear all records and history; prepare for clean import.',
    run: (engine) => {
      engine.records.clear();
      engine.manualOverrides.clear();
      engine.history = [];
      engine.appliedBatches = [];
      return ['State cleared. Ready for batch import.'];
    }
  },
  {
    title: 'Import Initial Batch (rev 1)',
    desc: 'Load 01_initial.json — establishes baseline 44 records.',
    run: (engine) => {
      const ev = engine.resetToInitialClean();
      const m = engine.getMetrics();
      return [
        `Imported batch: Initial Clean Batch`,
        `Records added: ${m.totalRecords}`,
        `Usable transcripts: ${m.usableTotal}`,
        `Coverage: ${m.coverageRate.toFixed(1)}%`,
      ];
    }
  },
  {
    title: 'Validate Routing Logic',
    desc: 'Verify each record has correct route assignments.',
    run: (engine) => {
      const records = engine.getAllRecordsList();
      let ok = 0;
      let issues = [];
      records.forEach(r => {
        if (r.active_routes && r.active_routes.length > 0) {
          ok++;
        } else {
          issues.push(`${r.record_ref}: no routes assigned`);
        }
      });
      const lines = [`Routing validation: ${ok} / ${records.length} records OK`];
      if (issues.length > 0) {
        issues.forEach(i => lines.push(`WARN: ${i}`));
      } else {
        lines.push('All routes validated successfully.');
      }
      return lines;
    }
  },
  {
    title: 'Apply Manual Override (M07)',
    desc: 'Simulate manager override on M07 — reroute to Customer Success & Risk.',
    run: (engine) => {
      const m07 = Array.from(engine.records.values()).find(r => r.record_ref === 'M07');
      if (!m07) return ['M07 not found in records.'];
      engine.setManualRoute(m07.source_type, m07.source_id, ['Customer Success & Risk'], 'Replay test override');
      const updated = engine.getRecord(m07.source_type, m07.source_id);
      return [
        `Override applied to M07`,
        `Active routes: ${updated.active_routes.join(', ')}`,
        `Manual override active: ${updated.is_manually_overridden}`,
        `Freshness: ${updated.analysis_freshness}`,
      ];
    }
  },
  {
    title: 'Import Update Batch (rev 2)',
    desc: 'Load 02_update.json — merges rev-2 records, preserves manual override.',
    run: (engine) => {
      engine.resetToPostUpdateClean();
      const m07 = Array.from(engine.records.values()).find(r => r.record_ref === 'M07');
      const m = engine.getMetrics();
      const lines = [
        `Update batch applied (rev 2)`,
        `Total records: ${m.totalRecords}`,
        `Usable transcripts: ${m.usableTotal}`,
        `Coverage: ${m.coverageRate.toFixed(1)}%`,
        `Manual overrides in state: ${m.manualOverridesCount}`,
      ];
      if (m07) {
        lines.push(`M07 review state: ${m07.review_state}`);
        lines.push(`M07 active routes: ${m07.active_routes.join(', ')}`);
      }
      return lines;
    }
  },
];

export default function PageReplay({ engine }) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const logRef = useRef(null);

  const appendLog = (lines, type = 'info') => {
    setLogs(prev => [...prev, ...lines.map(l => ({ text: l, type }))]);
    setTimeout(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, 50);
  };

  const runStep = async (stepIdx) => {
    if (running) return;
    setRunning(true);
    setCurrentStep(stepIdx);

    const step = STEPS[stepIdx];
    appendLog([`--- Step ${stepIdx + 1}: ${step.title} ---`], 'dim');

    await new Promise(r => setTimeout(r, 400));

    try {
      const result = step.run(engine);
      appendLog(result, 'success');
      setCompletedSteps(prev => [...prev, stepIdx]);
    } catch (err) {
      appendLog([`ERROR: ${err.message}`], 'error');
    }

    setCurrentStep(-1);
    setRunning(false);
  };

  const runAll = async () => {
    if (running) return;
    setLogs([]);
    setCompletedSteps([]);
    for (let i = 0; i < STEPS.length; i++) {
      await runStep(i);
      await new Promise(r => setTimeout(r, 250));
    }
    appendLog(['--- All steps complete ---'], 'success');
  };

  const reset = () => {
    setCurrentStep(-1);
    setCompletedSteps([]);
    setLogs([]);
    setRunning(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Replay Engine</h1>
            <p className="page-subtitle">Step-by-step engine simulation with live log output</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm" onClick={reset} disabled={running}>Reset</button>
            <button className="btn btn-primary" onClick={runAll} disabled={running}>
              {running ? 'Running...' : 'Run All Steps'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Steps */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Engine Steps</div>
            <span className="badge badge-default">{completedSteps.length} / {STEPS.length} done</span>
          </div>
          <div className="replay-steps">
            {STEPS.map((step, idx) => {
              const isDone = completedSteps.includes(idx);
              const isActive = currentStep === idx;
              const isLast = idx === STEPS.length - 1;

              return (
                <div key={idx} className="replay-step">
                  <div className="replay-step-connector">
                    <div className={`replay-step-dot${isDone ? ' done' : isActive ? ' active' : ''}`}>
                      {isDone ? '✓' : idx + 1}
                    </div>
                    {!isLast && <div className={`replay-step-line${isDone ? ' done' : ''}`} />}
                  </div>
                  <div className="replay-step-body">
                    <div className="replay-step-title">{step.title}</div>
                    <div className="replay-step-desc">{step.desc}</div>
                    {!completedSteps.includes(idx) && (
                      <button
                        className="btn btn-secondary btn-sm mt-2"
                        onClick={() => runStep(idx)}
                        disabled={running}
                        style={{ marginTop: 8 }}
                      >
                        Run Step
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Log */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Engine Log</div>
            {running && <div className="spinner" />}
          </div>
          <div className="replay-log" ref={logRef} style={{ minHeight: 320 }}>
            {logs.length === 0 ? (
              <span className="log-line dim">Engine ready. Run a step to begin...</span>
            ) : (
              logs.map((log, i) => (
                <span key={i} className={`log-line ${log.type}`}>{log.text}{'\n'}</span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
