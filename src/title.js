/**
 * Title screen — front door to the game.
 * Detective name capture, narrative framing, four-act picker.
 */

import { Casebook } from './core/state.js?v=9';
import { html, raw, escape, modal } from './core/components.js?v=9';

const ACTS = [
  {
    n: 1,
    name: 'The Adventure of the Singular Visitor',
    desc: 'Walk into 221B Baker Street. A grieving sister has left a case-file on the desk. Examine six pieces of evidence; mark what matters; what you keep goes with you into the next acts.',
    skills: 'Investigation · Evidence · Atmosphere'
  },
  {
    n: 2,
    name: 'Convince Mycroft',
    desc: 'The elder Holmes brother holds court at the Diogenes Club. Persuade him with inductive arguments — through four progressively stricter levels of scepticism.',
    skills: 'Inductive strength · Cogency · Persuasion'
  },
  {
    n: 3,
    name: 'The Free Will Inquiry',
    desc: 'A confession on the table; a neuroscientist on the wire. Reconstruct Sapolsky\'s argument against free will, weigh objections, and write your own verdict.',
    skills: 'Argument reconstruction · Counter-argument · Stage 1 thought experiment'
  },
  {
    n: 4,
    name: 'The Final Deduction',
    desc: 'A locked room. Three suspects. Examine the scene, gather facts, and assemble a sound deductive argument that names the culprit.',
    skills: 'Validity · Soundness · Deductive proof'
  }
];

export function render(root, _params) {
  Casebook.clearStepRelevance();
  const s = Casebook.get();
  const detective = s.detectiveName;
  const visited = s.lastVisited;
  const allDone = Casebook.allComplete();

  root.innerHTML = html`
    <div class="title-stage stage">
      <div style="max-width: 880px; margin: 0 auto;">
        <p class="title-mark">An Inquiry · 221B Baker Street</p>
        <h1 class="title-main">The Baker Street File</h1>
        <p class="title-sub">— A Casebook of Standard Form —</p>

        <p class="title-byline">
          Holmes is away. Watson is recording. The cases on this desk will not solve themselves —
          and each demands a different kind of argument.
        </p>

        ${!detective ? html`
          <div class="panel" style="margin-bottom: var(--s-5); max-width: 520px; margin-left: auto; margin-right: auto;">
            <h3 style="margin-bottom: var(--s-2);">Sign the casebook</h3>
            <p style="color: var(--chalk-mute); margin-bottom: var(--s-2); font-size: 15px;">
              Holmes\u0027s files will be addressed to you for the duration of the inquiry.
            </p>
            <form id="detective-form" class="row" style="gap: var(--s-2); align-items: stretch;">
              <input id="detective-name" type="text" placeholder="Your name (or a pseudonym)" maxlength="32" required
                style="flex: 1; padding: var(--s-2) var(--s-3); background: var(--parchment); color: var(--ink); font-family: var(--font-evidence); font-size: var(--type-base); border: 2px solid var(--parchment-edge); border-radius: var(--radius-sm); min-height: 44px;" />
              <button class="btn" type="submit">Begin</button>
            </form>
          </div>
        ` : html`
          <p class="title-byline" style="font-style: italic; color: var(--brass-soft); margin-bottom: var(--s-3);">
            Welcome back, ${escape(detective)}. ${visited ? html`Resume Act ${rom(visited)} or pick another.` : 'Your case awaits.'}
          </p>
        `}

        <div class="title-acts" id="acts">
          ${ACTS.map(a => actTile(a, s))}
        </div>

        ${allDone ? html`
          <div style="margin-top: var(--s-4);">
            <a href="#/finale" class="btn btn-large">◉ The Final Reveal</a>
          </div>
        ` : ''}

        <div class="row row-spread" style="margin-top: var(--s-5); color: var(--chalk-mute); font-family: var(--font-evidence); font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">
          <span>Allow ~75 minutes for a full inquiry</span>
          <button id="reset-btn" class="btn btn-ghost" style="font-size: 12px; padding: 6px 14px; min-height: 0;">Start over</button>
        </div>
      </div>
    </div>
  `;

  // Wire up form
  const form = root.querySelector('#detective-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = root.querySelector('#detective-name');
      const name = input.value.trim();
      if (name) {
        Casebook.setDetective(name);
        render(root);   // re-render with name
      }
    });
    // autofocus the name input
    setTimeout(() => root.querySelector('#detective-name')?.focus(), 60);
  }

  // Wire up reset button (with confirm)
  root.querySelector('#reset-btn')?.addEventListener('click', () => {
    modal({
      heading: 'Wipe the slate?',
      body: 'This will erase your current case progress. There is no recovering it once gone.',
      primary: 'Reset everything',
      onPrimary: () => {
        Casebook.reset();
        render(root);
      },
      secondary: 'Cancel'
    });
  });
}

function actTile(a, state) {
  const act = state.acts[a.n];
  const status = act.complete ? 'Closed' : (state.lastVisited === a.n ? 'In progress' : 'Open');
  const className = `act-tile ${act.complete ? 'complete' : ''}`;
  return html`
    <a href="#/act/${a.n}" class="${className}" data-act="${a.n}">
      <div class="act-num">Act ${rom(a.n)}</div>
      <div class="act-name">${a.name}</div>
      <div class="act-desc">${a.desc}</div>
      <div class="act-status">${status} · ${a.skills}</div>
    </a>
  `;
}

function rom(n) { return ['', 'I', 'II', 'III', 'IV'][n] || String(n); }
