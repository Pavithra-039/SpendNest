import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Activity, 
  FileCheck2, 
  PhoneCall, 
  MessageSquare, 
  GitFork, 
  ShieldCheck, 
  Info, 
  Filter,
  User,
  Users
} from 'lucide-react';
import { ROUTE_TAXONOMY } from '../data/analyses';

const PIE_COLORS = ['#10b981', '#f59e0b', '#f43f5e', '#6366f1', '#3b82f6', '#a855f7', '#64748b'];

export default function DashboardMetrics({ engine, records }) {
  const [filterSourceType, setFilterSourceType] = useState('all');
  const [filterPerson, setFilterPerson] = useState('all');
  const [infoModalKey, setInfoModalKey] = useState(null);

  const people = engine.getPeopleList();
  const metrics = engine.getMetrics(filterPerson, filterSourceType);

  // Prepare Chart Data: Activity & Coverage by Person
  const repChartData = [];

  // Group by call reps
  people.reps.forEach(rep => {
    const repRecords = records.filter(r => r.source_type === 'call' && (r.payload.rep_name === rep || r.payload.rep_email === rep));
    const usable = repRecords.filter(r => engine.isUsableText(r)).length;
    repChartData.push({
      name: `${rep} (Rep)`,
      role: 'Call Rep',
      total: repRecords.length,
      usable: usable,
      unusable: repRecords.length - usable
    });
  });

  // Group by meeting organizers
  people.organizers.forEach(org => {
    const orgRecords = records.filter(r => r.source_type === 'meeting' && r.payload.organizer_email === org);
    const usable = orgRecords.filter(r => engine.isUsableText(r)).length;
    const shortName = org.split('@')[0];
    repChartData.push({
      name: `${shortName} (Org)`,
      role: 'Meeting Organizer',
      total: orgRecords.length,
      usable: usable,
      unusable: orgRecords.length - usable
    });
  });

  // Prepare Taxonomy Distribution Data
  const taxonomyData = ROUTE_TAXONOMY.map(tax => ({
    name: tax.label,
    count: metrics.routeBreakdown[tax.id] || 0
  })).filter(t => t.count > 0);

  // Metric definitions explaining denominators
  const metricDefinitions = {
    total: {
      title: 'Total Selected Records',
      denominator: 'Number of unique (source_type, source_id) records in the active filter selection.',
      explanation: 'Ingested records on 21 August 2026. Duplicates and older revisions are strictly filtered out.'
    },
    coverage: {
      title: 'Usable Supplied Transcript Coverage',
      denominator: 'Usable supplied texts ÷ Total selected records in filter.',
      explanation: 'Usable supplied text is defined as a non-blank call transcript string or a meeting transcript_payload with at least one non-blank turn object.'
    },
    connection: {
      title: 'Source-Reported Call Connection Rate',
      denominator: 'Calls with is_connected=true ÷ Calls with non-null is_connected (Stored Upstream Telephony Classification).',
      explanation: 'Derived from telephony metadata flag is_connected. Calls with missing or null connection status are isolated from the denominator.'
    },
    conversation: {
      title: 'Stored Substantive Conversation Rate',
      denominator: 'Calls with is_conversation=true ÷ Total calls in selection.',
      explanation: 'Machine-reported classification of substantive dialogue. Note: Upstream machines occasionally misclassify (e.g. C04 voicemail was marked false, while C06 was marked true despite brief rejection).'
    },
    routing: {
      title: 'Assigned Routing Destinations',
      denominator: 'Total destination assignments across selected records.',
      explanation: 'Because a single conversation may be multi-routed (e.g. M03 is routed to both Deal Next Steps and Sales Coaching), total assigned destinations may exceed unique records count.'
    },
    overrides: {
      title: 'Manual Route Overrides Active',
      denominator: 'Records where a sales manager explicitly changed the automated route suggestion.',
      explanation: 'Manual route overrides are preserved through subsequent batch imports and application restarts.'
    }
  };

  return (
    <div className="dashboard-container">
      {/* Filter Toolbar */}
      <div className="dashboard-filter-bar">
        <div className="filter-title-group">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-white text-sm">Dashboard Filters:</span>
        </div>

        <div className="filter-controls">
          {/* Source Type Filter */}
          <div className="filter-group">
            <label className="filter-label">Source Type:</label>
            <select 
              value={filterSourceType} 
              onChange={e => setFilterSourceType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Source Types (Calls & Meetings)</option>
              <option value="call">Calls Only (30)</option>
              <option value="meeting">Meetings Only (14)</option>
            </select>
          </div>

          {/* Person Filter with explicit Call Rep vs Meeting Organizer distinction */}
          <div className="filter-group">
            <label className="filter-label">Person / Role:</label>
            <select 
              value={filterPerson} 
              onChange={e => setFilterPerson(e.target.value)}
              className="filter-select"
            >
              <option value="all">All People (All Reps & Organizers)</option>
              <optgroup label="📞 Call Representatives">
                {people.reps.map(rep => (
                  <option key={rep} value={rep}>{rep} (Sales Rep)</option>
                ))}
              </optgroup>
              <optgroup label="📅 Meeting Organizers (Not Necessarily Seller)">
                {people.organizers.map(org => (
                  <option key={org} value={org}>{org} (Calendar Organizer)</option>
                ))}
              </optgroup>
            </select>
          </div>

          {(filterSourceType !== 'all' || filterPerson !== 'all') && (
            <button 
              className="btn-filter-reset"
              onClick={() => { setFilterSourceType('all'); setFilterPerson('all'); }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 6 Headline Metric Cards with explicit Denominators */}
      <div className="metrics-grid">
        {/* Card 1: Total Records */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Selected Records</span>
            <button className="btn-info" onClick={() => setInfoModalKey('total')} title="Inspect Denominator & Formula">
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{metrics.totalRecords}</span>
            <Activity className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="metric-subtext">
            <span>{metrics.callsCount} Calls</span> • <span>{metrics.meetingsCount} Meetings</span>
          </div>
          <div className="metric-denominator">
            Denominator: Unique (source_type, source_id)
          </div>
        </div>

        {/* Card 2: Usable Transcript Coverage */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Transcript Coverage</span>
            <button className="btn-info" onClick={() => setInfoModalKey('coverage')} title="Inspect Denominator & Formula">
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="metric-value-row">
            <span className="metric-value text-emerald-400">{metrics.coverageRate.toFixed(1)}%</span>
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="metric-subtext">
            <span>{metrics.usableTotal} with usable text of {metrics.totalRecords} total</span>
          </div>
          <div className="metric-denominator">
            Calls: {metrics.usableCalls}/{metrics.callsCount} ({metrics.callsCoverageRate.toFixed(0)}%) • Mtgs: {metrics.usableMeetings}/{metrics.meetingsCount} ({metrics.meetingsCoverageRate.toFixed(0)}%)
          </div>
        </div>

        {/* Card 3: Call Connection Rate */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Telephony Connection Rate</span>
            <button className="btn-info" onClick={() => setInfoModalKey('connection')} title="Inspect Denominator & Formula">
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="metric-value-row">
            <span className="metric-value text-cyan-400">{metrics.callsWithNonNullConnected > 0 ? metrics.connectionRate.toFixed(1) + '%' : 'N/A'}</span>
            <PhoneCall className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="metric-subtext">
            <span>{metrics.callsConnectedTrue} connected of {metrics.callsWithNonNullConnected} calls with status</span>
          </div>
          <div className="metric-denominator">
            Denominator: Calls with non-null is_connected
          </div>
        </div>

        {/* Card 4: Substantive Conversation Rate */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Conversation Rate</span>
            <button className="btn-info" onClick={() => setInfoModalKey('conversation')} title="Inspect Denominator & Formula">
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="metric-value-row">
            <span className="metric-value text-purple-400">{metrics.callsCount > 0 ? metrics.conversationRate.toFixed(1) + '%' : 'N/A'}</span>
            <MessageSquare className="w-5 h-5 text-purple-400" />
          </div>
          <div className="metric-subtext">
            <span>{metrics.callsWithConv} flagged conversation of {metrics.callsCount} calls</span>
          </div>
          <div className="metric-denominator">
            Denominator: All selected calls ({metrics.callsCount})
          </div>
        </div>

        {/* Card 5: Assigned Routing Destinations */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Routing Destinations</span>
            <button className="btn-info" onClick={() => setInfoModalKey('routing')} title="Inspect Denominator & Formula">
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="metric-value-row">
            <span className="metric-value text-amber-400">{metrics.totalAssignedRoutes}</span>
            <GitFork className="w-5 h-5 text-amber-400" />
          </div>
          <div className="metric-subtext">
            <span>Across {metrics.totalRecords} logical source records</span>
          </div>
          <div className="metric-denominator">
            Includes multi-destination assignments
          </div>
        </div>

        {/* Card 6: Manual Overrides Active */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Manual Overrides</span>
            <button className="btn-info" onClick={() => setInfoModalKey('overrides')} title="Inspect Denominator & Formula">
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="metric-value-row">
            <span className={`metric-value ${metrics.manualOverridesCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
              {metrics.manualOverridesCount}
            </span>
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div className="metric-subtext">
            <span>Manager judgment preserved across updates</span>
          </div>
          <div className="metric-denominator">
            Overrides survive 02_update batch replay
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="dashboard-charts-grid">
        {/* Chart 1: Activity & Usable Coverage by Person */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Activity & Usable Transcript Coverage by Person</h3>
              <p className="chart-subtitle">
                Distinguishes outbound Call Representatives from calendar Meeting Organizers (21 August 2026)
              </p>
            </div>
            <div className="flex gap-2">
              <span className="badge-legend bg-emerald-500/20 text-emerald-300">Usable Transcript</span>
              <span className="badge-legend bg-slate-700/50 text-slate-300">Metadata Only</span>
            </div>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={repChartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} interval={0} angle={-20} textAnchor="end" />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131826', borderColor: '#2a3441', borderRadius: '8px', color: '#fff' }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                />
                <Bar dataKey="usable" name="Usable Text" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="unusable" name="Missing / Metadata Only" stackId="a" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Routing Taxonomy Breakdown */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Routing Taxonomy Distribution</h3>
              <p className="chart-subtitle">
                Active destination assignments across evaluated conversations
              </p>
            </div>
          </div>
          <div className="taxonomy-list mt-4 space-y-2">
            {taxonomyData.map((item, idx) => {
              const pct = metrics.totalAssignedRoutes > 0 ? (item.count / metrics.totalAssignedRoutes) * 100 : 0;
              const color = PIE_COLORS[idx % PIE_COLORS.length];
              return (
                <div key={item.name} className="taxonomy-item">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                      <span className="font-medium text-white">{item.name}</span>
                    </div>
                    <div className="text-slate-300">
                      <strong>{item.count}</strong> ({pct.toFixed(1)}%)
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metric Info Modal */}
      {infoModalKey && metricDefinitions[infoModalKey] && (
        <div className="modal-backdrop" onClick={() => setInfoModalKey(null)}>
          <div className="modal-dialog max-w-md" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4 className="text-base font-semibold text-white">
                {metricDefinitions[infoModalKey].title}
              </h4>
              <button className="btn-close" onClick={() => setInfoModalKey(null)}>×</button>
            </div>
            <div className="modal-body space-y-3">
              <div>
                <strong className="text-xs text-indigo-400 uppercase tracking-wider">Denominator Formula</strong>
                <p className="text-sm text-slate-200 mt-1 bg-slate-900 p-2.5 rounded border border-slate-800">
                  {metricDefinitions[infoModalKey].denominator}
                </p>
              </div>
              <div>
                <strong className="text-xs text-slate-400 uppercase tracking-wider">Accounting Context</strong>
                <p className="text-sm text-slate-300 mt-1">
                  {metricDefinitions[infoModalKey].explanation}
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary-small" onClick={() => setInfoModalKey(null)}>Got it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
