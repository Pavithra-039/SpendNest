# SpendNest Revenue Intelligence Inbox

A manager workspace and revenue intelligence inbox designed to turn fragmented telephony records, scheduled meeting logs, and late-arriving transcripts into dependable daily operational intelligence.

---

## 1. Quick Start & Execution

The application is completely self-contained. You can run it via the local Node.js server, explore the production build, or double-click the standalone zero-dependency application.

### Option A: Local Server (Recommended)
From the project directory:
```bash
node server.js
```
Open **[http://localhost:3000](http://localhost:3000)** in any modern web browser.
*(The zero-dependency server serves the production-optimized build and handles client routing automatically).*

### Option B: Standalone Zero-Dependency App (Double-Click Execution)
Double-click **`app.html`** or **`dist/standalone_single_file.html`** to run the complete workspace directly in Chrome, Edge, Safari, or Firefox without requiring any web server, build tools, or network connection.

### Option C: Development Server
```bash
node ./node_modules/vite/bin/vite.js
# or: npm run dev
```

---

## 2. Reproducing the Replay & Contract Verification Checks

The application strictly enforces all five contract rules defined in `DATA_CONTRACT.md`:
1. **Record Identity:** Strictly keyed by `(source_type, source_id)`. Never keyed by company name, title, record_ref, or array positions.
2. **Idempotent Imports:** Re-importing a delivery (even in reversed/shuffled order) results in zero duplicates.
3. **Revision Precedence:** Higher revision replaces entire source and transcript payloads. Same or older revisions are ignored.
4. **Preserved Manual Judgment:** An explicit manual route correction survives subsequent batch imports, application restarts, and browser refreshes.
5. **Freshness Tracking:** Differentiates between automated suggestions and manual decisions.

### How to Reproduce via the App UI:
1. Open the application and click **"Replay Engine"** in the top header.
2. Click **"Execute Step 1 (Initial Batch)"**:
   - Ingests `01_initial.json` (Rev 1).
   - Validates **44 unique records** (30 calls, 14 meetings).
   - Usable transcript count is **17**; record **M07** has 0 turns and state `AWAITING_UPDATE`.
3. Click **"Execute Step 2 (Repeat with Shuffled Order)"**:
   - Re-imports the initial delivery with randomized array ordering.
   - Verifies the unique record count remains **44** (no inflated activity counts).
4. Click **"Execute Step 3 (Manual Route Correction)"**:
   - Manually assigns **M07** to `['Customer Success & Risk', 'Engineering Defect Triage']`.
   - `is_manually_overridden` is set to `true`.
5. Click **"Execute Step 4 (Apply 02_update.json)"**:
   - Applies Revision 2 for **M07** (Willowfield Trust).
   - Record count stays strictly **44** (not 45).
   - M07 receives all **27 turns**; usable transcript count increases from 17 to **18**.
   - **Crucial Check:** The manual route `['Customer Success & Risk', 'Engineering Defect Triage']` is **fully preserved**!
6. Click **"Execute Step 5 (Re-import Initial Batch)"**:
   - Re-imports `01_initial.json`.
   - Older Revision 1 is ignored. Unique count stays 44, M07 remains Revision 2, and manual route remains active.
7. **Refresh Browser / Restart:** Reload the browser page to confirm all state and manual overrides persist via local storage.

### How to Reproduce via Terminal Script:
```bash
node scripts/test_replay_contract.cjs
```
This headless script executes the entire 5-step test sequence and outputs a comprehensive pass/fail audit trail.

---

## 3. Where Outputs are Written & Export Architecture

Generated exports are physically produced in the `exports/` directory, segregated into differentiated operational folders:

```text
exports/
├── manifest.json                                      # Machine-readable JSON manifest
├── manifest.csv                                       # Machine-readable CSV manifest
├── daily_briefs/
│   └── manager_brief_2026_08_21.md                   # Daily synthesis for 21 Aug 2026 (Asia/Kolkata)
├── deal_next_steps/                                   # Qualified commercial pipeline opportunities
│   ├── C02_call_deal_next_steps.md
│   ├── C03_call_deal_next_steps.md                   # Milan API access follow-up
│   ├── C05_call_deal_next_steps.md                   # StoreHarbor competitor intel & nurture
│   ├── C07_call_deal_next_steps.md                   # Willowbank Advisory partnership
│   ├── C08_call_deal_next_steps.md                   # People Operations internal referral
│   ├── C09_call_deal_next_steps.md                   # Mr Rishabh LinkedIn outreach
│   ├── C10_call_deal_next_steps.md                   # Manufacturing passive nurture
│   ├── M01_meeting_deal_next_steps.md                # Harborpath Advisory partner agreement
│   ├── M03_meeting_deal_next_steps.md                # Asterloom Systems CFO proposal
│   └── M06_meeting_deal_next_steps.md                # Mapletrail Services AR automation
├── sales_coaching/                                    # Tactical coaching opportunities
│   ├── C01_call_sales_coaching.md                    # Cold qualification & relevance coaching
│   ├── C09_call_sales_coaching.md                    # Name referral boundary adherence
│   ├── M03_meeting_sales_coaching.md                 # Upfront pricing transparency coaching
│   └── M04_meeting_sales_coaching.md                 # Software positioning over bank feeds
├── customer_success/                                  # Existing accounts, churn & defect triage
│   ├── M04_meeting_customer_success.md               # Cedarwave prepaid-to-credit churn threat
│   ├── M07_meeting_customer_success.md               # Willowfield 4 production bugs & release lock
│   └── M09_meeting_customer_success.md               # Brookmint token expiration & admin permissions
├── partnerships/                                      # Formation & ecosystem referral channels
│   ├── C07_call_partnerships.md                      # Willowbank Advisory virtual account referral
│   └── M01_meeting_partnerships.md                   # Harborpath MOU & unique tracking link
├── vendor_evaluation/                                 # SpendNest software & vendor evaluations
│   └── M02_meeting_vendor_evaluation.md              # LedgerBridge e-invoicing API evaluation
├── internal_ops/                                      # Internal training & billing policy
│   └── M10_meeting_internal_ops.md                   # Back-office 10-day dunning cycle walkthrough
└── disqualified/                                      # Firm rejections & out-of-scope accounts
    ├── C01_call_disqualified.md                      # Harborlight cold rejection
    └── C06_call_disqualified.md                      # Entrenched internal automation
```

### Context Preservation Across Destinations
When a conversation requires more than one operational output (e.g. **M03 Asterloom** is both a commercial deal for the sales team and a pricing transparency coaching item for the manager), our architecture generates separate dedicated documents in both `exports/deal_next_steps/` and `exports/sales_coaching/`. Both files and the central manifests cross-reference all assigned destinations, ensuring neither team loses context.

To download all exported files as a compressed archive directly from the UI, click **"Export ZIP"** in the top header. To regenerate via command line:
```bash
node scripts/generate_exports.cjs
```

---

## 4. Headline Metrics & Safe Baseline Denominators

Every metric displayed in the dashboard is calculated using strictly verifiable denominators per `DATA_DICTIONARY.md`:

| Headline Metric | Display Value | Exact Formula & Denominator | Meaning & Boundary |
|---|---|---|---|
| **Total Ingested Records** | **44** | Total unique `(source_type, source_id)` records in active filter | 30 calls + 14 meetings. Replaced revisions and duplicates excluded. |
| **Usable Transcript Coverage** | **40.9%** (18/44) | Usable texts ÷ Total selected records | Non-blank call transcript or meeting with $\ge 1$ turn. (Calls: 10/30 = 33.3%, Mtgs: 8/14 = 57.1%). |
| **Telephony Connection Rate** | **30.0%** (9/30) | Calls with `is_connected: true` ÷ Calls with non-null `is_connected` | Stored upstream classification. 9 connected calls ÷ 30 calls with reported status. |
| **Substantive Conversation Rate** | **30.0%** (9/30) | Calls with `is_conversation: true` ÷ Total calls in selection (30) | Machine-reported substantive dialogue classification. |
| **Assigned Destinations** | **26** | Sum of all active route destinations across selected records | Includes multi-destination assignments (e.g. M01, M03, M04). Exceeds unique records by design. |
| **Manual Overrides Active** | **Variable** (0-1+) | Records where manager explicitly modified automated suggestion | Persisted across batch updates and browser sessions. |

*Note: Meeting organizers (e.g. team06@example.com) are explicitly separated from call representatives (Arun, Meera, Dev, Kiran, Leela). An organizer is not assumed to be the salesperson or an attendee.*

---

## 5. Three Most Important Findings (Linked to Evidence)

### Finding 1: False Pipeline Pollution & Vendor Role Reversal
- **Observation:** Upstream CRMs routinely classify all calendar meetings organized by internal staff as sales opportunities. Record **M02** ("LedgerBridge / SpendNest discussion") appeared in calendar feeds as a potential sales deal. Reading the transcript reveals that SpendNest is actually the *buyer/evaluator* and LedgerBridge is an external vendor demonstrating an electronic invoicing API for SpendNest's upcoming accounts receivable module.
- **Source Passage Reference:** Meeting `M02` Turn 1 (*"We want to understand whether LedgerBridge can give us compliant invoicing coverage across our operating markets"*) and Turn 30 (*"Team member A: And the commercial relationship is between SpendNest and LedgerBridge? We are providing this to our customers through our product, rather than asking them to buy from you separately. Supplier A: Correct"*).
- **Exact Product Impact:** Routed to `Vendor / Product Evaluation` rather than sales pipeline, completely isolating its EUR 2,600–6,500 setup cost from sales quota forecasts.

### Finding 2: False Positive Upstream Outcome vs. Explicit Prospect Rejection
- **Observation:** The telephony system labeled call **C10** as `observed_outcome: "follow_up"`. A sales manager relying on stored tags would schedule an SDR callback. However, the transcript reveals contact Aniket no longer works at Meadowbrick, transitioned to a manufacturing firm, and when asked if a follow-up call next week was acceptable, emphatically rejected future outreach.
- **Source Passage Reference:** Call `C10` exact quote: *"Would a follow-up call on Monday or Tuesday next week be okay, in case you have any questions? No. I said I will contact you if there is anything to discuss."*
- **Exact Product Impact:** The inbox flags an inline `Stored Classification Discrepancy` badge and re-routes the record to `Nurture / Passive Follow-Up`, preventing reps from damaging prospect goodwill with unsolicited calls.

### Finding 3: Critical Churn / Expansion Blocker — Value Proposition Collapse on Bank Feeds
- **Observation:** Existing customer Cedarwave Distribution (**M04**) must migrate off an expiring prepaid card program. The customer has an existing INR 1.3 crore corporate credit facility with their bank and refuses to remain on prepaid cards. When SpendNest offered to connect their bank credit cards via transaction feed, the rep admitted SpendNest cannot display available credit balances in real-time. Customer B immediately challenged the product's fundamental ROI.
- **Source Passage Reference:** Meeting `M04` Turn 25-26 (*"Team member A: No, the proposed feed shows transaction details after settlement... available limit would not be shown... Customer B: Then what do we gain by adding SpendNest? We can already see transactions in the bank portal"*).
- **Exact Product Impact:** Flagged as Priority #1 Churn Escalation in the Manager Daily Brief, prompting immediate intervention by the Head of CS before the customer cancels all card programs.

---

## 6. One Deliberately Rejected Decision

### Rejected Alternative:
Automatically calculating a headline **"Total Pipeline ARR / Currency Rollup"** on the manager dashboard by parsing stated currency values from transcripts (e.g. summing INR 10–13 lakh card spend in M03, INR 1.3 crore bank facility in M04, and USD 260 partner bounty in M01).

### Why Rejected & Accepted Trade-off:
Customer operational expenditure is **not** SpendNest software revenue. In M03, SpendNest's actual fee was an INR 26,000 annual subscription plus an INR 13,000 setup fee; the INR 13 lakh was employee travel spend. In M04, the credit line belongs to an external bank. In M02, the EUR 6,500 is an outflow, not inflow. Fabricating a synthetic pipeline currency total violates `DATA_DICTIONARY.md` (*"Do not invent pipeline value, deal outcomes or account links that the data does not establish"*) and encourages misleading commercial commitments.

**The Accepted Trade-off:** We display strictly verifiable conversation counts, transcript coverage ratios, customer-stated operational transaction volumes, and commercial qualification stages, while intentionally leaving pipeline currency totals uncomputed until backed by formal CRM contracts.

---

## 7. AI Usage, Pre-Generated vs Dynamic Execution, and Limitations

### AI & Implementation Architecture:
- **Pre-Generated Analysis:** High-accuracy conversational analyses, turn-based evidence citations, and boundary definitions were synthesized using Large Language Models over the adapted transcripts and verified against the source text.
- **Dynamic Runtime Engine:** The frontend and server dynamically compute all metrics, denominators, filter cross-sections, revision deduplication, manual override persistence, and in-memory ZIP package creation.
- **Zero API Dependency:** No paid external AI service is invoked at runtime, ensuring 100% offline reliability, instant performance, and zero credential leakage.

### Known Limitations & Unfinished Work:
- **Single-Day Date Scope:** All supplied records represent activity on 21 August 2026. A multi-date calendar picker was intentionally omitted because no multi-day activity exists in the extract.
- **Lack of CRM Opportunity Table:** Because no authoritative opportunity table was supplied, deal stages are derived from conversational signals rather than CRM deal stages.
- **Future Enhancements:** Webhook ingestion endpoints, automated Jira ticket creation for M07 software bugs, and multi-tenant user access management.

---

## 8. Summary of Candidate Effort

- **Approximate Time Spent:** 7.5 hours (Requirements analysis, replay engine design, frontend dashboard implementation, export manifest generation, presentation slides, and documentation).
