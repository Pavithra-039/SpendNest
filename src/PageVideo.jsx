const SECTIONS = [
  {
    num: 1,
    title: 'Opening Hook',
    time: '0:00 - 0:45',
    text: 'Start by framing the scale of the problem. On a single working day, your sales team made 44 outbound and inbound contacts. But how many of those actually drove revenue-critical insight to the right people? Today I\'m going to walk you through SpendNest\'s Revenue Intelligence Inbox — a system that routes every conversation automatically to exactly the team that needs to act on it.',
    callout: '"44 contacts. One day. Zero manually sorted emails."'
  },
  {
    num: 2,
    title: 'The Problem — Information Black Holes',
    time: '0:45 - 2:00',
    text: 'In most sales organizations, conversation intelligence lives in silos. Call recordings go to the call platform. Meeting summaries go to Fireflies or Otter. Escalations get buried in Slack threads. Deals die in inbox limbo. The result: managers don\'t know what happened until it\'s too late. Churn goes undetected. Coaching opportunities are missed. Partnership conversations evaporate without follow-up.',
    callout: '"You can\'t coach what you can\'t see. You can\'t prevent churn you didn\'t hear."'
  },
  {
    num: 3,
    title: 'How the Engine Works',
    time: '2:00 - 4:00',
    text: 'SpendNest\'s Revenue Intelligence Engine ingests structured data from two sources: outbound and inbound call logs, and scheduled meeting transcripts from the Fireflies API. Each record is matched against our conversation analysis database, which provides per-record routing decisions across 11 destination categories. These include Deal Next Steps, Sales Coaching, Customer Success & Risk, Partnership/Channel, and more. The engine also supports batch revision rules — if a new data revision arrives, records are updated automatically while manually set routes from managers are preserved.',
    callout: '"Revision-aware. Override-safe. Audit-ready."'
  },
  {
    num: 4,
    title: 'Live Results — 21 August 2026',
    time: '4:00 - 5:30',
    text: 'On this single day, we processed 44 intake records. 18 conversations had substantive transcript content and were analyzed and routed. That is a 40.9% coverage rate — 33.3% of calls, 57.1% of meetings. From these 18 conversations, the engine surfaced 3 immediate escalations requiring same-day action, 4 active deal opportunities requiring written follow-up, and 3 coaching moments for the SDR and AE team. All of this delivered to the right folder, the right Slack channel, the right person — without a single manual sort.',
    callout: '"From raw intake data to manager action list in under 60 seconds."'
  },
  {
    num: 5,
    title: 'The Manager Override Story',
    time: '5:30 - 6:30',
    text: 'One of the most important features of the system is trust. Managers must be able to override any AI routing decision. When M07 — the Willowfield Trust production bug session — arrived in revision 1, it was initially flagged Awaiting Update. The manager manually rerouted it to Customer Success & Risk. When revision 2 arrived with the full transcript, the engine updated the record — but preserved the manager\'s routing decision. That\'s what we call manual preservation across revision boundaries.',
    callout: '"AI suggests. Manager decides. System respects."'
  },
  {
    num: 6,
    title: 'Closing & Call to Action',
    time: '6:30 - 7:00',
    text: 'Revenue intelligence is not just about recording conversations. It is about closing the loop from conversation to action. SpendNest\'s Revenue Intelligence Inbox gives your sales managers the clarity to act on what they hear, coach what they see, and protect revenue before it walks out the door. If you want to see this running in your org, book a demo at spendnest.com/demo.',
    callout: '"Every conversation is a signal. The question is whether you\'re listening."'
  }
];

export default function PageVideo() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Video Script</h1>
        <p className="page-subtitle">Structured guide for the Revenue Intelligence Inbox walkthrough video (~7 min)</p>
      </div>

      {/* Total time badge */}
      <div className="flex gap-3 mb-6">
        <span className="badge badge-accent">6 sections</span>
        <span className="badge badge-default">~7 minutes total</span>
        <span className="badge badge-green">Screen recording recommended</span>
      </div>

      {SECTIONS.map(section => (
        <div key={section.num} className="script-section">
          <div className="script-section-header">
            <div className="script-section-num">{section.num}</div>
            <div className="script-section-title">{section.title}</div>
            <div className="script-section-time">{section.time}</div>
          </div>
          <div className="script-text">{section.text}</div>
          {section.callout && (
            <div className="script-callout">{section.callout}</div>
          )}
        </div>
      ))}

      {/* Production Notes */}
      <div className="card" style={{ borderColor: '#C7D2FE', background: '#EEF2FF' }}>
        <div className="card-title" style={{ marginBottom: 10, color: '#4338CA' }}>Production Notes</div>
        <ul style={{ paddingLeft: 18, fontSize: 13.5, lineHeight: 2, color: '#3730A3' }}>
          <li>Record screen capture of the live Revenue Intelligence Inbox UI during sections 3 and 4</li>
          <li>Show the Replay Engine running all 5 steps during section 3 discussion</li>
          <li>Demo the manual override on M07 live during section 5</li>
          <li>Use the Dashboard charts as B-roll during sections 4 and 5</li>
          <li>End with the Slides deck visible on screen during the closing section</li>
          <li>Recommended: 1080p, 30fps, with camera picture-in-picture in corner</li>
        </ul>
      </div>
    </div>
  );
}
