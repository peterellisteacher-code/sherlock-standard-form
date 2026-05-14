/**
 * Hints — floating button that opens a modal explaining standard form,
 * inductive reasoning, and deductive reasoning. Available from every act.
 */

import { html, raw, escape } from './core/components.js?v=9';

const HINTS = {
  standard: {
    label: 'Standard Form',
    body: `
      <p>Lay an argument out so each step is on its own line.</p>
      <ul style="margin-left: var(--s-3);">
        <li>Number each premise: <strong>P1</strong>, <strong>P2</strong>, <strong>P3</strong>…</li>
        <li>One reason per line. No bundling.</li>
        <li>Mark the conclusion with <strong>&therefore; C</strong> or <strong>Therefore,</strong>.</li>
        <li>The conclusion should follow from the premises above it.</li>
      </ul>
      <p style="margin-top: var(--s-2);"><strong>Example:</strong></p>
      <div class="hints-example">P1: The watch stopped at 11:14.
P2: The body was found at 11:30.
P3: A watch stops when struck or wound down.
&therefore; C: Something struck the watch shortly before the body was found.</div>
    `
  },
  inductive: {
    label: 'Inductive',
    body: `
      <p>Premises make the conclusion <strong>probable</strong>, not certain.</p>
      <ul style="margin-left: var(--s-3);">
        <li>Use words like <em>probably</em>, <em>likely</em>, <em>most plausibly</em>.</li>
        <li>Stack <strong>distinct lines of evidence</strong>. One observation said three ways is one line, not three.</li>
        <li>An argument is <strong>cogent</strong> when it is strong AND its premises are plausibly true.</li>
        <li>Bare assertion is not cogent. Back each premise with something we know.</li>
      </ul>
      <p style="margin-top: var(--s-2);">Mycroft and Sapolsky want inductive arguments.</p>
      <p style="margin-top: var(--s-2);"><strong>Example:</strong></p>
      <div class="hints-example">P1: The telegram's phrasing ("He arrives") is unusual for trade.
P2: It reached the Captain an hour before the killing.
P3: The Captain went out at once and would not later explain it.
&therefore; C: The telegram probably warned of an arriving person, not a shipment.</div>
    `
  },
  deductive: {
    label: 'Deductive',
    body: `
      <p>If the premises are true, the conclusion <strong>must</strong> follow.</p>
      <ul style="margin-left: var(--s-3);">
        <li><strong>Valid</strong> = the structure works. IF the premises were true, the conclusion would have to be true.</li>
        <li><strong>Sound</strong> = valid AND the premises actually ARE true on the evidence.</li>
        <li>A valid argument with one false premise is unsound. Both checks must pass.</li>
        <li>Words like <em>probably</em> belong in inductive arguments, not deductive ones.</li>
      </ul>
      <p style="margin-top: var(--s-2);">Holmes wants a deductive argument in Act IV.</p>
      <p style="margin-top: var(--s-2);"><strong>Example:</strong></p>
      <div class="hints-example">P1: Only the front door and the back-stair door open into the room.
P2: The front door was locked from inside, with the key still in the lock.
P3: Whoever shot Pelham left the room after the shot.
&therefore; C: The shooter left by the back-stair door.</div>
    `
  }
};

let _panel = null;
let _active = 'standard';

export function mountHints() {
  if (document.getElementById('hints-toggle')) return;

  const toggle = document.createElement('button');
  toggle.id = 'hints-toggle';
  toggle.className = 'btn hints-toggle';
  toggle.textContent = '💡 Hints';
  toggle.setAttribute('aria-label', 'Open argument hints');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.appendChild(toggle);

  toggle.addEventListener('click', openHints);
}

function openHints() {
  closeHints();
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-label', 'Argument hints');
  backdrop.innerHTML = `
    <div class="modal stack" style="max-width: 720px;">
      <div class="row row-spread" style="margin-bottom: var(--s-1);">
        <h2 style="font-style: italic; margin: 0;">Argument Hints</h2>
        <button class="btn btn-ghost" id="hints-close" aria-label="Close hints" style="padding: 6px 14px; min-height: 0;">Close ✕</button>
      </div>
      <p style="color: var(--chalk-mute); font-size: 14px; margin: 0;">For when the judges ask for an argument and you are not sure what to write.</p>
      <div class="hints-tabs" role="tablist">
        ${Object.entries(HINTS).map(([k, v]) => `
          <button class="hints-tab" role="tab" data-hint="${k}" aria-selected="${k === _active}">${v.label}</button>
        `).join('')}
      </div>
      <div id="hints-body"></div>
    </div>
  `;
  document.body.appendChild(backdrop);
  document.body.classList.add('modal-open');
  _panel = backdrop;
  renderBody();

  backdrop.querySelectorAll('.hints-tab').forEach(t => {
    t.addEventListener('click', () => {
      _active = t.dataset.hint;
      backdrop.querySelectorAll('.hints-tab').forEach(x => x.setAttribute('aria-selected', String(x.dataset.hint === _active)));
      renderBody();
    });
  });
  backdrop.querySelector('#hints-close').addEventListener('click', closeHints);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeHints(); });
  document.addEventListener('keydown', onKey);
  document.getElementById('hints-toggle')?.setAttribute('aria-expanded', 'true');
  backdrop.querySelector('.hints-tab[aria-selected="true"]')?.focus();
}

function renderBody() {
  const el = _panel?.querySelector('#hints-body');
  if (!el) return;
  el.innerHTML = HINTS[_active].body;
}

function closeHints() {
  if (_panel) {
    _panel.remove();
    _panel = null;
    document.removeEventListener('keydown', onKey);
    if (!document.querySelector('.modal-backdrop')) document.body.classList.remove('modal-open');
    document.getElementById('hints-toggle')?.setAttribute('aria-expanded', 'false');
    document.getElementById('hints-toggle')?.focus();
  }
}

function onKey(e) {
  if (e.key === 'Escape') closeHints();
}
