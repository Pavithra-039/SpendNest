// Core Revenue Intelligence Engine & Replay State Manager
import initialBatchData from './data/initialBatch.json';
import updateBatchData from './data/updateBatch.json';
import { CONVERSATION_ANALYSES } from './data/analyses';

const STORAGE_KEY = 'spendnest_revenue_inbox_state_v1';

export class RevenueInboxEngine {
  constructor() {
    this.records = new Map(); // key: `${source_type}:${source_id}` -> RecordObject
    this.history = [];
    this.manualOverrides = new Map(); // key -> { routes, timestamp, note }
    this.appliedBatches = [];
  }

  static getKey(source_type, source_id) {
    return `${source_type}:${source_id}`;
  }

  isUsableText(record) {
    if (record.source_type === 'call') {
      return Boolean(record.payload && record.payload.transcript && record.payload.transcript.trim().length > 0);
    }
    if (record.source_type === 'meeting') {
      return Boolean(record.transcript_payload && record.transcript_payload.turns && record.transcript_payload.turns.length > 0);
    }
    return false;
  }

  getSuggestedRoutes(record) {
    const analysis = CONVERSATION_ANALYSES[record.record_ref];
    if (analysis && analysis.routes && analysis.routes.length > 0) {
      return [...analysis.routes];
    }
    if (record.source_type === 'meeting') {
      if (record.payload.recording_status === 'cancelled') return ['No Usable Text / Cancelled Capture'];
      if (record.payload.recording_status === 'not_scheduled') return ['No Usable Text / Unscheduled Capture'];
      if (record.transcript_payload && record.transcript_payload.unavailable_reason) {
        return ['Awaiting Late Delivery / No Usable Text'];
      }
      return ['No Usable Text / Silent Meeting'];
    }
    return ['No Usable Text / Background Telephony'];
  }

  computeReviewState(record, appliedRevision) {
    if (record.record_ref === 'M07' && appliedRevision === 1) {
      return 'AWAITING_UPDATE';
    }
    if (this.isUsableText(record)) {
      return 'ANALYZED';
    }
    if (record.source_type === 'meeting') {
      if (record.payload.recording_status === 'cancelled') return 'BOT_CANCELLED';
      if (record.payload.recording_status === 'not_scheduled') return 'BOT_NOT_SCHEDULED';
      return 'SILENT_RECORDING';
    }
    return 'CALL_METADATA_ONLY';
  }

  importBatch(batch, batchLabel = '') {
    const batchRev = batch.revision || 1;
    let addedCount = 0;
    let updatedCount = 0;
    let ignoredCount = 0;

    batch.records.forEach(incoming => {
      const key = RevenueInboxEngine.getKey(incoming.source_type, incoming.source_id);
      const existing = this.records.get(key);

      if (!existing) {
        // Initial import for this record
        const suggested = this.getSuggestedRoutes(incoming);
        const hasManual = this.manualOverrides.has(key);
        const manualRoutes = hasManual ? this.manualOverrides.get(key).routes : null;

        this.records.set(key, {
          source_type: incoming.source_type,
          source_id: incoming.source_id,
          record_ref: incoming.record_ref,
          applied_revision: batchRev,
          payload: incoming.payload,
          transcript_payload: incoming.transcript_payload,
          suggested_routes: suggested,
          active_routes: hasManual ? manualRoutes : suggested,
          is_manually_overridden: hasManual,
          manual_routes: manualRoutes,
          review_state: this.computeReviewState(incoming, batchRev),
          analysis_freshness: 'current',
          discrepancy_note: CONVERSATION_ANALYSES[incoming.record_ref]?.discrepancy || null
        });
        addedCount++;
      } else {
        // Record already exists - evaluate revision rule
        if (batchRev > existing.applied_revision) {
          // Rule 2 & 3: Higher revision replaces entire source payload and transcript payload
          existing.applied_revision = batchRev;
          existing.payload = incoming.payload;
          existing.transcript_payload = incoming.transcript_payload;
          existing.record_ref = incoming.record_ref || existing.record_ref;

          const newSuggested = this.getSuggestedRoutes(incoming);
          existing.suggested_routes = newSuggested;

          // Rule 4: Preserves manual routing decision across updates
          if (existing.is_manually_overridden) {
            existing.active_routes = [...existing.manual_routes];
            existing.analysis_freshness = 'manual_preserved_rev_updated';
          } else {
            existing.active_routes = newSuggested;
            existing.analysis_freshness = 'current';
          }

          existing.review_state = this.computeReviewState(incoming, batchRev);
          existing.discrepancy_note = CONVERSATION_ANALYSES[incoming.record_ref]?.discrepancy || null;
          updatedCount++;
        } else {
          // Rule 2: Same or older revisions are strictly ignored
          ignoredCount++;
        }
      }
    });

    const event = {
      timestamp: new Date().toISOString(),
      batch_id: batch.batch_id,
      revision: batchRev,
      label: batchLabel || batch.batch_id,
      added: addedCount,
      updated: updatedCount,
      ignored: ignoredCount,
      total_records: this.records.size,
      usable_texts: this.getUsableTextCount()
    };

    this.history.unshift(event);
    this.appliedBatches.push(batch.batch_id);
    this.saveToStorage();

    return event;
  }

  setManualRoute(source_type, source_id, newRoutes, note = 'Sales Manager manual adjustment') {
    const key = RevenueInboxEngine.getKey(source_type, source_id);
    const item = this.records.get(key);
    if (!item) return false;

    const overrideObj = {
      routes: [...newRoutes],
      timestamp: new Date().toISOString(),
      note: note
    };

    this.manualOverrides.set(key, overrideObj);

    item.is_manually_overridden = true;
    item.manual_routes = [...newRoutes];
    item.active_routes = [...newRoutes];
    item.analysis_freshness = 'manual_override_active';

    this.saveToStorage();
    return true;
  }

  resetManualRoute(source_type, source_id) {
    const key = RevenueInboxEngine.getKey(source_type, source_id);
    const item = this.records.get(key);
    if (!item) return false;

    this.manualOverrides.delete(key);
    item.is_manually_overridden = false;
    item.manual_routes = null;
    item.active_routes = [...item.suggested_routes];
    item.analysis_freshness = 'current';

    this.saveToStorage();
    return true;
  }

  getUsableTextCount() {
    let count = 0;
    for (const item of this.records.values()) {
      if (this.isUsableText(item)) count++;
    }
    return count;
  }

  getAllRecordsList() {
    return Array.from(this.records.values());
  }

  getRecord(source_type, source_id) {
    return this.records.get(RevenueInboxEngine.getKey(source_type, source_id));
  }

  // Baseline calculations per DATA_DICTIONARY.md
  getMetrics(filterPerson = 'all', filterSourceType = 'all') {
    let list = this.getAllRecordsList();

    if (filterSourceType !== 'all') {
      list = list.filter(r => r.source_type === filterSourceType);
    }

    if (filterPerson !== 'all') {
      list = list.filter(r => {
        if (r.source_type === 'call') {
          return r.payload.rep_name === filterPerson || r.payload.rep_email === filterPerson;
        } else {
          return r.payload.organizer_email === filterPerson;
        }
      });
    }

    const totalSelected = list.length;
    const calls = list.filter(r => r.source_type === 'call');
    const meetings = list.filter(r => r.source_type === 'meeting');

    // Usable coverage
    const usableTotal = list.filter(r => this.isUsableText(r)).length;
    const usableCalls = calls.filter(r => this.isUsableText(r)).length;
    const usableMeetings = meetings.filter(r => this.isUsableText(r)).length;

    // Stored call connection rate
    const callsWithNonNullConnected = calls.filter(c => c.payload.is_connected !== null && c.payload.is_connected !== undefined);
    const callsConnectedTrue = callsWithNonNullConnected.filter(c => c.payload.is_connected === true).length;
    const connectionRate = callsWithNonNullConnected.length > 0
      ? (callsConnectedTrue / callsWithNonNullConnected.length) * 100
      : 0;

    // Stored conversation rate
    const callsWithConv = calls.filter(c => c.payload.is_conversation === true).length;
    const conversationRate = calls.length > 0 ? (callsWithConv / calls.length) * 100 : 0;

    // Route assignments count
    let totalAssignedRoutes = 0;
    const routeBreakdown = {};
    list.forEach(r => {
      r.active_routes.forEach(route => {
        totalAssignedRoutes++;
        routeBreakdown[route] = (routeBreakdown[route] || 0) + 1;
      });
    });

    // Manual overrides
    const manualOverridesCount = list.filter(r => r.is_manually_overridden).length;

    return {
      totalRecords: totalSelected,
      callsCount: calls.length,
      meetingsCount: meetings.length,
      usableTotal,
      usableCalls,
      usableMeetings,
      coverageRate: totalSelected > 0 ? (usableTotal / totalSelected) * 100 : 0,
      callsCoverageRate: calls.length > 0 ? (usableCalls / calls.length) * 100 : 0,
      meetingsCoverageRate: meetings.length > 0 ? (usableMeetings / meetings.length) * 100 : 0,
      callsConnectedTrue,
      callsWithNonNullConnected: callsWithNonNullConnected.length,
      connectionRate,
      callsWithConv,
      conversationRate,
      totalAssignedRoutes,
      routeBreakdown,
      manualOverridesCount
    };
  }

  // Get unique reps and organizers with role distinction
  getPeopleList() {
    const reps = new Set();
    const organizers = new Set();

    for (const r of this.records.values()) {
      if (r.source_type === 'call') {
        if (r.payload.rep_name) reps.add(r.payload.rep_name);
        else if (r.payload.rep_email) reps.add(r.payload.rep_email);
      } else {
        if (r.payload.organizer_email) organizers.add(r.payload.organizer_email);
      }
    }

    return {
      reps: Array.from(reps).sort(),
      organizers: Array.from(organizers).sort()
    };
  }

  saveToStorage() {
    try {
      const stateObj = {
        records: Array.from(this.records.entries()),
        manualOverrides: Array.from(this.manualOverrides.entries()),
        history: this.history,
        appliedBatches: this.appliedBatches
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateObj));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return false;
      const stateObj = JSON.parse(saved);
      this.records = new Map(stateObj.records);
      this.manualOverrides = new Map(stateObj.manualOverrides);
      this.history = stateObj.history || [];
      this.appliedBatches = stateObj.appliedBatches || [];
      return true;
    } catch (e) {
      console.warn('Storage load failed:', e);
      return false;
    }
  }

  resetToInitialClean() {
    this.records.clear();
    this.manualOverrides.clear();
    this.history = [];
    this.appliedBatches = [];
    this.importBatch(initialBatchData, 'Initial Clean Batch (01_initial.json)');
    return true;
  }

  resetToPostUpdateClean() {
    this.records.clear();
    this.manualOverrides.clear();
    this.history = [];
    this.appliedBatches = [];
    this.importBatch(initialBatchData, 'Batch 1 (01_initial.json)');
    this.importBatch(updateBatchData, 'Batch 2 (02_update.json)');
    return true;
  }
}
