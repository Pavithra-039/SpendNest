import React, { useState } from 'react';
import { 
  Video, 
  Clock, 
  Play, 
  CheckCircle2, 
  FileText, 
  AlertTriangle, 
  Layers, 
  RotateCcw,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';

export default function VideoScriptGuide({ onStartTour }) {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyScript = (text, sectionId) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const fullScript = `
[0:00 - 0:45] PART 1: USEFUL MANAGER WORKFLOW & HEADLINE METRIC
"Hello. Today I am demonstrating the SpendNest Revenue Intelligence Inbox. I am starting on the Sales Manager Daily Brief for 21 August 2026, Asia/Kolkata timezone. 
Looking at our top dashboard metrics, we track 44 total ingested records—30 calls and 14 meetings—with a usable transcript coverage of 40.9%, or 18 out of 44 records. 
Let's explain our headline metric: the Telephony Connection Rate is 30.0%. Our denominator is explicitly defined: it counts the 9 calls with is_connected=true out of the 30 calls with non-null connection data. 
In the brief, I immediately spot our top escalation: Cedarwave Distribution, record M04. The customer is facing an urgent migration off old prepaid cards and needs credit cards. In Turn 26, the customer bluntly challenges our value, asking what they gain by adding SpendNest if their bank already has a portal and we can't show real-time credit limits. This gives me an immediate intervention priority before churn occurs."

[0:45 - 1:45] PART 2: THE DIFFICULT ROUTING DECISION
"Now let's examine a difficult routing decision: record M02, LedgerBridge. 
In a standard CRM, this calendar event was misclassified as an outbound sales opportunity because it was organized by an internal team member. But when I open the conversation inspector and read Turn 1 and Turn 30, we discover a complete role reversal: SpendNest is actually the prospective customer evaluating LedgerBridge as a vendor for electronic invoicing compliance in our Q4 roadmap.
If we left this routed as a sales deal, it would pollute our sales pipeline forecast with a EUR 6,500 cost rather than revenue. 
Therefore, our engine routes this to 'Vendor / Product Evaluation' and isolates it from sales quotas. 
Similarly, for record M03 Asterloom, the conversation is simultaneously an active deal requiring CFO approval and a critical sales coaching event because the rep sprang a 50% setup fee increase during pricing. Our folder architecture handles this through dual-routing without losing context."

[1:45 - 3:00] PART 3: THE DUPLICATE / UPDATE REPLAY TEST
"Finally, let's execute the duplicate and update test using our built-in Replay Engine.
Step 1: We start with initial batch 01_initial.json. We have exactly 44 records and 17 usable transcripts. Notice record M07, Willowfield Trust: its transcript was withheld in delivery 1, so its turns count is zero and its status is Awaiting Update.
Step 2: Let's test duplicate resilience. We re-import that exact batch with record order reversed. Notice the count remains exactly 44 records—no duplicates or inflated activity.
Step 3: Now I make a manual route correction. I open M07 and manually set its destination to 'Customer Success & Risk' with an Engineering Bug Escalation tag. The system marks it as manually overridden.
Step 4: Now we import the 02_update.json batch. Notice what happens: M07 is updated to Revision 2. Its late transcript arrives with all 27 turns. Total usable transcripts across the workspace increases to 18. But crucially: my manual routing override is 100% preserved and was not erased by the update!
Step 5: Even if I re-import the older Revision 1 batch, the system strictly ignores older revisions. The state persists across page refreshes and restarts.
Thank you for watching."
`;

  return (
    <div className="video-guide-container">
      {/* Banner */}
      <div className="video-banner">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-tag bg-indigo-950 text-indigo-300 border border-indigo-800">
              Candidate Submission Deliverable
            </span>
            <span className="text-xs text-slate-400">Target Duration: Exactly 3:00 Minutes</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Video className="w-6 h-6 text-indigo-400" />
            <span>Three-Minute Narrated Screen Recording Guide & Script</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Follow this structured timeline to capture your one continuous screen recording with spoken narration. 
            Demonstrates one useful workflow, one difficult routing decision, and the duplicate/update test.
          </p>
        </div>

        <button 
          className="btn-copy-all"
          onClick={() => copyScript(fullScript, 'all')}
        >
          {copiedSection === 'all' ? <Check className="w-4 h-4 mr-1 text-emerald-400" /> : <Copy className="w-4 h-4 mr-1" />}
          <span>{copiedSection === 'all' ? 'Copied Full Script!' : 'Copy Full Script'}</span>
        </button>
      </div>

      {/* 3 Video Sections */}
      <div className="video-sections-grid">
        {/* Section 1 */}
        <div className="video-section-card border-indigo-500/30">
          <div className="section-time-badge bg-indigo-950 text-indigo-300 border border-indigo-800">
            <Clock className="w-3.5 h-3.5" />
            <span>0:00 – 0:45 (45s)</span>
          </div>
          <h3 className="text-sm font-bold text-white mt-2">Part 1: Useful Manager Workflow & Headline Metric</h3>
          
          <div className="script-instructions mt-2">
            <strong>What to Show on Screen:</strong> Start on the <em>Manager Brief</em> tab. Point to the Date (21 Aug 2026), explain the Telephony Connection Rate (30.0% with its explicit denominator), and click <em>Inspect Evidence</em> on M04 Cedarwave Distribution.
          </div>

          <div className="spoken-script-box mt-3">
            <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
              <span className="font-semibold text-indigo-300 uppercase">Spoken Narration Script</span>
              <button 
                className="btn-copy-mini"
                onClick={() => copyScript(`"Hello. Today I am demonstrating the SpendNest Revenue Intelligence Inbox. I am starting on the Sales Manager Daily Brief for 21 August 2026, Asia/Kolkata timezone. Looking at our top dashboard metrics, we track 44 total ingested records—30 calls and 14 meetings—with a usable transcript coverage of 40.9%, or 18 out of 44 records. Let's explain our headline metric: the Telephony Connection Rate is 30.0%. Our denominator is explicitly defined: it counts the 9 calls with is_connected=true out of the 30 calls with non-null connection data. In the brief, I immediately spot our top escalation: Cedarwave Distribution, record M04. The customer is facing an urgent migration off old prepaid cards and needs credit cards. In Turn 26, the customer bluntly challenges our value, asking what they gain by adding SpendNest if their bank already has a portal and we can't show real-time credit limits. This gives me an immediate intervention priority before churn occurs."`, 'p1')}
              >
                {copiedSection === 'p1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'p1' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-mono">
              "Hello. Today I am demonstrating the SpendNest Revenue Intelligence Inbox. I am starting on the Sales Manager Daily Brief for 21 August 2026, Asia/Kolkata timezone... Looking at our top dashboard metrics, we track 44 total ingested records... Telephony Connection Rate is 30.0% with denominator 9 ÷ 30... In the brief, I spot our top escalation: Cedarwave Distribution M04 where Turn 26 shows value proposition collapse on bank card limits..."
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="video-section-card border-amber-500/30">
          <div className="section-time-badge bg-amber-950 text-amber-300 border border-amber-800">
            <Clock className="w-3.5 h-3.5" />
            <span>0:45 – 1:45 (60s)</span>
          </div>
          <h3 className="text-sm font-bold text-white mt-2">Part 2: The Difficult Routing Decision (M02 / M03)</h3>

          <div className="script-instructions mt-2">
            <strong>What to Show on Screen:</strong> Navigate to <em>Conversation Inbox</em>. Filter or click record <strong>M02 (LedgerBridge)</strong>. Show Turn 1 & Turn 30 in the transcript drawer, showing why standard CRMs misclassify this as sales, and why our system routed it to <em>Vendor / Product Evaluation</em>.
          </div>

          <div className="spoken-script-box mt-3">
            <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
              <span className="font-semibold text-amber-300 uppercase">Spoken Narration Script</span>
              <button 
                className="btn-copy-mini"
                onClick={() => copyScript(`"Now let's examine a difficult routing decision: record M02, LedgerBridge. In a standard CRM, this calendar event was misclassified as an outbound sales opportunity because it was organized by an internal team member. But when I open the conversation inspector and read Turn 1 and Turn 30, we discover a complete role reversal: SpendNest is actually the prospective customer evaluating LedgerBridge as a vendor for electronic invoicing compliance in our Q4 roadmap. If we left this routed as a sales deal, it would pollute our sales pipeline forecast with a EUR 6,500 cost rather than revenue. Therefore, our engine routes this to 'Vendor / Product Evaluation' and isolates it from sales quotas. Similarly, for record M03 Asterloom, the conversation is simultaneously an active deal requiring CFO approval and a critical sales coaching event because the rep sprang a 50% setup fee increase during pricing. Our folder architecture handles this through dual-routing without losing context."`, 'p2')}
              >
                {copiedSection === 'p2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'p2' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-mono">
              "Now let's examine a difficult routing decision: record M02, LedgerBridge. In a standard CRM, this calendar event was misclassified as an outbound sales opportunity... But Turn 1 and Turn 30 reveal SpendNest is actually the prospective buyer evaluating LedgerBridge as an e-invoicing supplier... Our engine routes this to 'Vendor / Product Evaluation' to protect pipeline forecasts..."
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="video-section-card border-cyan-500/30">
          <div className="section-time-badge bg-cyan-950 text-cyan-300 border border-cyan-800">
            <Clock className="w-3.5 h-3.5" />
            <span>1:45 – 3:00 (75s)</span>
          </div>
          <h3 className="text-sm font-bold text-white mt-2">Part 3: The Duplicate & Update Replay Test</h3>

          <div className="script-instructions mt-2">
            <strong>What to Show on Screen:</strong> Click the <strong>Replay Engine</strong> button in the header. Execute Step 1 (Initial Import), Step 2 (Repeat with Shuffled Order), Step 3 (Manually Correct M07 Route), Step 4 (Apply 02_update), and Step 5 (Re-import Initial Batch). Highlight that record count stays 44 and manual route survives!
          </div>

          <div className="spoken-script-box mt-3">
            <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
              <span className="font-semibold text-cyan-300 uppercase">Spoken Narration Script</span>
              <button 
                className="btn-copy-mini"
                onClick={() => copyScript(`"Finally, let's execute the duplicate and update test using our built-in Replay Engine. Step 1: We start with initial batch 01_initial.json. We have exactly 44 records and 17 usable transcripts. Notice record M07, Willowfield Trust: its transcript was withheld in delivery 1, so its turns count is zero and its status is Awaiting Update. Step 2: Let's test duplicate resilience. We re-import that exact batch with record order reversed. Notice the count remains exactly 44 records—no duplicates or inflated activity. Step 3: Now I make a manual route correction. I open M07 and manually set its destination to 'Customer Success & Risk' with an Engineering Bug Escalation tag. The system marks it as manually overridden. Step 4: Now we import the 02_update.json batch. Notice what happens: M07 is updated to Revision 2. Its late transcript arrives with all 27 turns. Total usable transcripts across the workspace increases to 18. But crucially: my manual routing override is 100% preserved and was not erased by the update! Step 5: Even if I re-import the older Revision 1 batch, the system strictly ignores older revisions. The state persists across page refreshes and restarts. Thank you for watching."`, 'p3')}
              >
                {copiedSection === 'p3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'p3' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-mono">
              "Finally, let's execute the duplicate and update test using our built-in Replay Engine. Step 1: 44 records, 17 usable texts, M07 has 0 turns... Step 2: Re-import in shuffled order — strictly 44 unique records, 0 duplicates... Step 3: Manually set M07 route... Step 4: Import 02_update — M07 gets 27 turns, usable count goes to 18, and manual route is PRESERVED... Step 5: Older rev 1 ignored. Thank you for watching."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
