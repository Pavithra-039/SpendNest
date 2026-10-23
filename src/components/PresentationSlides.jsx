import React, { useState } from 'react';
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  FileCheck2, 
  AlertTriangle, 
  GitFork, 
  Calculator, 
  Layers, 
  ShieldAlert,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function PresentationSlides() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Slide 1
    {
      id: 1,
      tag: 'Problem & Main Findings',
      title: 'The Manager Problem & Three Critical Findings',
      subtitle: 'Transforming fragmented call & meeting records into dependable operational intelligence',
      content: (
        <div className="space-y-4">
          <div className="slide-box bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wide">The Core Manager Problem</h4>
            <p className="text-sm text-slate-200 mt-1 leading-relaxed">
              Sales managers receive raw telephony metadata, incomplete meeting transcripts, and misleading machine labels from disparate tools. 
              Without rigorous intake reconciliation, managers assign unwanted cold dials, misjudge rep coaching needs, and pollute forecasting pipelines with non-sales vendor conversations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Finding 1 */}
            <div className="finding-card border-rose-500/40 bg-rose-950/20 p-3.5 rounded-xl border">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs uppercase">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Finding 1: False Pipeline Pollution</span>
              </div>
              <div className="text-xs text-white font-semibold mt-1">M02: LedgerBridge Role Reversal</div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Calendar title and internal organizer tempted automated CRM pipelines to treat this as an outbound sales opportunity. 
                Transcript reveals SpendNest is the <em>buyer</em> evaluating an e-invoicing API.
              </p>
              <div className="evidence-cite mt-2 text-[11px] text-rose-300/90 font-mono bg-rose-950/40 p-1.5 rounded">
                <strong>Source:</strong> M02 Turn 1 & Turn 30 ("commercial relationship is between SpendNest and LedgerBridge")
              </div>
              <div className="product-impact mt-1.5 text-[11px] text-slate-400">
                <strong>Product Impact:</strong> Isolated from pipeline metrics into <code>Vendor / Product Evaluation</code>.
              </div>
            </div>

            {/* Finding 2 */}
            <div className="finding-card border-amber-500/40 bg-amber-950/20 p-3.5 rounded-xl border">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Finding 2: False Positive Upstream Status</span>
              </div>
              <div className="text-xs text-white font-semibold mt-1">C10: Explicit Prospect Rejection</div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Upstream machine labeled call as <code>follow_up</code>. Contact (Aniket) moved firms and explicitly forbade follow-up calls next week, stating he will reach out if interested.
              </p>
              <div className="evidence-cite mt-2 text-[11px] text-amber-300/90 font-mono bg-amber-950/40 p-1.5 rounded">
                <strong>Source:</strong> C10 quote: "No. I said I will contact you if there is anything to discuss."
              </div>
              <div className="product-impact mt-1.5 text-[11px] text-slate-400">
                <strong>Product Impact:</strong> Re-routed to <code>Nurture / Passive Follow-Up</code> with discrepancy badge.
              </div>
            </div>

            {/* Finding 3 */}
            <div className="finding-card border-cyan-500/40 bg-cyan-950/20 p-3.5 rounded-xl border">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs uppercase">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Finding 3: Value Proposition Collapse</span>
              </div>
              <div className="text-xs text-white font-semibold mt-1">M04: Cedarwave Credit Churn Risk</div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Customer cannot use prepaid cards and needs credit. Rep offered bank card feeds, but conceded available credit limits will not display, causing customer to challenge SpendNest's value.
              </p>
              <div className="evidence-cite mt-2 text-[11px] text-cyan-300/90 font-mono bg-cyan-950/40 p-1.5 rounded">
                <strong>Source:</strong> M04 Turn 25-26 ("Then what do we gain by adding SpendNest?")
              </div>
              <div className="product-impact mt-1.5 text-[11px] text-slate-400">
                <strong>Product Impact:</strong> Escalated to P1 Churn Priority in Daily Brief + Sales Coaching.
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 2
    {
      id: 2,
      tag: 'Interface Choices & Omissions',
      title: 'Interface Choices: Signal Over Noise',
      subtitle: 'What we intentionally built for daily manager workflows, and what we deliberately left out',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="slide-box bg-slate-900/60 border border-emerald-500/30 p-4 rounded-xl">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4" />
                <span>What We Prioritized & Included</span>
              </h4>
              <ul className="text-xs text-slate-200 mt-3 space-y-2.5 list-disc list-inside leading-relaxed">
                <li>
                  <strong>Explicit Denominators on Every Metric:</strong> Hovering or clicking any KPI shows the exact mathematical formula and accounting boundary (e.g. non-null connection flags).
                </li>
                <li>
                  <strong>Call Rep vs Meeting Organizer Role Separation:</strong> Recognizes that calendar organizers (team06-12) are not automatically sales representatives or meeting attendees.
                </li>
                <li>
                  <strong>Inline Discrepancy Badges:</strong> Flags records where stored telephony outcomes conflict directly with spoken transcript dialogue (C06, C10, M02).
                </li>
                <li>
                  <strong>Source-Evidence Inspector:</strong> Side-by-side drawer displaying exact 1-based speaker turn numbers alongside structured analytical summaries.
                </li>
                <li>
                  <strong>Deterministic Replay Simulator:</strong> In-browser testing suite allowing reviewers to verify the 5 contract replay steps in seconds.
                </li>
              </ul>
            </div>

            <div className="slide-box bg-slate-900/60 border border-slate-700/60 p-4 rounded-xl">
              <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>What We Deliberately Left Out</span>
              </h4>
              <ul className="text-xs text-slate-300 mt-3 space-y-2.5 list-disc list-inside leading-relaxed">
                <li>
                  <strong>Synthetic ARR / Pipeline Currency Totals:</strong> No CRM opportunity table exists. Inventing dollar pipelines from casual speech figures violates evidence rules.
                </li>
                <li>
                  <strong>Cross-Rep Gamification Leaderboards:</strong> The extract is a selective sample across one day, not a representative measure of staff performance.
                </li>
                <li>
                  <strong>Unsubstantiated Account Linking:</strong> We do not merge contacts into assumed parent accounts without confirmed company IDs.
                </li>
                <li>
                  <strong>Hallucinated Summaries for Silent Records:</strong> Missing or silent records (B01-B20, M05, M08) are cleanly marked as metadata-only without invented text.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    // Slide 3
    {
      id: 3,
      tag: 'Routing & Output Design',
      title: 'Routing Architecture & One Difficult Case',
      subtitle: 'Multi-destination outputs without loss of operational context',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="slide-box bg-slate-900/60 border border-indigo-500/30 p-4 rounded-xl">
              <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                <GitFork className="w-4 h-4" />
                <span>Differentiated Operational Taxonomy</span>
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Routing means directing insights to the team that must act. Outputs are physically segregated into 7 dedicated folders with machine manifests:
              </p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-200">
                  <strong className="text-emerald-400">Deal Next Steps:</strong> Qualified deals & quotes
                </div>
                <div className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-200">
                  <strong className="text-amber-400">Sales Coaching:</strong> Pitch transparency & tactics
                </div>
                <div className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-200">
                  <strong className="text-rose-400">Customer Success:</strong> Retention, churn & bugs
                </div>
                <div className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-200">
                  <strong className="text-indigo-400">Partnerships:</strong> Channel referral MOUs
                </div>
              </div>
            </div>

            <div className="slide-box bg-slate-900/60 border border-amber-500/30 p-4 rounded-xl">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>The Difficult Routing Case: M03 Asterloom</span>
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                <strong>The Tension:</strong> Asterloom is simultaneously an active deal (pilot for 4-5 employees, CFO review) AND a severe coaching event (rep sprang a 50% setup fee increase during pricing).
              </p>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                <strong>Our Solution:</strong> Dual-routed into both <code>exports/deal_next_steps/</code> and <code>exports/sales_coaching/</code>. Context is preserved by cross-referencing all assigned destinations in the manifest and markdown headers.
              </p>
              <div className="text-[11px] text-slate-400 mt-2 bg-slate-950 p-2 rounded border border-slate-800">
                <em>Preserved Manager Correction:</em> Manager can override any route; manual choices persist across 02_update delivery and restarts.
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 4
    {
      id: 4,
      tag: 'Verification of Numbers & Evidence',
      title: 'Verification: Numbers & Analytical Conclusions',
      subtitle: 'Rigorous denominator accounting and verifiable transcript tracing',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="slide-box bg-slate-900/60 border border-cyan-500/30 p-4 rounded-xl">
              <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                <span>Checking a Key Headline Number</span>
              </h4>
              <div className="text-xs text-slate-300 mt-2 space-y-2">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <strong>Metric Checked:</strong> Telephony Connection Rate (30.0%)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Verification Method:</strong> We verified all 30 calls against the data contract:
                  <br />• 30 calls total in dataset; all 30 have non-null <code>is_connected</code> booleans.
                  <br />• Exactly 9 calls have <code>is_connected: true</code> (C01-C03, C05-C10).
                  <br />• 21 calls have <code>is_connected: false</code> (B01-B20, C04 voicemail).
                  <br />• Formula: 9 ÷ 30 = <strong>30.0%</strong>. Denominator is explicitly documented.
                </p>
              </div>
            </div>

            <div className="slide-box bg-slate-900/60 border border-purple-500/30 p-4 rounded-xl">
              <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4" />
                <span>Checking an Analytical Conclusion</span>
              </h4>
              <div className="text-xs text-slate-300 mt-2 space-y-2">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <strong>Conclusion Checked:</strong> M07 is a CS Bug Escalation, not Sales
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Verification Method:</strong> Prior to update, M07 was classified as <code>AWAITING_UPDATE</code>. 
                  When 02_update arrived with 27 turns, we traced 4 distinct reproducible UI/backend bugs:
                  <br />• Description edit fails to save (Turn 3-7)
                  <br />• Recreate payment attachment fails (Turn 13-15)
                  <br />• Bulk reimbursements stuck in Processing (Turn 19)
                  <br />• Sticky payment modal amount (Turn 22-25)
                  <br />→ Proves conclusively this belongs in <strong>Customer Success & Bug Triage</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 5
    {
      id: 5,
      tag: 'Trade-offs, Rejected Decision & Next Steps',
      title: 'Trade-offs, Rejected Alternative & Roadmap',
      subtitle: 'Transparent boundaries, AI usage disclosure, and future development',
      content: (
        <div className="space-y-4">
          <div className="slide-box bg-slate-900/60 border border-rose-500/40 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>One Decision We Deliberately Rejected</span>
            </h4>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              <strong>The Alternative Considered:</strong> Automatically calculating a headline "Total Pipeline Value ($ / INR)" by regex-parsing spoken currency figures from transcripts (e.g. INR 10-13 lakh card spend in M03, INR 1.3 crore line in M04, USD 260 bounty in M01).
            </p>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              <strong>Why Rejected & Accepted Trade-off:</strong> Customer operational spending is NOT SpendNest contract revenue. In M03, SpendNest's actual fee was INR 26k subscription + INR 13k setup, while M02 was a cost, not revenue. Synthesizing speculative ARR figures violates the data dictionary and misleads executives. We accepted the trade-off of reporting verifiable conversation counts and commercial stages rather than ungrounded currency totals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <strong className="text-cyan-400 uppercase tracking-wider text-[11px]">AI Usage Disclosure</strong>
              <p className="text-slate-300 mt-1 leading-relaxed">
                Analyses and evidence links are pre-computed using LLM parsing over adapted transcripts, then deterministically verified and served client-side. No paid AI API key is needed at runtime, guaranteeing zero-latency offline operation.
              </p>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <strong className="text-indigo-400 uppercase tracking-wider text-[11px]">Known Limitations & Next Steps</strong>
              <p className="text-slate-300 mt-1 leading-relaxed">
                Current release evaluates a single date slice (21 Aug 2026). Next improvements: live webhook listener for CRM sync, automated Jira integration for M07 bugs, and cross-meeting contact relationship clustering.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const current = slides[currentSlide];

  return (
    <div className="slides-container">
      {/* Slides Top Bar */}
      <div className="slides-nav-bar">
        <div className="flex items-center gap-2">
          <Presentation className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-white text-base">Executive Presentation Deck</span>
          <span className="text-xs text-slate-300 ml-2">Slide {currentSlide + 1} of {slides.length}</span>
        </div>

        {/* Slide Selector Buttons */}
        <div className="flex items-center gap-1.5">
          {slides.map((s, idx) => (
            <button 
              key={s.id}
              className={`slide-pill ${currentSlide === idx ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            >
              <span>Slide {s.id}</span>
            </button>
          ))}
        </div>

        {/* Prev / Next Controls */}
        <div className="flex items-center gap-2">
          <button 
            className="btn-slide-nav"
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>
          <button 
            className="btn-slide-nav"
            onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === slides.length - 1}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="slide-frame">
        <div className="slide-header">
          <span className="slide-tag">{current.tag}</span>
          <h2 className="slide-title">{current.title}</h2>
          <p className="slide-subtitle">{current.subtitle}</p>
        </div>

        <div className="slide-body">
          {current.content}
        </div>

        <div className="slide-footer">
          <span className="text-xs text-slate-400">SpendNest Revenue Intelligence Inbox • Candidate Submission 2026</span>
          <span className="text-xs text-indigo-400 font-mono">Slide {current.id} / 5</span>
        </div>
      </div>
    </div>
  );
}
