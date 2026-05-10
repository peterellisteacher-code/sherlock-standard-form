/**
 * Casebook state — persistent across acts via localStorage.
 *
 * The Casebook is the player's growing dossier of evidence. Every Act
 * deposits entries. State survives reload, browser-close, even tab-close.
 */

const STORAGE_KEY = 'baker-street-file-v1';

const DEFAULT_STATE = {
  detectiveName: '',
  startedAt: null,
  acts: {
    1: { complete: false, score: 0, total: 0, completedAt: null },
    2: { complete: false, mycroftLevel: 0, badgesEarned: [], completedAt: null },
    3: { complete: false, structureScore: 0, finalArgument: '', completedAt: null },
    4: { complete: false, evidenceFound: [], suspectAccused: null, finalArgument: '', completedAt: null }
  },
  casebook: [],   // [{ act, when, stamp, quote }]
  lastVisited: null
};

let _state = null;

function clone(o) { return JSON.parse(JSON.stringify(o)); }

function load() {
  if (_state) return _state;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Shallow merge default + parsed to handle schema additions gracefully
      _state = { ...clone(DEFAULT_STATE), ...parsed };
      // Ensure nested act keys exist
      _state.acts = { ...DEFAULT_STATE.acts, ..._state.acts };
      return _state;
    }
  } catch (e) {
    console.warn('Casebook load failed; starting fresh:', e);
  }
  _state = clone(DEFAULT_STATE);
  return _state;
}

function save() {
  if (!_state) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
  } catch (e) {
    console.warn('Casebook save failed:', e);
  }
}

export const Casebook = {
  /** Get current state (lazy-loads on first call). */
  get() { return load(); },

  /** Set the detective's name + start the case. */
  setDetective(name) {
    const s = load();
    s.detectiveName = String(name || '').trim().slice(0, 32);
    if (!s.startedAt) s.startedAt = new Date().toISOString();
    save();
  },

  /** Mark visited act for resume. */
  visit(actNum) {
    const s = load();
    s.lastVisited = actNum;
    save();
  },

  /** Update a specific act's progress. */
  updateAct(actNum, patch) {
    const s = load();
    s.acts[actNum] = { ...s.acts[actNum], ...patch };
    save();
  },

  /** Mark an act complete + stamp the case file. */
  completeAct(actNum, summary) {
    const s = load();
    s.acts[actNum] = {
      ...s.acts[actNum],
      ...summary,
      complete: true,
      completedAt: new Date().toISOString()
    };
    save();
    Casebook.deposit({
      act: actNum,
      stamp: `ACT ${rom(actNum)} — CLOSED`,
      quote: summary.epitaph || ACT_EPITAPHS[actNum] || ''
    });
  },

  /** Add an entry to the casebook (premise unlocked, evidence found, etc). */
  deposit(entry) {
    const s = load();
    s.casebook.push({
      ...entry,
      when: entry.when || new Date().toISOString()
    });
    // Cap the casebook to last 50 entries to keep storage bounded.
    if (s.casebook.length > 50) s.casebook = s.casebook.slice(-50);
    save();
    // Broadcast so the Casebook UI can refresh if open.
    window.dispatchEvent(new CustomEvent('casebook:updated', { detail: entry }));
  },

  /** Reset for a fresh playthrough (kept for dev / reset button). */
  reset() {
    localStorage.removeItem(STORAGE_KEY);
    _state = null;
  },

  /** Export current state as JSON string (for save-link feature). */
  export() {
    return JSON.stringify(load());
  },

  /** Import state from JSON string. */
  import(json) {
    try {
      const incoming = JSON.parse(json);
      _state = { ...clone(DEFAULT_STATE), ...incoming };
      _state.acts = { ...DEFAULT_STATE.acts, ..._state.acts };
      save();
      return true;
    } catch (e) {
      console.warn('Casebook import failed:', e);
      return false;
    }
  },

  /** Returns true if all four acts are complete (final reveal can render). */
  allComplete() {
    const s = load();
    return [1, 2, 3, 4].every(n => s.acts[n].complete);
  }
};

function rom(n) {
  return ['', 'I', 'II', 'III', 'IV', 'V'][n] || String(n);
}

const ACT_EPITAPHS = {
  1: 'Premises numbered. Conclusion sealed. The first lock has yielded.',
  2: 'Mycroft Holmes acknowledges the soundness of your reasoning. A rare thing.',
  3: 'The defendant\'s freedom — or the lack of it — has been argued in standard form.',
  4: 'The case is closed. The deduction holds. London is, briefly, safer.'
};
