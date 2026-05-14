/**
 * Act III — The Free Will Inquiry.
 *
 * Five beats:
 *   1. Pentonville cell + Holmes's setup
 *   2. Sapolsky's letter — pick the faithful standard-form rendering
 *   3. Lestrade's objection — which premise is he attacking?
 *   4. Student's own argument; AI-Sapolsky rebuts one premise
 *   5. Holmes wraps; transition to Act IV
 *
 * One AI call per student (the Sapolsky rebut).
 */

import { Casebook } from '../core/state.js?v=7';
import { judge } from '../core/ai-client.js?v=7';
import { html, raw, escape, speech, topbar, toast, modal } from '../core/components.js?v=7';
import { announce } from '../core/nav.js?v=7';
import {
  ACT3_INTRO, SAPOLSKY_LETTER, STANDARD_FORM_OPTIONS,
  LESTRADE_OBJECTION, PREMISE_OPTIONS,
  STUDENT_WRITES_PROMPT, ACT3_OUTRO, SAPOLSKY_PROPOSITION
} from '../../data/act3-sapolsky.js?v=7';

let _state = null;

function freshState() {
  return {
    beat: 'intro',
    sfPicked: null,         // id of student's pick from STANDARD_FORM_OPTIONS
    premisePicked: null,    // id of student's pick from PREMISE_OPTIONS
    studentArgument: '',
    sapolskyChallenge: null,
    revisedArgument: null,
    submitting: false,
    structureScore: 0       // tally of correct moves on rendering + premise picks
  };
}

export function render(root, _params) {
  _state = freshState();
  drawBeat(root);
}
export function cleanup() {}

function drawBeat(root) {
  const m = {
    intro: drawIntro,
    letter: drawLetter,
    objection: drawObjection,
    write: drawWrite,
    challenge: drawChallenge,
    outro: drawOutro
  };
  return (m[_state.beat] || drawIntro)(root);
}

/* --- INTRO ------------------------------------------------------- */

function drawIntro(root) {
  root.innerHTML = html`
    ${raw(topbar({ act: 3, name: 'The Free Will Inquiry', progress: 'Pentonville Gaol' }))}

    <div class="stage stage-narrow stack-wide">
      <header class="stack-tight">
        <p style="font-family: var(--font-evidence); color: var(--brass); letter-spacing: 0.2em; text-transform: uppercase; font-size: 13px;">
          ${escape(ACT3_INTRO.setting)}
        </p>
      </header>

      <div class="scene-art" style="background-image: url('/assets/images/captain.webp'); aspect-ratio: 5/4; height: auto; max-height: 540px;" role="img" aria-label="Captain James Whitcombe alone in a Pentonville prison cell, late at night, staring at his own hands as if questioning whether they are his."></div>

      <div class="parchment stack-tight" style="font-size: var(--type-md); line-height: 1.6;">
        ${ACT3_INTRO.body.map(p => html`<p>${raw(p)}</p>`)}
      </div>

      <div class="row" style="justify-content: center;">
        <button class="btn btn-large" id="advance">Read Sapolsky\u0027s letter →</button>
      </div>
    </div>
  `;
  root.querySelector('#advance').addEventListener('click', () => {
    _state.beat = 'letter';
    drawBeat(root);
  });
  announce('Act Three. Pentonville Gaol. Holmes presents a letter from Dr Sapolsky.');
}

/* --- LETTER (read + identify faithful standard form) ------------- */

function drawLetter(root) {
  root.innerHTML = html`
    ${raw(topbar({ act: 3, name: 'The Free Will Inquiry', progress: 'Sapolsky\u0027s letter' }))}

    <div class="stage stack-wide">
      <div class="grid-2" style="grid-template-columns: 3fr 4fr; gap: var(--s-4); align-items: start;">

        <div class="parchment" style="font-size: var(--type-base); line-height: 1.65;">
          <p style="font-family: var(--font-display); font-style: italic; color: var(--oxblood); font-size: var(--type-md); margin-bottom: var(--s-2);">A letter, in Sapolsky\u0027s hand</p>
          ${raw(SAPOLSKY_LETTER)}
        </div>

        <div class="stack">
          <div class="parchment">
            <h4 style="color: var(--oxblood); font-style: italic; margin-bottom: var(--s-2);">Your task</h4>
            <p>Three candidate renderings of Sapolsky\u0027s argument. <strong>Pick the one most faithful to his reasoning.</strong> The highlighted lines in the letter are his three premises.</p>
          </div>

          <div class="stack-tight" id="sf-options">
            ${STANDARD_FORM_OPTIONS.map(o => html`
              <button class="suspect-card" data-sf="${o.id}" aria-label="Pick ${o.label}">
                <div class="name">${o.label}</div>
                <pre style="font-family: var(--font-evidence); white-space: pre-wrap; margin-top: var(--s-1); font-size: 14px; line-height: 1.5; color: var(--chalk);">${escape(o.body)}</pre>
              </button>
            `)}
          </div>

          <div id="sf-feedback" aria-live="polite"></div>
        </div>
      </div>
    </div>
  `;

  root.querySelectorAll('[data-sf]').forEach(btn => {
    btn.addEventListener('click', () => onSfPick(root, btn.dataset.sf));
  });
}

function onSfPick(root, id) {
  const opt = STANDARD_FORM_OPTIONS.find(o => o.id === id);
  _state.sfPicked = id;
  if (opt.correct) _state.structureScore += 2;

  // Highlight selection
  root.querySelectorAll('[data-sf]').forEach(b => b.dataset.selected = String(b.dataset.sf === id));

  const fb = root.querySelector('#sf-feedback');
  fb.innerHTML = html`
    <div class="feedback ${opt.correct ? 'correct' : 'partial'}">
      <h4>${opt.correct ? 'Faithful to Sapolsky' : 'Not quite'}</h4>
      <p>${raw(opt.feedback)}</p>
      ${opt.correct ? html`
        <div class="row" style="justify-content: flex-end; margin-top: var(--s-2);">
          <button class="btn" id="to-objection">Lestrade arrives →</button>
        </div>
      ` : html`
        <p style="margin-top: var(--s-2); font-style: italic;">Try another rendering.</p>
      `}
    </div>
  `;

  if (opt.correct) {
    Casebook.deposit({ act: 3, stamp: 'Sapolsky reconstructed', quote: 'The student identified the faithful standard-form rendering of Sapolsky\u0027s argument against free will.' });
    fb.querySelector('#to-objection').addEventListener('click', () => {
      _state.beat = 'objection';
      drawBeat(root);
    });
  }
}

/* --- OBJECTION (which premise is Lestrade attacking?) ------------ */

function drawObjection(root) {
  root.innerHTML = html`
    ${raw(topbar({ act: 3, name: 'The Free Will Inquiry', progress: 'Lestrade objects' }))}

    <div class="stage stack-wide">
      ${raw(speech({ who: 'Inspector Lestrade', role: 'lestrade', initial: 'L', says: LESTRADE_OBJECTION }))}

      <div class="parchment">
        <h4 style="color: var(--oxblood); font-style: italic; margin-bottom: var(--s-2);">Your task</h4>
        <p>Lestrade is attacking <strong>one premise</strong> of Sapolsky\u0027s argument. Identify which one.</p>
      </div>

      <div class="stack-tight" id="premise-options">
        ${PREMISE_OPTIONS.map(o => html`
          <button class="suspect-card" data-premise="${o.id}">
            <div class="name">${escape(o.label)}</div>
          </button>
        `)}
      </div>

      <div id="premise-feedback" aria-live="polite"></div>
    </div>
  `;

  root.querySelectorAll('[data-premise]').forEach(btn => {
    btn.addEventListener('click', () => onPremisePick(root, btn.dataset.premise));
  });
}

function onPremisePick(root, id) {
  const opt = PREMISE_OPTIONS.find(o => o.id === id);
  _state.premisePicked = id;
  if (opt.correct) _state.structureScore += 2;

  root.querySelectorAll('[data-premise]').forEach(b => b.dataset.selected = String(b.dataset.premise === id));

  const fb = root.querySelector('#premise-feedback');
  fb.innerHTML = html`
    <div class="feedback ${opt.correct ? 'correct' : 'partial'}">
      <h4>${opt.correct ? 'Yes — that is exactly Lestrade\u0027s line' : 'Closer, but consider where Lestrade actually disagrees'}</h4>
      <p>${raw(opt.feedback)}</p>
      ${opt.correct ? html`
        <div class="row" style="justify-content: flex-end; margin-top: var(--s-2);">
          <button class="btn" id="to-write">Now your turn →</button>
        </div>
      ` : html`
        <p style="margin-top: var(--s-2); font-style: italic;">Try another premise.</p>
      `}
    </div>
  `;

  if (opt.correct) {
    Casebook.deposit({ act: 3, stamp: 'Lestrade\u0027s premise', quote: 'Lestrade is a compatibilist: he attacks the inference from "inevitable from unchosen causes" to "not freely chosen" — premise three of Sapolsky\u0027s argument.' });
    fb.querySelector('#to-write').addEventListener('click', () => {
      _state.beat = 'write';
      drawBeat(root);
    });
  }
}

/* --- WRITE (student's own standard-form argument) --------------- */

function drawWrite(root) {
  root.innerHTML = html`
    ${raw(topbar({ act: 3, name: 'The Free Will Inquiry', progress: 'Your argument' }))}

    <div class="stage stack-wide">
      <div class="parchment stack-tight" style="font-size: var(--type-base); line-height: 1.6;">
        ${raw(STUDENT_WRITES_PROMPT)}
      </div>

      <div class="grid-2" style="grid-template-columns: 2fr 1fr; gap: var(--s-4); align-items: start;">
        <div class="stack">
          <h3 style="font-style: italic;">Your argument</h3>
          <textarea class="arg-editor" id="argument-editor" maxlength="2500"
            placeholder="P1: A confession given in a fugue state cannot reliably reflect intent...
P2: ...
P3: ...
∴ C: Therefore, the Captain should / should not be held morally responsible..."
            aria-label="Argument editor"></textarea>

          <div class="row" style="gap: var(--s-2);">
            <button class="btn" id="submit-btn">Submit to Sapolsky\u0027s phonograph</button>
            <button class="btn btn-secondary" id="clear-btn">Clear</button>
          </div>

          <div id="thinking" style="display: none;">
            <p class="thinking" style="color: var(--brass);">The phonograph cylinder is being prepared...</p>
          </div>
        </div>

        <aside class="stack">
          <div class="shelf">
            <h4>The proposition</h4>
            <p style="font-style: italic;">${escape(SAPOLSKY_PROPOSITION)}</p>
            <p style="margin-top: var(--s-2);">You may argue <strong>for</strong> OR <strong>against</strong>. The structure of your argument is what matters.</p>
          </div>

          <div class="shelf">
            <h4>What Sapolsky will check</h4>
            <ul>
              <li>Conclusion clearly marked.</li>
              <li>Premises distinct and supportable.</li>
              <li>Inductive bridge from premises to conclusion bears weight.</li>
              <li>He will challenge ONE premise. Be ready to defend it.</li>
            </ul>
          </div>

          <div class="shelf">
            <h4>Hint</h4>
            <p style="font-size: 14px;">"The brain causes everything" is hard to defend on its own. "Fugue states involve documented impairment of memory and intent (per the Aldershot surgeon)" is easier — it cites evidence.</p>
            <p style="margin-top: var(--s-1); font-size: 13px; color: var(--chalk-mute); font-style: italic;">Stuck on form? Hit 💡 Hints (bottom right).</p>
          </div>
        </aside>
      </div>
    </div>
  `;

  const editor = root.querySelector('#argument-editor');
  editor.focus();
  if (_state.studentArgument) editor.value = _state.studentArgument;

  root.querySelector('#submit-btn').addEventListener('click', () => onWriteSubmit(root));
  root.querySelector('#clear-btn').addEventListener('click', () => { editor.value = ''; editor.focus(); });
  editor.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') onWriteSubmit(root);
  });
}

async function onWriteSubmit(root) {
  if (_state.submitting) return;
  const editor = root.querySelector('#argument-editor');
  const text = editor.value.trim();
  if (text.length < 30) {
    toast('A serious argument needs more than that.', 'warning');
    return;
  }

  _state.submitting = true;
  _state.studentArgument = text;
  root.querySelector('#submit-btn').disabled = true;
  root.querySelector('#thinking').style.display = '';

  const act1Evidence = (Casebook.get().acts[1]?.evidenceMarked || []);
  const result = await judge({
    stage: 'sapolsky-rebut',
    payload: { argument: text, proposition: SAPOLSKY_PROPOSITION, evidence: act1Evidence }
  });

  _state.submitting = false;
  root.querySelector('#submit-btn').disabled = false;
  root.querySelector('#thinking').style.display = 'none';

  if (!result.ok) {
    toast(`Phonograph trouble: ${result.error}`, 'warning');
    return;
  }

  if (result.data.error === 'parse_failed') {
    toast('Sapolsky\u0027s reply was unintelligible. Try sending again.', 'warning');
    return;
  }

  _state.sapolskyChallenge = result.data;
  _state.beat = 'challenge';
  drawBeat(root);
}

/* --- CHALLENGE (Sapolsky's rebut + student decides) -------------- */

function drawChallenge(root) {
  const c = _state.sapolskyChallenge;

  root.innerHTML = html`
    ${raw(topbar({ act: 3, name: 'The Free Will Inquiry', progress: 'Sapolsky responds' }))}

    <div class="stage stack-wide">
      <div class="parchment">
        <h4 style="color: var(--oxblood); font-style: italic; margin-bottom: var(--s-2);">Your argument, as Sapolsky reads it</h4>
        <p style="font-style: italic;">${escape(c.argument_summary || 'No summary provided.')}</p>
        <details style="margin-top: var(--s-2);">
          <summary style="cursor: pointer; color: var(--oxblood); font-weight: 600;">View full argument</summary>
          <pre style="font-family: var(--font-evidence); white-space: pre-wrap; margin-top: var(--s-1); font-size: 14px; line-height: 1.5;">${escape(_state.studentArgument)}</pre>
        </details>
      </div>

      <div class="speech sapolsky" role="region" aria-label="Sapolsky's challenge">
        <div class="avatar" aria-hidden="true">S</div>
        <div>
          <div class="who">Robert M. Sapolsky · by phonograph</div>
          <div class="what">
            <p style="margin-bottom: var(--s-2); font-family: var(--font-evidence); font-size: 14px; color: var(--brass-soft); letter-spacing: 0.05em;">
              CHALLENGING: <strong>${escape(c.premise_challenged || '(unspecified)')}</strong>
            </p>
            <p>${escape(c.challenge || '(no challenge returned)')}</p>
          </div>
        </div>
      </div>

      <div class="parchment">
        <h4 style="color: var(--oxblood); font-style: italic; margin-bottom: var(--s-2);">What would strengthen your case</h4>
        <p style="font-style: italic;">${escape(c.what_would_strengthen || '(no suggestion returned)')}</p>
      </div>

      <div class="row" style="justify-content: center; gap: var(--s-2); flex-wrap: wrap;">
        <button class="btn btn-secondary" id="revise">Revise the argument</button>
        <button class="btn btn-large" id="stand">Stand by my argument →</button>
      </div>
    </div>
  `;

  Casebook.deposit({
    act: 3,
    stamp: 'Sapolsky challenges',
    quote: `Sapolsky challenged ${c.premise_challenged}: "${(c.challenge || '').slice(0, 110)}…"`
  });

  root.querySelector('#revise').addEventListener('click', () => {
    _state.beat = 'write';
    drawBeat(root);
    setTimeout(() => {
      const ed = root.querySelector('#argument-editor');
      if (ed) {
        ed.value = _state.studentArgument;
        ed.focus();
      }
    }, 80);
  });
  root.querySelector('#stand').addEventListener('click', () => {
    _state.revisedArgument = _state.studentArgument;
    _state.beat = 'outro';
    drawBeat(root);
  });

  announce('Sapolsky has issued a challenge to your reasoning.');
}

/* --- OUTRO ------------------------------------------------------ */

function drawOutro(root) {
  Casebook.completeAct(3, {
    structureScore: _state.structureScore,
    finalArgument: _state.studentArgument,
    epitaph: 'The free-will question argued in standard form. The truth of the confession remains for the locked room itself to settle.'
  });

  root.innerHTML = html`
    ${raw(topbar({ act: 3, name: 'The Free Will Inquiry', progress: 'Closed' }))}

    <div class="stage stage-narrow stack-wide" style="text-align: center;">
      <p style="font-family: var(--font-evidence); color: var(--brass); letter-spacing: 0.2em; text-transform: uppercase; font-size: 13px;">
        Act III — Closed
      </p>
      <h1 style="font-style: italic;">The argument is on the record.</h1>

      <div class="parchment stack-tight" style="text-align: left;">
        ${ACT3_OUTRO.body.map(p => html`<p style="font-size: var(--type-md); line-height: 1.6;">${raw(p)}</p>`)}
      </div>

      <div class="row" style="justify-content: center; gap: var(--s-2);">
        <a href="#/title" class="btn btn-secondary">The Index</a>
        <a href="#/act/4" class="btn btn-large">To the Reform Club →</a>
      </div>
    </div>
  `;

  announce('Act Three closed. To Act Four — the Reform Club.');
}
