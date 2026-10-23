import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CHART_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4'];

const CUSTOM_TOOLTIP_STYLE = {
  background: '#fff',
  border: '1px solid #E2E8F0',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 12.5,
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
};

export default function PageDashboard({ engine }) {
  const [metrics, setMetrics] = useState(null);
  const [routeData, setRouteData] = useState([]);
  const [coverageData, setCoverageData] = useState([]);

  useEffect(() => {
    const m = engine.getMetrics();
    setMetrics(m);

    // Route pie chart data
    const rd = Object.entries(m.routeBreakdown)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
    setRouteData(rd);

    // Coverage bar chart data
    setCoverageData([
      { name: 'Calls', total: m.callsCount, usable: m.usableCalls },
      { name: 'Meetings', total: m.meetingsCount, usable: m.usableMeetings },
      { name: 'Overall', total: m.totalRecords, usable: m.usableTotal },
    ]);
  }, [engine]);

  if (!metrics) return null;

  const coveragePct = metrics.totalRecords > 0
    ? ((metrics.usableTotal / metrics.totalRecords) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Revenue intelligence overview for 21 August 2026</p>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Records</div>
          <div className="metric-value">{metrics.totalRecords}</div>
          <div className="metric-sub">{metrics.callsCount} calls &bull; {metrics.meetingsCount} meetings</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Usable Transcripts</div>
          <div className="metric-value green">{metrics.usableTotal}</div>
          <div className="metric-sub">{metrics.usableCalls} calls &bull; {metrics.usableMeetings} meetings</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Coverage Rate</div>
          <div className="metric-value accent">{coveragePct}%</div>
          <div className="metric-sub">of all records have transcripts</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Manual Overrides</div>
          <div className="metric-value amber">{metrics.manualOverridesCount}</div>
          <div className="metric-sub">manager route adjustments</div>
        </div>
      </div>

      {/* Secondary metrics row */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        <div className="metric-card">
          <div className="metric-label">Call Coverage</div>
          <div className="metric-value" style={{ fontSize: 22 }}>{metrics.callsCoverageRate.toFixed(1)}%</div>
          <div className="metric-sub">{metrics.usableCalls} / {metrics.callsCount} calls</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Meeting Coverage</div>
          <div className="metric-value" style={{ fontSize: 22 }}>{metrics.meetingsCoverageRate.toFixed(1)}%</div>
          <div className="metric-sub">{metrics.usableMeetings} / {metrics.meetingsCount} meetings</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Route Assignments</div>
          <div className="metric-value" style={{ fontSize: 22 }}>{metrics.totalAssignedRoutes}</div>
          <div className="metric-sub">across all conversations</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Route Breakdown Pie */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Route Breakdown</div>
              <div className="card-subtitle">Distribution of assigned routes</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={routeData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, value }) => `${value}`}
                labelLine={false}
              >
                {routeData.map((entry, index) => (
                  <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={CUSTOM_TOOLTIP_STYLE}
                formatter={(value, name) => [value, name]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: 11.5, color: '#475569' }}>
                    {value.length > 28 ? value.slice(0, 28) + '...' : value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Coverage Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Coverage Analysis</div>
              <div className="card-subtitle">Usable transcripts vs total records</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={coverageData} barCategoryGap="35%">
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12, color: '#475569' }}>{v}</span>} />
              <Bar dataKey="total" name="Total" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="usable" name="Usable" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Table */}
      {engine.history.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Import History</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  {['Batch', 'Revision', 'Added', 'Updated', 'Ignored', 'Total', 'Usable', 'Time'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {engine.history.map((ev, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 500 }}>{ev.label}</td>
                    <td style={{ padding: '10px 12px' }}><span className="badge badge-accent">rev {ev.revision}</span></td>
                    <td style={{ padding: '10px 12px', color: '#10B981', fontWeight: 600 }}>{ev.added}</td>
                    <td style={{ padding: '10px 12px', color: '#F59E0B', fontWeight: 600 }}>{ev.updated}</td>
                    <td style={{ padding: '10px 12px', color: '#94A3B8' }}>{ev.ignored}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{ev.total_records}</td>
                    <td style={{ padding: '10px 12px' }}>{ev.usable_texts}</td>
                    <td style={{ padding: '10px 12px', color: '#94A3B8', fontSize: 12 }}>{new Date(ev.timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
