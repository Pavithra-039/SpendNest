import React from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  GraduationCap, 
  Building2, 
  CheckCircle, 
  ExternalLink,
  ChevronRight,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function ManagerBrief({ onInspectRecord }) {
  return (
    <div className="brief-container">
      {/* Executive Header Banner */}
      <div className="brief-banner">
        <div className="brief-banner-content">
          <div className="brief-date-tag">Asia/Kolkata • 21 August 2026</div>
          <h2 className="brief-heading">Sales Manager Daily Intelligence Brief</h2>
          <p className="brief-subheading">
            Consolidated intake assessment across 44 total records (30 phone calls, 14 calendar meetings). 
            Final state includes 18 validated conversational transcripts (10 calls, 8 meetings) after applying the late-transcript update batch.
          </p>
        </div>
        <div className="brief-kpi-strip">
          <div className="strip-item">
            <span className="strip-label">Total Ingested Records</span>
            <span className="strip-value">44</span>
            <span className="strip-sub">30 Calls • 14 Meetings</span>
          </div>
          <div className="strip-item">
            <span className="strip-label">Usable Transcript Coverage</span>
            <span className="strip-value text-emerald-400">18 / 44 (40.9%)</span>
            <span className="strip-sub">M07 Updated (27 Turns)</span>
          </div>
          <div className="strip-item">
            <span className="strip-label">High-Priority Actions</span>
            <span className="strip-value text-rose-400">3 Escalations</span>
            <span className="strip-sub">Churn, Defect & Access</span>
          </div>
        </div>
      </div>

      <div className="brief-grid">
        {/* Section 1: Urgent Escalations & Churn Hazards */}
        <div className="brief-card card-escalations">
          <div className="card-header">
            <div className="card-title-group">
              <div className="icon-wrapper bg-rose-500/20 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="card-title">1. Critical Churn & Customer Escalations</h3>
                <p className="card-desc">Immediate retention, defect triage, and onboarding blockers</p>
              </div>
            </div>
            <span className="badge-critical">Action Today</span>
          </div>

          <div className="card-body space-y-4">
            {/* Cedarwave */}
            <div className="action-item border-rose-500/30">
              <div className="action-item-header">
                <div className="flex items-center gap-2">
                  <span className="item-ref">M04</span>
                  <span className="item-name">Cedarwave Distribution</span>
                  <span className="badge-tag bg-rose-950 text-rose-300 border border-rose-800">High Churn Hazard</span>
                </div>
                <button 
                  className="btn-inspect" 
                  onClick={() => onInspectRecord('meeting', 'b0f79b3d-37ba-52f9-b2bc-58b159dd6d91')}
                >
                  <span>Inspect Evidence</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="action-text">
                <strong>Value Proposition Collapse:</strong> Existing prepaid cards close in weeks. Customer needs corporate credit (holding INR 1.3 crore bank facility) and challenged SpendNest's software layer when rep admitted bank transaction feeds cannot display real-time available limits.
              </p>
              <div className="action-evidence">
                <em>M04 Turn 25-26:</em> "Rep: Available limit would not be shown... Customer B: Then what do we gain by adding SpendNest? We can already see transactions in the bank portal."
              </div>
              <div className="action-footer">
                <span className="owner-tag"><strong>Owner:</strong> Head of CS & Solutions Engineer</span>
                <span className="status-tag">Schedule department structure cleanup & verify bank balance API</span>
              </div>
            </div>

            {/* Willowfield */}
            <div className="action-item border-amber-500/30">
              <div className="action-item-header">
                <div className="flex items-center gap-2">
                  <span className="item-ref">M07</span>
                  <span className="item-name">Willowfield Trust</span>
                  <span className="badge-tag bg-amber-950 text-amber-300 border border-amber-800">Production Bug Cluster</span>
                </div>
                <button 
                  className="btn-inspect" 
                  onClick={() => onInspectRecord('meeting', '4f304fff-fd40-5cfc-a366-0a134c445c2a')}
                >
                  <span>Inspect Evidence</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="action-text">
                <strong>4 Production Defects Demonstrated:</strong> Description edit reverts upon save; recreate payment screen blocks document attachment; bulk reimbursements locked in "Processing"; and "Mark as paid" retains previous payment amounts.
              </p>
              <div className="action-evidence">
                <em>M07 Turn 13-19:</em> Rep verified document workaround via Bill Pay Review and promised resolution on locked processing payments within 1-2 hours.
              </div>
              <div className="action-footer">
                <span className="owner-tag"><strong>Owner:</strong> Support Lead & Core Engineering</span>
                <span className="status-tag">Release stuck reimbursements; file 3 P1 bug tickets</span>
              </div>
            </div>

            {/* Brookmint / Northkite */}
            <div className="action-item border-cyan-500/30">
              <div className="action-item-header">
                <div className="flex items-center gap-2">
                  <span className="item-ref">M09</span>
                  <span className="item-name">Brookmint Holdings & Northkite</span>
                  <span className="badge-tag bg-cyan-950 text-cyan-300 border border-cyan-800">Onboarding & Auth Blocker</span>
                </div>
                <button 
                  className="btn-inspect" 
                  onClick={() => onInspectRecord('meeting', '4b5b9192-f3fc-505a-8e77-4d2ffaa54594')}
                >
                  <span>Inspect Evidence</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="action-text">
                <strong>Token TTL Expiration & Admin Separation of Duties:</strong> Brookmint employee base blocked by immediate "token has expired" errors on fresh invitation links. Customer also highlighted that AP officer has read access to shared accounts mailbox, creating admin privilege escalation.
              </p>
              <div className="action-evidence">
                <em>M09 Turn 21:</em> "It says the token has expired. This is the fresh message we just received."
              </div>
              <div className="action-footer">
                <span className="owner-tag"><strong>Owner:</strong> CS Onboarding & Identity Engineer</span>
                <span className="status-tag">Debug token TTL; guide setup of individual work identities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Commercial Priorities & Deal Next Steps */}
        <div className="brief-card card-commercial">
          <div className="card-header">
            <div className="card-title-group">
              <div className="icon-wrapper bg-emerald-500/20 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="card-title">2. Commercial Pipeline & Follow-Up Priorities</h3>
                <p className="card-desc">Active qualification, proposals, and partner channel expansion</p>
              </div>
            </div>
            <span className="badge-success">Revenue Drivers</span>
          </div>

          <div className="card-body space-y-4">
            {/* Harborpath Advisory */}
            <div className="action-item border-indigo-500/30">
              <div className="action-item-header">
                <div className="flex items-center gap-2">
                  <span className="item-ref">M01</span>
                  <span className="item-name">Harborpath Advisory</span>
                  <span className="badge-tag bg-indigo-950 text-indigo-300 border border-indigo-800">Strategic Channel MOU</span>
                </div>
                <button 
                  className="btn-inspect" 
                  onClick={() => onInspectRecord('meeting', 'cb5cecac-e68d-52b7-b10b-b0c748efc467')}
                >
                  <span>Inspect Evidence</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="action-text">
                <strong>Scalable Referral Model:</strong> Formation partner agreed to terms: USD 260 activation bounty on approved US entities, interchange revenue share, and 60-day spend bonuses. Partner insisted on unique automated link to scale and suggested co-marketing podcast.
              </p>
              <div className="action-evidence">
                <em>M01 Turn 9 & 21:</em> USD 260 bounty per approved account; partner required automated referral link over manual email introductions.
              </div>
              <div className="action-footer">
                <span className="owner-tag"><strong>Owner:</strong> Team member A (Partnerships)</span>
                <span className="status-tag">Send partner memorandum; provision unique tracking URL</span>
              </div>
            </div>

            {/* Asterloom Systems */}
            <div className="action-item border-emerald-500/30">
              <div className="action-item-header">
                <div className="flex items-center gap-2">
                  <span className="item-ref">M03</span>
                  <span className="item-name">Asterloom Systems</span>
                  <span className="badge-tag bg-emerald-950 text-emerald-300 border border-emerald-800">CFO Written Proposal</span>
                </div>
                <button 
                  className="btn-inspect" 
                  onClick={() => onInspectRecord('meeting', '398672e7-62dd-5afd-846d-0237d49792fb')}
                >
                  <span>Inspect Evidence</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="action-text">
                <strong>Domestic Cards Demo (65 Employees, ~INR 10-13 Lakh Spend):</strong> Initial pilot for 4-5 travelers. Rep quoted INR 39k, confusing customer after previously quoting INR 26k. Rep must clearly separate recurring subscription (INR 26k) from one-time setup (INR 13k).
              </p>
              <div className="action-evidence">
                <em>M03 Turn 23-28:</em> Customer requires formal breakdown to present to CFO who approves all larger commitments.
              </div>
              <div className="action-footer">
                <span className="owner-tag"><strong>Owner:</strong> Team member A (AE)</span>
                <span className="status-tag">Send itemized quote separating recurring vs setup; CFO deck</span>
              </div>
            </div>

            {/* Willowbank & Milan API */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="action-sub-item">
                <div className="flex justify-between items-center mb-1">
                  <span className="item-ref">C07</span>
                  <button 
                    className="btn-inspect-small" 
                    onClick={() => onInspectRecord('call', '428817fa-7e9e-5418-a7d4-bb396d28dfbf')}
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="font-semibold text-white text-sm">Willowbank Advisory</div>
                <p className="text-xs text-slate-300 mt-1">
                  Advisory firm routinely refers overseas incorporated entities for virtual bank accounts. Dispatch chat proposal; follow up Monday morning.
                </p>
                <div className="text-xs text-indigo-400 mt-1 font-medium">Owner: Dev (Partnerships)</div>
              </div>

              <div className="action-sub-item">
                <div className="flex justify-between items-center mb-1">
                  <span className="item-ref">C03</span>
                  <button 
                    className="btn-inspect-small" 
                    onClick={() => onInspectRecord('call', '20d509ba-d589-5334-9aef-ea4ce6105b1a')}
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="font-semibold text-white text-sm">Milan (Developer API Access)</div>
                <p className="text-xs text-slate-300 mt-1">
                  Prospect re-engaged on webhook/API pricing while traveling. Send proposal with agreed subject line today; call Monday indoors.
                </p>
                <div className="text-xs text-indigo-400 mt-1 font-medium">Owner: Kiran (AE)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Practical Sales Coaching Priorities */}
        <div className="brief-card card-coaching">
          <div className="card-header">
            <div className="card-title-group">
              <div className="icon-wrapper bg-amber-500/20 text-amber-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="card-title">3. Sales Coaching & Boundary Respect</h3>
                <p className="card-desc">Actionable behavioral coaching derived from conversation transcripts</p>
              </div>
            </div>
            <span className="badge-tag bg-amber-950 text-amber-300 border border-amber-800">Team Growth</span>
          </div>

          <div className="card-body space-y-3">
            <div className="coaching-item">
              <div className="font-semibold text-white text-sm flex items-center justify-between">
                <span>1. Pricing Transparency in Commercial Conversations (M03)</span>
                <span className="text-xs text-slate-400">Asterloom Systems</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                <strong>Coaching Point:</strong> Rep bundled a INR 13,000 setup fee into an annual subscription quote without upfront explanation, making the price appear to jump from INR 26k to INR 39k. Coach reps to quote recurring software fees and one-time implementation fees as distinct line items from day one to protect commercial trust.
              </p>
            </div>

            <div className="coaching-item">
              <div className="font-semibold text-white text-sm flex items-center justify-between">
                <span>2. Cold Outreach Boundaries & Referral Consent (C09 & C10)</span>
                <span className="text-xs text-slate-400">Meera Outreach</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                <strong>Coaching Point:</strong> In C09, praise Meera for asking permission before referencing Vedant's name (which he explicitly forbade). In C10, override the upstream "follow_up" tag: contact Aniket stated <em>"No. I said I will contact you if there is anything to discuss"</em>. Enforce respect for prospect boundaries to maintain team reputation.
              </p>
            </div>

            <div className="coaching-item">
              <div className="font-semibold text-white text-sm flex items-center justify-between">
                <span>3. Positioning Software Layer Over Third-Party Bank Feeds (M04)</span>
                <span className="text-xs text-slate-400">Cedarwave</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                <strong>Coaching Point:</strong> When a customer already has bank-issued corporate credit cards, reps must clearly articulate SpendNest's value beyond the bank portal: automated receipt attachment, department approval hierarchies, and ERP reconciliation, rather than conceding value loss when credit limits remain at the bank.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Strategic Vendor & Internal Operations */}
        <div className="brief-card card-operations">
          <div className="card-header">
            <div className="card-title-group">
              <div className="icon-wrapper bg-purple-500/20 text-purple-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="card-title">4. Strategic Vendor & Internal Operations</h3>
                <p className="card-desc">SpendNest procurement, product expansion, and operational policy</p>
              </div>
            </div>
            <span className="badge-tag bg-purple-950 text-purple-300 border border-purple-800">Strategy</span>
          </div>

          <div className="card-body space-y-3">
            <div className="action-item border-purple-500/30">
              <div className="action-item-header">
                <div className="flex items-center gap-2">
                  <span className="item-ref">M02</span>
                  <span className="item-name">LedgerBridge Evaluation</span>
                  <span className="badge-tag bg-purple-950 text-purple-300 border border-purple-800">Vendor / Supplier</span>
                </div>
                <button 
                  className="btn-inspect" 
                  onClick={() => onInspectRecord('meeting', '1a21c409-c050-5787-90af-2667e057e1b6')}
                >
                  <span>Inspect</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="action-text">
                <strong>SpendNest is the Buyer:</strong> Evaluating LedgerBridge's electronic invoicing API for Q4 receivables launch (Singapore, Australia, India). Setup costs EUR 2,600 to EUR 6,500. Volume template required before commercial review.
              </p>
              <div className="action-footer">
                <span className="owner-tag"><strong>Owner:</strong> Product Lead (Team member B) & Strategy (Team member A)</span>
                <span className="status-tag">Complete volume template; prepare management brief</span>
              </div>
            </div>

            <div className="action-item border-purple-500/30">
              <div className="action-item-header">
                <div className="flex items-center gap-2">
                  <span className="item-ref">M10</span>
                  <span className="item-name">Billing Operations Walkthrough</span>
                  <span className="badge-tag bg-purple-950 text-purple-300 border border-purple-800">Internal Training</span>
                </div>
                <button 
                  className="btn-inspect" 
                  onClick={() => onInspectRecord('meeting', '337f297d-9385-5b82-9e54-5019c1ed912c')}
                >
                  <span>Inspect</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="action-text">
                <strong>Back-Office Policy:</strong> Walkthrough of 10-day automated dunning cycle (retries on Day 3 & 7, account freeze on Day 10). Emphasized manual unfreeze and billing date adjustment rules.
              </p>
              <div className="action-footer">
                <span className="owner-tag"><strong>Owner:</strong> Operations Trainer</span>
                <span className="status-tag">Document dunning rules in operations wiki</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Complete Intake Census Table */}
      <div className="brief-census-card">
        <div className="census-header">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Complete 44-Record Intake & Review State Census</h3>
          </div>
          <p className="text-sm text-slate-400">
            Every logical source record is accounted for. Missing or unusable materials are explicitly classified without inventing substantive analysis.
          </p>
        </div>

        <div className="census-grid">
          <div className="census-box bg-emerald-950/30 border-emerald-800/40">
            <div className="text-2xl font-bold text-emerald-400">18</div>
            <div className="text-xs font-semibold text-white uppercase tracking-wider mt-1">Analyzed Transcripts</div>
            <div className="text-xs text-slate-300 mt-1">10 Calls (C01-C10) + 8 Meetings (M01-M04, M06, M07, M09, M10)</div>
          </div>

          <div className="census-box bg-slate-800/40 border-slate-700/50">
            <div className="text-2xl font-bold text-slate-300">20</div>
            <div className="text-xs font-semibold text-white uppercase tracking-wider mt-1">Background Telephony</div>
            <div className="text-xs text-slate-300 mt-1">B01-B20 (Outbound dials without supplied audio transcript)</div>
          </div>

          <div className="census-box bg-amber-950/30 border-amber-800/40">
            <div className="text-2xl font-bold text-amber-400">3</div>
            <div className="text-xs font-semibold text-white uppercase tracking-wider mt-1">Silent Recordings</div>
            <div className="text-xs text-slate-300 mt-1">M05, M08, M11 (Notetaker recorded meeting but nobody spoke)</div>
          </div>

          <div className="census-box bg-rose-950/30 border-rose-800/40">
            <div className="text-2xl font-bold text-rose-400">3</div>
            <div className="text-xs font-semibold text-white uppercase tracking-wider mt-1">Cancelled / Unscheduled</div>
            <div className="text-xs text-slate-300 mt-1">M12 & M14 (Notetaker cancelled); M13 (Not scheduled)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
