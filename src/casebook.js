/**
 * Casebook — a slide-in dossier panel showing the player's accumulating evidence.
 * Available from anywhere via a fixed-position toggle button.
 */

import { Casebook as State } from './core/state.js?v=3';
import { html, raw, escape } from './core/components.js?v=3';

let _panel = null;
let _openHandler = null;

export function mountCasebook() {
  if (document.getElementById('casebook-toggle')) return;

  // Floating toggle
  const toggle = document.createElement('button');
  toggle.id = 'casebook-toggle';
  toggle.className = 'btn casebook-toggle';
  toggle.textContent = '📓 Casebook';
  toggle.setAttribute('aria-label', 'Open Casebook');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.appendChild(toggle);

  // Slide-in panel
  _panel = document.createElement('aside');
  _panel.id = 'casebook-panel';
  _panel.className = 'casebook-panel';
  _panel.setAttribute('aria-label', 'Casebook dossier');
  _panel.dataset.open = 'false';
  _panel.tabIndex = -1;
  document.body.appendChild(_panel);

  toggle.addEventListener('click', toggleCasebook);
  window.addEventListener('casebook:updated', renderCasebook);
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

function renderCasebook() {
  if (!_panel) return;
  const s = State.get();
  const entries = [...s.casebook].reverse();   // newest first
  const detective = s.detectiveName || 'Detective';
  const allDone = State.allComplete();

  _panel.innerHTML = html`
    <div class="row row-spread" style="margin-bottom: var(--s-3);">
      <h3 style="margin: 0;">Casebook</h3>
      <button class="btn btn-ghost" id="casebook-close" aria-label="Close Casebook" style="padding: 6px 14px; min-height: 0;">Close ✕</button>
    </div>
    <p style="font-family: var(--font-evidence); color: var(--brass); letter-spacing: 0.1em; text-transform: uppercase; font-size: 13px; margin-bottom: var(--s-3);">
      ${escape(detective)} · 221B Baker Street
    </p>

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
      ? html`<p style="color: var(--chalk-mute); font-style: italic;">No entries yet. The case has just begun.</p>`
      : entries.map(e => html`
          <div class="casebook-entry">
            <div class="stamp">${e.stamp || `Act ${rom(e.act)}`}</div>
            <div class="quote">${e.quote || ''}</div>
          </div>
        `)
    }
  `;

  _panel.querySelector('#casebook-close')?.addEventListener('click', toggleCasebook);
}

function rom(n) { return ['', 'I', 'II', 'III', 'IV'][n] || String(n); }
