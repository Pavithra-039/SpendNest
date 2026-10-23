import { useState } from 'react';

const SLIDES = [
  {
    number: 'Slide 01 of 05',
    title: 'SpendNest Revenue Intelligence Inbox',
    tagline: 'Automated conversation routing & manager oversight for 21 August 2026',
    bullets: [
      { icon: '📊', text: '<strong>44 intake records</strong> processed — 30 calls, 14 scheduled meetings across the sales & CS team.' },
      { icon: '🎯', text: '<strong>18 conversations</strong> with substantive transcripts routed to actionable destinations.' },
      { icon: '🤖', text: '<strong>AI-assisted routing</strong> classifies each conversation automatically; manager overrides preserved across batch updates.' },
      { icon: '⚡', text: '<strong>Real-time replay engine</strong> simulates full import cycle with audit trail for compliance review.' },
    ]
  },
  {
    number: 'Slide 02 of 05',
    title: 'Coverage & Transcript Analysis',
    tagline: 'Understanding what we captured and what we missed',
    bullets: [
      { icon: '✅', text: '<strong>40.9% overall coverage</strong> — 18 of 44 records contain usable transcript content for intelligence extraction.' },
      { icon: '📞', text: '<strong>Call coverage: 33.3%</strong> — 10 of 30 calls connected and generated conversation content (C01-C10).' },
      { icon: '🗓', text: '<strong>Meeting coverage: 57.1%</strong> — 8 of 14 scheduled meetings recorded speech (M01-M04, M06, M07, M09, M10).' },
      { icon: '🔇', text: '<strong>26 records unusable</strong> — background telephony, silent recordings, cancelled or unscheduled bot captures.' },
    ]
  },
  {
    number: 'Slide 03 of 05',
    title: 'Top Escalations & Churn Risks',
    tagline: 'Immediate action required on 3 critical accounts',
    bullets: [
      { icon: '🚨', text: '<strong>Cedarwave Distribution (M04)</strong> — Prepaid card programme closing in weeks. Credit card need unmet. Risk of full churn.' },
      { icon: '🐛', text: '<strong>Willowfield Trust (M07)</strong> — 4 live production bugs demonstrated. Reimbursement batch locked. P1 eng tickets required within 2 hrs.' },
      { icon: '🔐', text: '<strong>Brookmint Holdings (M09)</strong> — Onboarding blocked by auth token expiry bug. AP separation-of-duties conflict also identified.' },
      { icon: '📋', text: 'All 3 escalations have been routed to Customer Success & Risk with assigned owners for same-day resolution.' },
    ]
  },
  {
    number: 'Slide 04 of 05',
    title: 'Deal Pipeline & Partnership Opportunities',
    tagline: 'Active commercial opportunities requiring follow-up this week',
    bullets: [
      { icon: '🤝', text: '<strong>Harborpath Advisory (M01)</strong> — Channel partnership near close. MOU + custom referral link + marketing intro required.' },
      { icon: '💼', text: '<strong>Asterloom Systems (M03)</strong> — 65-employee demo firm. CFO proposal needed with setup fee itemized separately from subscription.' },
      { icon: '🌐', text: '<strong>Willowbank Advisory (C07)</strong> — Overseas formation firm confirming routine referrals. Send partnership overview today.' },
      { icon: '⚙', text: '<strong>Milan Developer (C03)</strong> — API + webhooks proposal requested. Kiran to send by Monday with follow-up call scheduled.' },
    ]
  },
  {
    number: 'Slide 05 of 05',
    title: 'Sales Coaching Priorities',
    tagline: 'Three immediate coaching conversations for the team this week',
    bullets: [
      { icon: '💰', text: '<strong>Pricing Transparency (M03 / Asterloom)</strong> — Always separate one-time integration fee from recurring subscription at deal start. Never surprise at close.' },
      { icon: '🚫', text: '<strong>Cold Outreach Boundaries (C09 & C10)</strong> — Praise Meera\'s boundary-checking in C09. Block follow-up call to Aniket per C10 explicit opt-out.' },
      { icon: '🏦', text: '<strong>Bank Feed vs Native Card Pitch (M04)</strong> — Train reps to lead with software value (policy, receipts, ERP sync) before discussing card product limits.' },
      { icon: '📈', text: 'All coaching notes exported to sales_coaching/ folder with supporting evidence and rep-specific next steps.' },
    ]
  }
];

export default function PageSlides() {
  const [current, setCurrent] = useState(0);

  const slide = SLIDES[current];

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(SLIDES.length - 1, c + 1));

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Presentation Slides</h1>
            <p className="page-subtitle">5-slide executive summary deck</p>
          </div>
          {/* Nav dots */}
          <div className="slides-nav">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`slide-dot${i === current ? ' active' : ''}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Slide Card */}
      <div className="slide-card">
        <div className="slide-number">{slide.number}</div>
        <div className="slide-title">{slide.title}</div>
        <div className="slide-tagline">{slide.tagline}</div>
        <div className="slide-content">
          {slide.bullets.map((b, i) => (
            <div key={i} className="slide-bullet">
              <span className="slide-bullet-icon">{b.icon}</span>
              <div
                className="slide-bullet-text"
                dangerouslySetInnerHTML={{ __html: b.text }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-4">
        <button
          className="btn btn-secondary"
          onClick={prev}
          disabled={current === 0}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Previous
        </button>
        <span className="text-muted text-xs">{current + 1} of {SLIDES.length}</span>
        <button
          className="btn btn-secondary"
          onClick={next}
          disabled={current === SLIDES.length - 1}
        >
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
