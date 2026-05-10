/**
 * Act II — Convince Mycroft.
 *
 * Four progressive levels (Lakera Gandalf-style). Each level the student
 * must construct an inductive argument in standard form. Server-side judge
 * (Anthropic Haiku 4.5) evaluates against a stage-specific rubric and returns
 * structured JSON.
 */

import { Casebook } from '../core/state.js?v=3';
import { judge } from '../core/ai-client.js?v=3';
import { html, raw, escape, speech, topbar, toast, modal, shelf } from '../core/components.js?v=3';
import { announce } from '../core/nav.js?v=3';
import { ACT2_INTRO, MYCROFT_LEVELS, ACT2_OUTRO } from '../../data/act2-mycroft.js?v=3';

let _state = null;

function freshState() {
  return {
    beat: 'intro',         // intro | levels | outro
    levelIdx: 0,
    levelHistory: [],      // [{ levelN, attempts, accepted, intelligence_unlocked }]
    currentTranscript: [], // for the active level only
    submitting: false,
    intelligenceLog: []    // accumulating Foreign Office reveals
  };
}

export function render(root, _params) {
  // Resume from previous state if level was already partly done?
  // For simplicity: every entry resets. The casebook persists earned intelligence.
  _state = freshState();
  drawBeat(root);
}

export function cleanup() {}

function drawBeat(root) {
  if (_state.beat === 'intro')  return drawIntro(root);
  if (_state.beat === 'levels') return drawLevel(root);
  if (_state.beat === 'outro')  return drawOutro(root);
}

/* --- INTRO ------------------------------------------------------- */

function drawIntro(root) {
  root.innerHTML = html`
    ${raw(topbar({ act: 2, name: 'Convince Mycroft', progress: 'The Strangers\u0027 Room' }))}

    <div class="stage stage-narrow stack-wide">
      <header class="stack-tight">
        <p style="font-family: var(--font-evidence); color: var(--brass); letter-spacing: 0.2em; text-transform: uppercase; font-size: 13px;">
          ${escape(ACT2_INTRO.setting)}
        </p>
      </header>

      <div class="scene-art" style="background-image: url('/assets/images/mycroft.webp'); aspect-ratio: 5/4; height: auto; max-height: 540px;" role="img" aria-label="Mycroft Holmes seated in an enormous leather wingback chair at the Diogenes Club, brandy aloft, eyes heavy-lidded with weary impatience."></div>

      <div class="parchment stack-tight" style="font-size: var(--type-md); line-height: 1.6;">
        ${ACT2_INTRO.body.map(p => html`<p>${raw(p)}</p>`)}
      </div>

      <div class="row" style="justify-content: center;">
        <button class="btn btn-large" id="advance">Take a seat at the desk →</button>
      </div>
    </div>
  `;
  root.querySelector('#advance').addEventListener('click', () => {
    _state.beat = 'levels';
    drawBeat(root);
  });
  announce('Act Two. The Diogenes Club. Mycroft awaits an argument.');
}

/* --- LEVEL (the meat) -------------------------------------------- */

function drawLevel(root) {
  const level = MYCROFT_LEVELS[_state.levelIdx];
  const totalLevels = MYCROFT_LEVELS.length;

  root.innerHTML = html`
    ${raw(topbar({ act: 2, name: 'Convince Mycroft', progress: `Level ${_state.levelIdx + 1} of ${totalLevels}` }))}

    <div class="stage stack-wide">
      <header class="stack-tight">
        <p style="font-family: var(--font-evidence); color: var(--brass-soft); font-style: italic;">${escape(level.persona)}</p>
        <h2 style="font-style: italic;">${raw(level.title)}</h2>
      </header>

      ${level.mycroftClaim ? html`
        <div class="speech mycroft" role="region" aria-label="Mycroft's counter-claim">
          <div class="avatar" aria-hidden="true">M</div>
          <div>
            <div class="who">Mycroft Holmes</div>
            <div class="what">${raw(level.mycroftClaim)}</div>
          </div>
        </div>
      ` : ''}

      <div class="parchment">
        <h4 style="color: var(--oxblood); font-style: italic; margin-bottom: var(--s-2);">The proposition</h4>
        <p>${raw(level.proposition)}</p>
      </div>

      <div class="grid-2" style="grid-template-columns: 2fr 1fr; gap: var(--s-4); align-items: start;">
        <div class="stack">
          <h3 style="font-style: italic;">Your argument</h3>

          <textarea class="arg-editor" id="argument-editor" maxlength="2000"
            placeholder="${escape(level.placeholder)}"
            aria-label="Argument editor — write your standard-form argument"></textarea>

          <div class="row" style="gap: var(--s-2);">
            <button class="btn" id="submit-btn">Submit to Mycroft</button>
            <button class="btn btn-secondary" id="clear-btn">Clear and start over</button>
          </div>

          <div id="thinking" style="display: none;">
            <p class="thinking" style="color: var(--brass);">Mycroft is reading...</p>
          </div>

          <!-- Transcript of attempts at this level -->
          <div class="transcript" id="transcript" aria-label="Conversation with Mycroft" style="${_state.currentTranscript.length === 0 ? 'display: none;' : ''}">
            ${_state.currentTranscript.map(turn => renderTurn(turn))}
          </div>
        </div>

        <aside class="stack">
          <div class="shelf">
            <h4>Mycroft\u0027s rubric</h4>
            <ul>
              ${level.rubric.map(r => html`<li>${raw(r)}</li>`)}
            </ul>
          </div>

          <div class="shelf">
            <h4>Standard-form reminder</h4>
            <ul>
              <li>Number every premise: <strong>P1</strong>, <strong>P2</strong>, …</li>
              <li>Mark the conclusion: <strong>∴ C</strong> (or "Therefore,").</li>
              <li>Inductive ⇒ "probably," not "certainly."</li>
              <li>Each premise should be a <strong>distinct</strong> reason.</li>
              <li>Cogency = strength + plausibly TRUE premises.</li>
            </ul>
          </div>

          ${_state.intelligenceLog.length > 0 ? html`
            <div class="shelf">
              <h4>Intelligence already obtained</h4>
              <ul>
                ${_state.intelligenceLog.map(i => html`<li style="font-style: italic;">${escape(i)}</li>`)}
              </ul>
            </div>
          ` : ''}
        </aside>
      </div>
    </div>
  `;

  const editor = root.querySelector('#argument-editor');
  // Load any draft from the previous attempt at this level
  const lastUserTurn = [..._state.currentTranscript].reverse().find(t => t.role === 'user');
  if (lastUserTurn) editor.value = lastUserTurn.text;
  editor.focus();

  root.querySelector('#submit-btn').addEventListener('click', () => onSubmit(root, level));
  root.querySelector('#clear-btn').addEventListener('click', () => {
    editor.value = '';
    editor.focus();
  });
  // Ctrl+Enter to submit
  editor.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') onSubmit(root, level);
  });
}

function renderTurn(turn) {
  if (turn.role === 'user') {
    return html`
      <div class="msg user">
        <div style="font-family: var(--font-evidence); font-size: 12px; color: var(--brass); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px;">Watson</div>
        <pre style="font-family: var(--font-evidence); white-space: pre-wrap; margin: 0; line-height: 1.5;">${escape(turn.text)}</pre>
      </div>
    `;
  }
  // judge turn
  const j = turn.judgement || {};
  const verdict = j.verdict === 'accept' ? 'accept' : 'reject';
  return html`
    <div class="msg judge">
      <div style="margin-bottom: 6px;">
        <span class="verdict-tag verdict-${verdict}">${verdict}</span>
        <span style="font-family: var(--font-evidence); font-size: 12px; color: var(--brass); letter-spacing: 0.1em; text-transform: uppercase;">Mycroft</span>
      </div>
      <p style="font-style: italic; color: var(--ink);">${raw(j.in_character || '')}</p>
      ${j.fix_hint && verdict === 'reject' ? html`
        <p style="margin-top: var(--s-1); font-size: 15px; color: var(--ink);">
          <strong>Fix:</strong> ${escape(j.fix_hint)}
        </p>
      ` : ''}
      ${j.intelligence_unlocked && verdict === 'accept' ? html`
        <div style="margin-top: var(--s-2); padding: var(--s-2); border-left: 3px solid var(--evidence); background: rgba(95, 124, 63, 0.08);">
          <span style="font-family: var(--font-evidence); font-size: 12px; color: var(--evidence); letter-spacing: 0.1em; text-transform: uppercase;">Intelligence</span>
          <div style="font-style: italic; margin-top: 4px;">${escape(j.intelligence_unlocked)}</div>
        </div>
      ` : ''}
    </div>
  `;
}

async function onSubmit(root, level) {
  if (_state.submitting) return;
  const editor = root.querySelector('#argument-editor');
  const text = editor.value.trim();
  if (text.length < 20) {
    toast('Mycroft expects more than that.', 'warning');
    return;
  }

  _state.submitting = true;
  root.querySelector('#submit-btn').disabled = true;
  root.querySelector('#thinking').style.display = '';

  // Append user turn locally
  _state.currentTranscript.push({ role: 'user', text });

  // Build history for the API (last few turns of THIS level only — fresh perspective)
  const history = _state.currentTranscript.slice(0, -1).map(t => ({
    role: t.role === 'user' ? 'user' : 'model',
    text: t.role === 'user' ? t.text : (t.judgement?.in_character || '')
  }));

  const result = await judge({
    stage: level.stage,
    payload: { argument: text },
    history
  });

  _state.submitting = false;
  root.querySelector('#thinking').style.display = 'none';
  root.querySelector('#submit-btn').disabled = false;

  if (!result.ok) {
    toast(`Could not reach Mycroft: ${result.error}`, 'warning');
    // Remove the user turn we tentatively added
    _state.currentTranscript.pop();
    return;
  }

  const j = result.data;
  // Edge case: model returned a parse_failed shape
  if (j.error === 'parse_failed') {
    toast('Mycroft replied incoherently. Try sending again.', 'warning');
    _state.currentTranscript.pop();
    return;
  }

  _state.currentTranscript.push({ role: 'judge', judgement: j });

  if (j.verdict === 'accept') {
    if (j.intelligence_unlocked) {
      _state.intelligenceLog.push(j.intelligence_unlocked);
      Casebook.deposit({ act: 2, stamp: `Mycroft, Level ${level.n}`, quote: j.intelligence_unlocked });
    }
    _state.levelHistory.push({ levelN: level.n, accepted: true });

    drawBeat(root);
    announce(`Level ${level.n} accepted. ${j.in_character}`);
    setTimeout(() => {
      const next = _state.levelIdx + 1;
      modal({
        heading: `Level ${level.n} — Accepted`,
        body: `<p style="font-style: italic; line-height: 1.6;">${escape(j.in_character)}</p>${j.intelligence_unlocked ? `<div style="margin-top: var(--s-2); padding: var(--s-2); border-left: 3px solid var(--evidence); background: rgba(95, 124, 63, 0.08);"><span style="font-family: var(--font-evidence); font-size: 12px; color: var(--evidence-soft); letter-spacing: 0.1em; text-transform: uppercase;">Intelligence Unlocked</span><div style="font-style: italic; margin-top: 4px; color: var(--parchment);">${escape(j.intelligence_unlocked)}</div></div>` : ''}`,
        primary: next < MYCROFT_LEVELS.length ? `To Level ${next + 1} →` : 'Press for the operational briefing →',
        onPrimary: () => {
          if (next < MYCROFT_LEVELS.length) {
            _state.levelIdx = next;
            _state.currentTranscript = [];
            drawBeat(root);
          } else {
            _state.beat = 'outro';
            drawBeat(root);
          }
        },
        dismissible: false
      });
    }, 200);
  } else {
    drawBeat(root);
    // Restore the editor with the rejected text so they can iterate
    setTimeout(() => {
      const ed = root.querySelector('#argument-editor');
      if (ed) {
        ed.value = text;
        ed.focus();
      }
      // Scroll the latest judge turn into view
      const lastJudge = root.querySelectorAll('.msg.judge');
      lastJudge[lastJudge.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
    announce(`Mycroft rejects. ${j.in_character}`);
  }
}

/* --- OUTRO ------------------------------------------------------- */

function drawOutro(root) {
  Casebook.completeAct(2, {
    mycroftLevel: 4,
    badgesEarned: ['Foreign Office Operational Briefing'],
    epitaph: 'The Diogenes Club has yielded its secret. The motive is real; the killer is not yet named.'
  });

  root.innerHTML = html`
    ${raw(topbar({ act: 2, name: 'Convince Mycroft', progress: 'Closed' }))}

    <div class="stage stage-narrow stack-wide" style="text-align: center;">
      <p style="font-family: var(--font-evidence); color: var(--brass); letter-spacing: 0.2em; text-transform: uppercase; font-size: 13px;">
        Act II — Closed
      </p>
      <h1 style="font-style: italic;">Mycroft has spoken.</h1>

      <div class="parchment stack-tight" style="text-align: left;">
        ${ACT2_OUTRO.body.map(p => html`<p style="font-size: var(--type-md); line-height: 1.6;">${raw(p)}</p>`)}
      </div>

      <div class="row" style="justify-content: center; gap: var(--s-2);">
        <a href="#/title" class="btn btn-secondary">The Index</a>
        <a href="#/act/3" class="btn btn-large">To Pentonville Gaol →</a>
      </div>
    </div>
  `;

  announce('Act Two closed. Proceed to Act Three.');
}
