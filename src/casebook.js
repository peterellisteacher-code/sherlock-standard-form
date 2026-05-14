/**
 * Casebook — a slide-in dossier panel showing the player's accumulating evidence.
 * Available from anywhere via a fixed-position toggle button.
 *
 * Step-relevance filter: when an interrogation step calls `Casebook.setStepRelevance(...)`,
 * the panel hides entries unrelated to the current question. A "Show all" toggle
 * lets students opt out of the filter at any time.
 */

import { Casebook as State } from './core/state.js?v=8';
import { html, raw, escape } from './core/components.js?v=8';

let _panel = null;
let _showAll = false;   // student-controlled toggle to override the step filter

export function mountCasebook() {
  if (document.getElementById('casebook-toggle')) return;

  const toggle = document.createElement('button');
  toggle.id = 'casebook-toggle';
  toggle.className = 'btn casebook-toggle';
  toggle.textContent = '📓 Casebook';
  toggle.setAttribute('aria-label', 'Open Casebook');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.appendChild(toggle);

  _panel = document.createElement('aside');
  _panel.id = 'casebook-panel';
  _panel.className = 'casebook-panel';
  _panel.setAttribute('aria-label', 'Casebook dossier');
  _panel.dataset.open = 'false';
  _panel.tabIndex = -1;
  document.body.appendChild(_panel);

  toggle.addEventListener('click', toggleCasebook);
  window.addEventListener('casebook:updated', renderCasebook);
  window.addEventListener('casebook:filter-changed', () => {
    _showAll = false;            // reset override when entering a new step
    refreshToggleBadge();
    if (_panel.dataset.open === 'true') renderCasebook();
  });
  refreshToggleBadge();
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && _panel.dataset.open === 'true') {
      toggleCasebook();
    }
  });
}

function toggleCasebook() {
  if (!_panel) return;
  const isOpen = _panel.dataset.open === 'true';
  _panel.dataset.open = isOpen ? 'false' : 'true';
  document.getElementById('casebook-toggle')?.setAttribute('aria-expanded', String(!isOpen));
  if (!isOpen) {
    renderCasebook();
    _panel.focus();
  }
}

/** Show a small "(N of M shown)" badge on the toggle when a filter is active. */
function refreshToggleBadge() {
  const toggle = document.getElementById('casebook-toggle');
  if (!toggle) return;
  const filter = State.getStepRelevance();
  if (!filter || _showAll) {
    toggle.textContent = '📓 Casebook';
    return;
  }
  const all = State.get().casebook;
  const visibleCount = all.filter(e => matchesFilter(e, filter)).length;
  toggle.textContent = `📓 Casebook (${visibleCount}/${all.length})`;
}

/** Decide whether a casebook entry matches the current step filter. */
function matchesFilter(entry, filter) {
  if (!filter) return true;
  // Match Act I evidence by id
  if (entry.id && filter.evidenceIds.has(entry.id)) return true;
  // Match by explicit stamp (e.g. "Mycroft, Level 1", "ACT I — CLOSED")
  if (entry.stamp && filter.allowedStamps.has(entry.stamp)) return true;
  // Optional broad allow for all Mycroft intel
  if (filter.allowAllIntel && entry.stamp && /^Mycroft, Level/.test(entry.stamp)) return true;
  // Optional broad allow by act number (e.g. Act IV writing draws on Act IV hotspots)
  if (filter.allowedActs.has(entry.act)) return true;
  return false;
}

function renderCasebook() {
  if (!_panel) return;
  const s = State.get();
  const filter = State.getStepRelevance();
  const filterActive = !!filter && !_showAll;
  const allEntries = [...s.casebook].reverse();
  const entries = filterActive ? allEntries.filter(e => matchesFilter(e, filter)) : allEntries;
  const detective = s.detectiveName || 'Detective';
  const allDone = State.allComplete();
  const hiddenCount = allEntries.length - entries.length;

  _panel.innerHTML = html`
    <div class="row row-spread" style="margin-bottom: var(--s-3);">
      <h3 style="margin: 0;">Casebook</h3>
      <button class="btn btn-ghost" id="casebook-close" aria-label="Close Casebook" style="padding: 6px 14px; min-height: 0;">Close ✕</button>
    </div>
    <p style="font-family: var(--font-evidence); color: var(--brass); letter-spacing: 0.1em; text-transform: uppercase; font-size: 13px; margin-bottom: var(--s-3);">
      ${escape(detective)} · 221B Baker Street
    </p>

    ${filter ? html`
      <div class="case-themes" style="margin-bottom: var(--s-3);">
        <h4 style="margin-bottom: 4px;">${filterActive ? 'Filtered: ' : 'All evidence shown.'}${filterActive ? escape(filter.stepLabel || 'this step') : ''}</h4>
        <p style="font-size: 13px; color: var(--chalk); margin: 4px 0 var(--s-1);">
          ${filterActive
            ? `Showing only evidence relevant to this argument. ${hiddenCount > 0 ? hiddenCount + ' entr' + (hiddenCount === 1 ? 'y' : 'ies') + ' hidden.' : ''}`
            : 'You are viewing every casebook entry.'}
        </p>
        <button class="btn btn-ghost" id="casebook-show-all-toggle" style="padding: 4px 10px; min-height: 0; font-size: 12px;">
          ${filterActive ? 'Show all evidence' : 'Filter to this step'}
        </button>
      </div>
    ` : ''}

    <div class="stack-tight" style="margin-bottom: var(--s-3);">
      ${[1,2,3,4].map(n => {
        const a = s.acts[n];
        const status = a.complete ? '✓ closed' : 'open';
        return html`
          <div class="row row-spread" style="font-family: var(--font-evidence); font-size: 13px; padding: 8px 0; border-bottom: 1px solid rgba(184, 153, 104, 0.15);">
            <span>Act ${rom(n)}</span>
            <span style="color: ${a.complete ? 'var(--evidence-soft)' : 'var(--chalk-mute)'}; text-transform: uppercase; letter-spacing: 0.1em;">${status}</span>
          </div>
        `;
      })}
    </div>

    ${allDone ? html`
      <a href="#/finale" class="btn" style="display: block; text-align: center; margin-bottom: var(--s-3);">
        ◉ View final reveal
      </a>
    ` : ''}

    <h4 style="font-family: var(--font-evidence); font-size: 13px; color: var(--brass); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: var(--s-2);">
      Evidence log
    </h4>

    ${entries.length === 0
      ? html`<p style="color: var(--chalk-mute); font-style: italic;">${filterActive ? 'Nothing in your casebook relates to this step yet.' : 'No entries yet. The case has just begun.'}</p>`
      : entries.map(e => html`
          <div class="casebook-entry">
            <div class="stamp">${e.stamp || `Act ${rom(e.act)}`}</div>
            <div class="quote">${raw(e.quote || '')}</div>
          </div>
        `)
    }
  `;

  _panel.querySelector('#casebook-close')?.addEventListener('click', toggleCasebook);
  _panel.querySelector('#casebook-show-all-toggle')?.addEventListener('click', () => {
    _showAll = !_showAll;
    renderCasebook();
    refreshToggleBadge();
  });
}

function rom(n) { return ['', 'I', 'II', 'III', 'IV'][n] || String(n); }
