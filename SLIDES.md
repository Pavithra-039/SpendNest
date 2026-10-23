# SpendNest Revenue Intelligence Inbox — Five Slide Executive Presentation

---

## Slide 1: The Manager Problem & Three Critical Findings

### The Core Manager Problem
Sales managers receive raw telephony metadata, incomplete meeting transcripts, and misleading machine labels from disparate tools. Without rigorous intake reconciliation, managers assign unwanted cold dials, misjudge rep coaching needs, and pollute forecasting pipelines with non-sales vendor conversations.

### Finding 1: False Pipeline Pollution (M02: LedgerBridge Role Reversal)
- **Observation:** Calendar title and internal organizer tempted automated CRM pipelines to treat this as an outbound sales opportunity. Reading the transcript reveals that SpendNest is the *buyer* evaluating an electronic invoicing API for its Q4 receivables roadmap.
- **Evidence Reference:** Meeting `M02` Turn 1 & Turn 30 (*"Team member A: And the commercial relationship is between SpendNest and LedgerBridge? We are providing this to our customers through our product, rather than asking them to buy from you separately. Supplier A: Correct"*).
- **Product Impact:** Re-routed to `Vendor / Product Evaluation`, isolating its EUR 2,600–6,500 setup cost from sales quota forecasts.

### Finding 2: False Positive Upstream Status (C10: Explicit Prospect Rejection)
- **Observation:** Upstream machine labeled call as `observed_outcome: "follow_up"`. Contact Aniket moved to manufacturing and explicitly forbade follow-up calls next week, stating he will reach out if interested.
- **Evidence Reference:** Call `C10` quote: *"Would a follow-up call on Monday or Tuesday next week be okay, in case you have any questions? No. I said I will contact you if there is anything to discuss."*
- **Product Impact:** Re-routed to `Nurture / Passive Follow-Up` with an inline `Discrepancy Warning` badge, protecting prospect goodwill.

### Finding 3: Value Proposition Collapse on Bank Feeds (M04: Cedarwave Churn Risk)
- **Observation:** Customer cannot use prepaid cards and needs credit. Rep offered bank card feeds, but conceded available credit limits will not display in real-time, causing customer to challenge SpendNest's value.
- **Evidence Reference:** Meeting `M04` Turn 25-26 (*"Customer B: Then what do we gain by adding SpendNest? We can already see transactions in the bank portal."*).
- **Product Impact:** Escalated to Priority #1 Churn Alert in the Manager Daily Brief, prompting immediate intervention before cancellation.

---

## Slide 2: Interface Choices: Signal Over Noise

### What We Prioritized & Included
- **Explicit Denominators on Every Headline Metric:** Hovering or clicking any KPI reveals the exact mathematical formula and accounting boundary (e.g. non-null connection flags).
- **Call Rep vs Meeting Organizer Role Separation:** Recognizes that calendar organizers (team06-12) are not automatically sales representatives or meeting attendees.
- **Inline Discrepancy Badges:** Highlights records where stored telephony outcomes conflict directly with spoken transcript dialogue (C06, C10, M02).
- **Source-Evidence Inspector:** Side-by-side drawer displaying exact 1-based speaker turn numbers alongside structured analytical summaries.
- **Deterministic Replay Simulator:** In-browser testing suite allowing reviewers to verify the 5 contract replay steps in seconds.

### What We Deliberately Left Out
- **Synthetic ARR / Pipeline Currency Totals:** No CRM opportunity table exists. Inventing dollar pipelines from casual speech figures violates evidence rules.
- **Cross-Rep Gamification Leaderboards:** The extract is a selective sample across one day, not a representative measure of staff performance.
- **Unsubstantiated Account Linking:** We do not merge contacts into assumed parent accounts without confirmed company IDs.
- **Hallucinated Summaries for Silent Records:** Missing or silent records (B01-B20, M05, M08) are cleanly marked as metadata-only without invented text.

---

## Slide 3: Routing Architecture & One Difficult Case

### Differentiated Operational Taxonomy
Routing means directing insights to the team that must act. Outputs are physically segregated into 7 dedicated folders with machine manifests:
1. `exports/deal_next_steps/`: Qualified commercial pipeline opportunities
2. `exports/sales_coaching/`: Tactical coaching opportunities
3. `exports/customer_success/`: Retention, churn & bug triage
4. `exports/partnerships/`: Channel referral agreements
5. `exports/vendor_evaluation/`: Supplier and module evaluations
6. `exports/internal_ops/`: Operational policies and training
7. `exports/disqualified/`: Firm rejections and out-of-scope accounts

### The Difficult Routing Case: M03 Asterloom Systems
- **The Tension:** Asterloom is simultaneously an active deal (pilot for 4-5 employees, CFO review) AND a severe coaching event (rep sprang a 50% setup fee increase during pricing).
- **Our Solution:** Dual-routed into both `exports/deal_next_steps/` and `exports/sales_coaching/`. Context is preserved by cross-referencing all assigned destinations in the manifest and markdown headers.
- **Preserved Manager Correction:** Manager can override any route; manual choices persist across 02_update delivery and restarts.

---

## Slide 4: Verification: Numbers & Analytical Conclusions

### Checking a Key Headline Number: Telephony Connection Rate (30.0%)
- **Verification Method:** Checked against source data contract:
  - 30 calls total in dataset; all 30 have non-null `is_connected` booleans.
  - Exactly 9 calls have `is_connected: true` (C01-C03, C05-C10).
  - 21 calls have `is_connected: false` (B01-B20, C04 voicemail).
  - Formula: 9 ÷ 30 = **30.0%**. Denominator is explicitly documented.

### Checking an Analytical Conclusion: M07 is a CS Bug Escalation, Not Sales
- **Verification Method:** Prior to update, M07 was classified as `AWAITING_UPDATE`. When 02_update arrived with 27 turns, we traced 4 distinct reproducible UI/backend bugs:
  - Description edit fails to save (Turn 3-7)
  - Recreate payment attachment fails (Turn 13-15)
  - Bulk reimbursements stuck in Processing (Turn 19)
  - Sticky payment modal amount (Turn 22-25)
  - **Conclusion:** Belongs definitively in **Customer Success & Bug Triage**.

---

## Slide 5: Trade-offs, Rejected Alternative & Roadmap

### One Decision We Deliberately Rejected
- **The Alternative Considered:** Automatically calculating a headline "Total Pipeline Value ($ / INR)" by regex-parsing spoken currency figures from transcripts (e.g. INR 10-13 lakh card spend in M03, INR 1.3 crore line in M04, USD 260 bounty in M01).
- **Why Rejected & Accepted Trade-off:** Customer operational spending is NOT SpendNest contract revenue. In M03, SpendNest's actual fee was INR 26k subscription + INR 13k setup, while M02 was a cost, not revenue. Synthesizing speculative ARR figures violates the data dictionary and misleads executives. We accepted the trade-off of reporting verifiable conversation counts and commercial stages rather than ungrounded currency totals.

### AI Usage Disclosure
Analyses and evidence links are pre-computed using LLM parsing over adapted transcripts, then deterministically verified and served client-side. No paid AI API key is needed at runtime, guaranteeing zero-latency offline operation.

### Known Limitations & Roadmap
Current release evaluates a single date slice (21 Aug 2026). Next improvements include live webhook listeners for CRM sync, automated Jira integration for M07 software defects, and multi-tenant access control.
