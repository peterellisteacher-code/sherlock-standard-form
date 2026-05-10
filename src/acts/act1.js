/**
 * Act I — The Adventure of the Singular Visitor
 *
 * The hook. ~12-15 min of atmosphere with vanishing pedagogy. The student
 * plays Watson at 221B; a woman in mourning brings a case. Three interactive
 * beats:
 *   1. opening narrative + door choice (atmospheric, no consequence)
 *   2. testimony — pick 3 of 6 questions for Mrs Whitcombe
 *   3. pocket-watch — hotspot deduction with multiple-choice + Holmes telegram
 * No AI calls. All branching is hand-authored.
 */

import { Casebook } from '../core/state.js';
import { html, raw, escape, speech, topbar, toast, modal } from '../core/components.js';
import { announce } from '../core/nav.js';
import {
  OPENING, CHOICE_AT_DOOR, TESTIMONY_INTRO, QUESTIONS, TESTIMONY_OUTRO,
  WATCH_INTRO, WATCH_HOTSPOTS, WATCH_OUTRO
} from '../../data/act1-visitor.js';

let _state = null;

function freshState() {
  return {
    beat: 'opening',           // opening | door | testimony | watch | outro
    doorChoice: null,
    askedQuestions: [],        // [questionId, ...]
    lockedQuestions: new Set(),
    watchProgress: {},         // { hotspotId: { resolved: bool, deduction: string } }
    activeHotspot: null,
    telegrams: []              // chronological log of Holmes's wires
  };
}

export function render(root, _params) {
  // Resume from beat if act in progress, but for v1 we always start fresh on entry
  // (the Casebook persists outcomes across navigations, so re-doing Act I just adds
  // entries; not ideal but tolerable for a 1-day class).
  _state = freshState();
  drawBeat(root);
}

export function cleanup() { /* no global handlers */ }

function drawBeat(root) {
  const beat = _state.beat;
  if (beat === 'opening')    return drawOpening(root);
  if (beat === 'door')       return drawDoor(root);
  if (beat === 'testimony')  return drawTestimony(root);
  if (beat === 'watch')      return drawWatch(root);
  if (beat === 'outro')      return drawOutro(root);
}

/* --- BEAT 1: OPENING (parlour atmosphere + knock) -------------------- */

function drawOpening(root) {
  root.innerHTML = html`
    ${raw(topbar({ act: 1, name: 'The Adventure of the Singular Visitor', progress: 'A late call' }))}

    <div class="stage stage-narrow stack-wide">
      <header class="stack-tight">
        <p style="font-family: var(--font-evidence); color: var(--brass); letter-spacing: 0.2em; text-transform: uppercase; font-size: 13px;">
          ${escape(OPENING.setting)}
        </p>
      </header>

      <div class="scene-art" style="background-image: url('/assets/images/parlour.webp'); aspect-ratio: 16/9; height: auto; max-height: 480px;" role="img" aria-label="The interior of 221B Baker Street's parlour at night, lit by an oil lamp on a writing desk and embers in the fireplace."></div>

      <div class="parchment stack-tight" style="font-size: var(--type-md); line-height: 1.6;">
        ${OPENING.body.map(p => html`<p>${raw(p)}</p>`)}
      </div>

      <div class="row" style="justify-content: center;">
        <button class="btn btn-large" id="advance">Answer the door →</button>
      </div>
    </div>
  `;
  root.querySelector('#advance').addEventListener('click', () => {
    _state.beat = 'door';
    drawBeat(root);
  });
  announce('Act One begins. Wednesday, eleven forty-two pm at two-twenty-one B Baker Street. Three knocks at the door.');
}

/* --- BEAT 2: DOOR (atmospheric choice) ------------------------------- */

function drawDoor(root) {
  root.innerHTML = html`
    ${raw(topbar({ act: 1, name: 'The Adventure of the Singular Visitor', progress: 'The door' }))}

    <div class="stage stage-narrow stack">
      <h2 style="font-style: italic;">${raw(CHOICE_AT_DOOR.prompt)}</h2>

      <div class="stack-tight">
        ${CHOICE_AT_DOOR.options.map(o => html`
          <button class="btn btn-secondary" data-choice="${o.id}" style="text-align: left; justify-content: flex-start; padding: var(--s-3); white-space: normal; line-height: 1.5;">${raw(o.label)}</button>
        `)}
      </div>
    </div>
  `;

  root.querySelectorAll('[data-choice]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.choice;
      _state.doorChoice = id;
      const choice = CHOICE_AT_DOOR.options.find(o => o.id === id);
      // Show the consequence narration in a modal-ish reveal, then advance.
      modal({
        heading: '',
        body: `<div class="parchment" style="font-size: var(--type-md); line-height: 1.6;">${choice.after}</div>`,
        primary: 'She enters →',
        onPrimary: () => {
          _state.beat = 'testimony';
          drawBeat(root);
        },
        dismissible: false
      });
    });
  });
}

/* --- BEAT 3: TESTIMONY (pick 3 of 6 questions) ----------------------- */

function drawTestimony(root) {
  root.innerHTML = html`
    ${raw(topbar({ act: 1, name: 'The Adventure of the Singular Visitor', progress: `Questions asked: ${_state.askedQuestions.length} of 3` }))}

    <div class="stage stack-wide">
      <div class="grid-2" style="grid-template-columns: 1fr 2fr; gap: var(--s-4); align-items: start;">
        <div>
          <div class="scene-art" style="background-image: url('/assets/images/whitcombe.webp'); aspect-ratio: 4/5; height: auto;" role="img" aria-label="A late-Victorian woman in deep mourning stands in the doorway of 221B Baker Street, rain on her shoulders, clutching a leather case file."></div>
          <p style="font-family: var(--font-evidence); color: var(--brass); font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; margin-top: var(--s-2); text-align: center;">
            Mrs Eleanor Whitcombe
          </p>
        </div>

        <div class="stack">
          ${_state.askedQuestions.length === 0 ? html`
            <div class="parchment" style="font-size: var(--type-base); line-height: 1.6;">
              ${raw(TESTIMONY_INTRO)}
            </div>
          ` : ''}

          <!-- Conversation log -->
          <div class="stack-tight" id="convo">
            ${_state.askedQuestions.map(qid => {
              const q = QUESTIONS.find(x => x.id === qid);
              return html`
                <div class="msg user" style="max-width: 100%; align-self: stretch; font-family: var(--font-body); font-style: italic;">
                  &ldquo;${raw(q.text)}&rdquo;
                </div>
                ${raw(speech({ who: 'Mrs Whitcombe', role: 'lestrade', initial: 'W', says: q.answer }))}
              `;
            })}
          </div>

          ${_state.askedQuestions.length < 3 ? html`
            <div class="panel">
              <h4 style="margin-bottom: var(--s-2); color: var(--brass-soft); font-style: italic;">
                ${_state.askedQuestions.length === 0 ? 'Ask your first question' : 'Ask another'}
              </h4>
              <div class="stack-tight" id="question-list">
                ${QUESTIONS
                  .filter(q => !_state.askedQuestions.includes(q.id))
                  .filter(q => !_state.lockedQuestions.has(q.id))
                  .map(q => html`
                    <button class="btn btn-secondary" data-qid="${q.id}" style="text-align: left; justify-content: flex-start; padding: var(--s-2) var(--s-3); white-space: normal; line-height: 1.4;">${raw(q.text)}</button>
                  `)}
              </div>
            </div>
          ` : html`
            <div class="parchment stack-tight" style="font-size: var(--type-md); line-height: 1.6;">
              ${raw(TESTIMONY_OUTRO)}
            </div>
            <button class="btn btn-large" id="to-watch">Examine the case-file →</button>
          `}
        </div>
      </div>
    </div>
  `;

  // Wire up question buttons
  root.querySelectorAll('[data-qid]').forEach(btn => {
    btn.addEventListener('click', () => {
      const qid = btn.dataset.qid;
      const q = QUESTIONS.find(x => x.id === qid);
      _state.askedQuestions.push(qid);
      // Lock out any questions this one shadows
      for (const lockId of (q.locks || [])) _state.lockedQuestions.add(lockId);
      // Add to casebook
      Casebook.deposit({ act: 1, stamp: 'Testimony — Whitcombe', quote: q.casebook });
      announce('Mrs Whitcombe answers.');
      drawTestimony(root);
      // Scroll the conversation into view
      setTimeout(() => {
        const lastSpeech = root.querySelector('.speech:last-child');
        lastSpeech?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 80);
    });
  });

  root.querySelector('#to-watch')?.addEventListener('click', () => {
    _state.beat = 'watch';
    drawBeat(root);
  });
}

/* --- BEAT 4: WATCH (hotspot deduction with Holmes telegrams) -------- */

function drawWatch(root) {
  // Initialise watch progress on first entry
  if (Object.keys(_state.watchProgress).length === 0) {
    for (const h of WATCH_HOTSPOTS) {
      _state.watchProgress[h.id] = { resolved: false };
    }
  }

  const total = WATCH_HOTSPOTS.length;
  const resolved = Object.values(_state.watchProgress).filter(p => p.resolved).length;
  const allDone = resolved === total;

  root.innerHTML = html`
    ${raw(topbar({ act: 1, name: 'The Adventure of the Singular Visitor', progress: `Watch examined: ${resolved} of ${total}` }))}

    <div class="stage stack-wide">

      ${resolved === 0 ? html`
        <div class="parchment" style="font-size: var(--type-md); line-height: 1.6;">
          ${raw(WATCH_INTRO)}
          <p style="margin-top: var(--s-2); font-style: italic; color: var(--oxblood);">
            Click on each glowing point of interest. Holmes is on the wire.
          </p>
        </div>
      ` : ''}

      <div class="grid-2" style="grid-template-columns: 2fr 1fr; gap: var(--s-4); align-items: start;">

        <!-- The watch with hotspots overlaid -->
        <div class="scene-canvas" style="background-image: url('/assets/images/watch.webp');" role="img" aria-label="A Victorian gentleman's pocket-watch lying open on a green leather desk, illuminated by a circle of lamplight.">
          ${WATCH_HOTSPOTS.map(h => {
            const done = _state.watchProgress[h.id]?.resolved;
            return html`
              <button class="hotspot" data-hotspot="${h.id}" data-found="${done ? 'true' : 'false'}"
                style="left: ${h.x}%; top: ${h.y}%;"
                aria-label="Hotspot ${h.label}: ${h.title}${done ? ' (resolved)' : ''}">
                ${done ? '' : raw(h.label)}
              </button>
            `;
          })}
        </div>

        <!-- Holmes's telegram log -->
        <aside class="shelf" aria-label="Holmes's telegrams">
          <h4>Telegrams from S. H. (at the docks)</h4>
          <div class="stack-tight" id="telegrams">
            ${_state.telegrams.length === 0 ? html`
              <p style="color: var(--chalk-mute); font-style: italic;">No wires yet. Examine the watch.</p>
            ` : _state.telegrams.map(t => html`
              <div style="font-family: var(--font-evidence); font-size: 14px; color: var(--brass-soft); padding: 8px; border-left: 2px solid var(--brass); background: rgba(184, 153, 104, 0.05); line-height: 1.55;">
                ${raw(t)}
              </div>
            `)}
          </div>
        </aside>
      </div>

      ${allDone ? html`
        <div class="parchment stack-tight" style="font-size: var(--type-md); line-height: 1.6;">
          ${raw(WATCH_OUTRO)}
        </div>
        <div class="row" style="justify-content: center;">
          <button class="btn btn-large" id="end-act">To Mycroft →</button>
        </div>
      ` : ''}
    </div>
  `;

  root.querySelectorAll('[data-hotspot]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.hotspot;
      const h = WATCH_HOTSPOTS.find(x => x.id === id);
      if (_state.watchProgress[id].resolved) return;
      openHotspot(root, h);
    });
  });

  root.querySelector('#end-act')?.addEventListener('click', () => {
    _state.beat = 'outro';
    drawBeat(root);
  });

  if (allDone && resolved === total) {
    // Just resolved the last one — acknowledge
    announce('All four observations recorded. Holmes recommends moving on.');
  }
}

function openHotspot(root, h) {
  // Add the initial telegram for this hotspot if not already
  const initialTelegram = `<strong>POINT ${escape(h.label)}.</strong> ${raw(h.holmes_telegram).raw}`;
  // Append to telegrams immediately
  if (!_state.telegrams.some(t => t.includes(`POINT ${h.label}`))) {
    _state.telegrams.push(initialTelegram);
  }

  modal({
    heading: '',
    body: html`
      <div class="row" style="gap: var(--s-2); margin-bottom: var(--s-3);">
        <span class="pill pill-brass">Point ${escape(h.label)}</span>
        <h3 style="font-style: italic; margin: 0;">${escape(h.title)}</h3>
      </div>

      <div class="parchment" style="margin-bottom: var(--s-3); font-size: var(--type-base); line-height: 1.55;">
        ${raw(h.detail)}
      </div>

      <div style="font-family: var(--font-evidence); font-size: 14px; color: var(--brass-soft); padding: var(--s-2); border-left: 2px solid var(--brass); background: rgba(184, 153, 104, 0.05); margin-bottom: var(--s-3);">
        ${raw(h.holmes_telegram)}
      </div>

      <h4 style="font-style: italic; margin-bottom: var(--s-2);">What do you make of it?</h4>
      <div class="stack-tight" id="hotspot-options">
        ${h.options.map(o => html`
          <button class="btn btn-secondary" data-option="${o.id}" style="text-align: left; justify-content: flex-start; padding: var(--s-2) var(--s-3); white-space: normal; line-height: 1.4;">${raw(o.text)}</button>
        `)}
      </div>

      <div id="hotspot-feedback" aria-live="polite"></div>
    `.raw || '',
    primary: null,
    secondary: null,
    dismissible: true
  });

  // The modal helper expects body as a raw string; the html`` returned an object — pass .raw
  // We need to re-render this manually. Let's use a simpler dom approach.

  // Find the modal we just created and rewire its body
  const backdrop = document.querySelector('.modal-backdrop');
  if (!backdrop) return;
  const modalEl = backdrop.querySelector('.modal');
  // Rebuild the body with the html template literal output (which is a string after .raw)
  modalEl.innerHTML = html`
    <div class="row" style="gap: var(--s-2); margin-bottom: var(--s-3);">
      <span class="pill pill-brass">Point ${escape(h.label)}</span>
      <h3 style="font-style: italic; margin: 0;">${h.title}</h3>
      <button class="btn btn-ghost" id="hotspot-close" aria-label="Close hotspot" style="margin-left: auto; padding: 4px 12px; min-height: 0;">Close ✕</button>
    </div>

    <div class="parchment" style="margin-bottom: var(--s-3); font-size: var(--type-base); line-height: 1.55;">
      ${raw(h.detail)}
    </div>

    <div style="font-family: var(--font-evidence); font-size: 14px; color: var(--brass-soft); padding: var(--s-2); border-left: 2px solid var(--brass); background: rgba(184, 153, 104, 0.05); margin-bottom: var(--s-3);">
      ${raw(h.holmes_telegram)}
    </div>

    <h4 style="font-style: italic; margin-bottom: var(--s-2);">What do you make of it?</h4>
    <div class="stack-tight" id="hotspot-options">
      ${h.options.map(o => html`
        <button class="btn btn-secondary" data-option="${o.id}" style="text-align: left; justify-content: flex-start; padding: var(--s-2) var(--s-3); white-space: normal; line-height: 1.4;">${o.text}</button>
      `)}
    </div>

    <div id="hotspot-feedback" aria-live="polite" style="margin-top: var(--s-2);"></div>
  `;

  modalEl.querySelector('#hotspot-close')?.addEventListener('click', () => {
    backdrop.remove();
    drawBeat(root);    // re-render the watch beat with updated telegrams
  });

  modalEl.querySelectorAll('[data-option]').forEach(btn => {
    btn.addEventListener('click', () => {
      const oid = btn.dataset.option;
      const opt = h.options.find(o => o.id === oid);
      const fb = modalEl.querySelector('#hotspot-feedback');

      if (opt.correct) {
        // Lock buttons
        modalEl.querySelectorAll('[data-option]').forEach(b => b.disabled = true);
        btn.style.borderColor = 'var(--evidence)';
        btn.style.background = 'rgba(95, 124, 63, 0.15)';

        fb.innerHTML = html`
          <div class="feedback correct">
            <div style="font-family: var(--font-evidence); font-size: 13px; color: var(--brass); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px;">— S. H., by wire</div>
            <p style="font-family: var(--font-evidence); font-size: 14px; color: var(--ink); line-height: 1.5;">${raw(opt.holmes)}</p>
          </div>
          <div style="margin-top: var(--s-2); padding: var(--s-2); border-left: 3px solid var(--evidence); background: var(--ink-deep); border-radius: 4px;">
            <span style="font-family: var(--font-evidence); font-size: 12px; color: var(--brass); letter-spacing: 0.1em; text-transform: uppercase;">Casebook</span>
            <div style="font-style: italic; color: var(--parchment); margin-top: 4px;">${raw(opt.casebook)}</div>
          </div>
          <div class="row" style="justify-content: flex-end; margin-top: var(--s-3);">
            <button class="btn" id="hotspot-next">Continue →</button>
          </div>
        `;

        _state.watchProgress[h.id] = { resolved: true, deduction: opt.casebook };
        _state.telegrams.push(`<strong>POINT ${escape(h.label)}.</strong> CONFIRMED. ${raw(opt.holmes).raw}`);
        Casebook.deposit({ act: 1, stamp: `Watch — Point ${h.label}`, quote: opt.casebook });
        announce('Holmes confirms.');
        toast('Deduction confirmed', 'evidence');

        modalEl.querySelector('#hotspot-next').addEventListener('click', () => {
          backdrop.remove();
          drawBeat(root);
        });
      } else {
        // Wrong — show Holmes's correction + hint, allow retry
        btn.disabled = true;
        btn.style.opacity = '0.5';

        fb.innerHTML = html`
          <div class="feedback partial">
            <div style="font-family: var(--font-evidence); font-size: 13px; color: var(--brass); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px;">— S. H., by wire</div>
            <p style="font-family: var(--font-evidence); font-size: 14px; color: var(--ink); line-height: 1.5;">${raw(opt.holmes)}</p>
            <p style="margin-top: var(--s-2); font-style: italic;"><strong>Hint.</strong> ${raw(opt.hint)}</p>
          </div>
        `;
        _state.telegrams.push(`<strong>POINT ${escape(h.label)}.</strong> NOT QUITE. ${raw(opt.holmes).raw}`);
      }
    });
  });
}

/* --- BEAT 5: OUTRO (close act) -------------------------------------- */

function drawOutro(root) {
  const deductions = Object.entries(_state.watchProgress)
    .filter(([_, v]) => v.resolved)
    .map(([k, v]) => v.deduction);

  Casebook.completeAct(1, {
    score: deductions.length,
    total: WATCH_HOTSPOTS.length,
    epitaph: 'A late call answered. The watch read. The Captain&apos;s alibi shaken. Mycroft next.'
  });

  root.innerHTML = html`
    <div class="stage stage-narrow stack-wide" style="text-align: center;">
      <p style="font-family: var(--font-evidence); color: var(--brass); letter-spacing: 0.2em; text-transform: uppercase; font-size: 13px; margin-bottom: var(--s-2);">
        Act I — Closed
      </p>
      <h1 style="font-style: italic;">The night is not over.</h1>

      <div class="parchment stack-tight" style="text-align: left;">
        <p>Three questions put. Four observations recorded. A pocket-watch on a green leather desk, telling a different story to the one the Captain has confessed to.</p>
        <p>Mrs Whitcombe&apos;s case-file lies open. Her brother has three days.</p>
        <p>Mycroft will know what business James Whitcombe was on in the Punjab — but Mycroft is, in Sherlock&apos;s phrase, <em>"the British Government when in a particularly bad mood."</em> He does not part with secrets cheaply. <strong>You will need to argue for them.</strong></p>
      </div>

      <div class="row" style="justify-content: center; gap: var(--s-2);">
        <a href="#/title" class="btn btn-secondary">Return to the index</a>
        <a href="#/act/2" class="btn btn-large">To the Diogenes Club →</a>
      </div>
    </div>
  `;

  announce('Act One closed. Proceed to Act Two when ready.');
}
