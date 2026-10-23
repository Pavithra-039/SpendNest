import { useState, useEffect } from 'react';
import { RevenueInboxEngine } from './engine';
import PageDashboard from './PageDashboard';
import PageInbox from './PageInbox';
import PageReplay from './PageReplay';
import PageExports from './PageExports';
import PageSlides from './PageSlides';
import PageVideo from './PageVideo';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'inbox', label: 'Inbox', icon: '✉' },
  { id: 'replay', label: 'Replay Engine', icon: '▶' },
  { id: 'exports', label: 'Exports', icon: '⬇' },
  { id: 'slides', label: 'Slides', icon: '▣' },
  { id: 'video', label: 'Video Script', icon: '◉' },
];

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [engine] = useState(() => new RevenueInboxEngine());
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    const loaded = engine.loadFromStorage();
    if (!loaded || engine.records.size === 0) {
      engine.resetToPostUpdateClean();
    }
    setEngineReady(true);
  }, [engine]);

  const renderPage = () => {
    if (!engineReady) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
          <div className="spinner" />
          <span className="text-secondary">Initializing engine...</span>
        </div>
      );
    }
    switch (activePage) {
      case 'dashboard': return <PageDashboard engine={engine} />;
      case 'inbox': return <PageInbox engine={engine} />;
      case 'replay': return <PageReplay engine={engine} />;
      case 'exports': return <PageExports engine={engine} />;
      case 'slides': return <PageSlides />;
      case 'video': return <PageVideo />;
      default: return <PageDashboard engine={engine} />;
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">
            <div className="sidebar-logo-icon">SN</div>
            <div>
              <div className="sidebar-logo-text">SpendNest</div>
              <div className="sidebar-logo-sub">Revenue Intelligence</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Navigation</div>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`sidebar-nav-item${activePage === item.id ? ' active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon" style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          21 August 2026 &bull; Asia/Kolkata
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}
