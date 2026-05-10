/**
 * Act IV — The Final Deduction.
 * Locked-room point-and-click investigation. Eight hotspots, three suspects,
 * student writes a deductive argument; Holmes-AI evaluates validity + soundness.
 */

import { Casebook } from '../core/state.js?v=5';
import { judge } from '../core/ai-client.js?v=5';
import { html, raw, escape, speech, topbar, toast, modal } from '../core/components.js?v=5';
import { announce, navigate } from '../core/nav.js?v=5';
import {
  ACT4_INTRO, HOTSPOTS, SUSPECTS,
  ACT4_WRITE_PROMPT, ACT4_BACK_TO_HOTSPOTS_REMINDER, ACT4_FAIL_HINT
} from '../../data/act4-investigation.js?v=5';

let _state = null;

function freshState() {
  return {
    beat: 'intro',           // intro | scene | accuse | write | result
    examined: new Set(),
    findings: [],            // accumulated casebook entries from hotspots
    accusedSuspect: null,
    studentArgument: '',
    submitting: false,
    finalEvaluation: null,
    attempts: 0
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
    scene: drawScene,
    accuse: drawAccuse,
    write: drawWrite,
    result: drawResult
  };
  return (m[_state.beat] || drawIntro)(root);
}

/* --- INTRO ------------------------------------------------------- */

function drawIntro(root) {
  root.innerHTML = html`
    ${raw(topbar({ act: 4, name: 'The Final Deduction', progress: 'The Reform Club' }))}

    <div class="stage stage-narrow stack-wide">
      <header class="stack-tight">
        <p style="font-family: var(--font-evidence); color: var(--brass); letter-spacing: 0.2em; text-transform: uppercase; font-size: 13px;">
          ${escape(ACT4_INTRO.setting)}
        </p>
      </header>

      <div class="scene-art" style="background-image: url('/assets/images/crime-scene.webp'); aspect-ratio: 16/9; height: auto; max-height: 520px;" role="img" aria-label="The Reform Club's private dining room: chalk outline on the rug, key in the inside lock, tipped-over decanter, revolver on the floor."></div>

      <div class="parchment stack-tight" style="font-size: var(--type-md); line-height: 1.6;">
        ${ACT4_INTRO.body.map(p => html`<p>${raw(p)}</p>`)}
      </div>

      <div class="row" style="justify-content: center;">
        <button class="btn btn-large" id="advance">Examine the room →</button>
      </div>
    </div>
  `;
  root.querySelector('#advance').addEventListener('click', () => {
    _state.beat = 'scene';
    drawBeat(root);
  });
  announce('Act Four. The Reform Club. Eight hotspots to examine.');
}

/* --- SCENE (point-and-click investigation) ------------------------ */

function drawScene(root) {
  const total = HOTSPOTS.length;
  const examined = _state.examined.size;

  root.innerHTML = html`
    ${raw(topbar({ act: 4, name: 'The Final Deduction', progress: `Examined: ${examined} of ${total}` }))}

    <div class="stage stack-wide">

      <div class="grid-2" style="grid-template-columns: 3fr 1fr; gap: var(--s-4); align-items: start;">

        <div class="scene-canvas" style="background-image: url('/assets/images/crime-scene.webp');" role="img" aria-label="The Reform Club crime scene. Click the numbered hotspots to examine.">
          ${HOTSPOTS.map(h => {
            const done = _state.examined.has(h.id);
            return html`
              <button class="hotspot" data-hotspot="${h.id}" data-found="${done ? 'true' : 'false'}"
                style="left: ${h.x}%; top: ${h.y}%;"
                aria-label="${done ? 'Examined' : 'Examine'}: ${h.title}">
                ${done ? '' : raw(h.label)}
              </button>
            `;
          })}
        </div>

        <aside class="stack">
          <div class="shelf">
            <h4>Findings</h4>
            ${_state.findings.length === 0 ? html`
              <p style="color: var(--chalk-mute); font-style: italic; font-size: 14px;">No findings yet. Click the numbered hotspots.</p>
            ` : html`
              <ul>
                ${_state.findings.map(f => html`<li style="font-size: 14px; margin-bottom: 6px;">${raw(f)}</li>`)}
              </ul>
            `}
          </div>

          ${examined === total ? html`
            <button class="btn btn-large" id="to-accuse">Accuse a suspect →</button>
          ` : html`
            <p style="font-family: var(--font-evidence); color: var(--brass); font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; text-align: center;">${total - examined} hotspot${total-examined!==1?'s':''} remaining</p>
            <button class="btn btn-secondary" id="to-accuse-early">Skip to accusation</button>
          `}
        </aside>
      </div>
    </div>
  `;

  root.querySelectorAll('[data-hotspot]').forEach(btn => {
    btn.addEventListener('click', () => {
      const h = HOTSPOTS.find(x => x.id === btn.dataset.hotspot);
      openHotspot(root, h);
    });
  });

  root.querySelector('#to-accuse')?.addEventListener('click', () => {
    _state.beat = 'accuse';
    drawBeat(root);
  });
  root.querySelector('#to-accuse-early')?.addEventListener('click', () => {
    if (_state.examined.size < 4) {
      modal({
        heading: 'Insufficient examination',
        body: 'You have examined fewer than half the hotspots. A sound argument needs evidence. Continue investigating, or accuse anyway?',
        primary: 'Accuse anyway',
        onPrimary: () => { _state.beat = 'accuse'; drawBeat(root); },
        secondary: 'Keep investigating'
      });
    } else {
      _state.beat = 'accuse';
      drawBeat(root);
    }
  });
}

function openHotspot(root, h) {
  modal({
    heading: '',
    body: '',
    primary: null,
    dismissible: true
  });
  // Replace modal body with custom content
  const backdrop = document.querySelector('.modal-backdrop');
  if (!backdrop) return;
  const modalEl = backdrop.querySelector('.modal');
  modalEl.innerHTML = html`
    <div class="row" style="gap: var(--s-2); margin-bottom: var(--s-3);">
      <span class="pill pill-brass">Hotspot ${escape(h.label)}</span>
      <h3 style="font-style: italic; margin: 0;">${escape(h.title)}</h3>
      <button class="btn btn-ghost" id="hotspot-close" style="margin-left: auto; padding: 4px 12px; min-height: 0;">Close ✕</button>
    </div>

    <div class="parchment" style="font-size: var(--type-base); line-height: 1.6;">
      ${raw(h.summary)}
    </div>

    <div style="margin-top: var(--s-3); padding: var(--s-2); border-left: 3px solid var(--evidence); background: rgba(95, 124, 63, 0.08); border-radius: 4px;">
      <span style="font-family: var(--font-evidence); font-size: 12px; color: var(--evidence-soft); letter-spacing: 0.1em; text-transform: uppercase;">Casebook entry</span>
      <div style="font-style: italic; margin-top: 4px;">${raw(h.casebook)}</div>
    </div>

    <div class="row row-end" style="margin-top: var(--s-3);">
      <button class="btn" id="hotspot-noted">Note it →</button>
    </div>
  `;
  modalEl.querySelector('#hotspot-close').addEventListener('click', () => backdrop.remove());
  modalEl.querySelector('#hotspot-noted').addEventListener('click', () => {
    if (!_state.examined.has(h.id)) {
      _state.examined.add(h.id);
      _state.findings.push(h.casebook);
      Casebook.deposit({ act: 4, stamp: `Reform Club — Hotspot ${h.label}`, quote: h.casebook });
    }
    backdrop.remove();
    drawBeat(root);
  });
}

/* --- ACCUSE (pick suspect) -------------------------------------- */

function drawAccuse(root) {
  root.innerHTML = html`
    ${raw(topbar({ act: 4, name: 'The Final Deduction', progress: 'The accusation' }))}

    <div class="stage stack-wide">
      <header class="stack-tight">
        <h2 style="font-style: italic;">Whom do you accuse?</h2>
        <p style="color: var(--chalk-mute);">A deductive argument is only as good as its premises. Pick the suspect whose case the evidence actually supports.</p>
      </header>

      <div class="suspect-grid">
        ${SUSPECTS.map(s => html`
          <button class="suspect-card" data-suspect="${s.id}" data-selected="${_state.accusedSuspect === s.id ? 'true' : 'false'}">
            <div class="name">${escape(s.name)}</div>
            <div class="blurb">${escape(s.blurb)}</div>
            <p style="margin-top: var(--s-2); font-style: italic; font-size: 14px; color: var(--brass-soft);">${escape(s.note)}</p>
          </button>
        `)}
      </div>

      <div class="row row-spread">
        <button class="btn btn-secondary" id="back-to-scene">← Back to the room</button>
        <button class="btn btn-large" id="to-write" disabled>Write the argument →</button>
      </div>
    </div>
  `;

  root.querySelectorAll('[data-suspect]').forEach(btn => {
    btn.addEventListener('click', () => {
      _state.accusedSuspect = btn.dataset.suspect;
      root.querySelectorAll('[data-suspect]').forEach(b => b.dataset.selected = String(b.dataset.suspect === btn.dataset.suspect));
      root.querySelector('#to-write').disabled = false;
    });
  });
  root.querySelector('#back-to-scene').addEventListener('click', () => { _state.beat = 'scene'; drawBeat(root); });
  root.querySelector('#to-write').addEventListener('click', () => {
    if (_state.accusedSuspect) { _state.beat = 'write'; drawBeat(root); }
  });
}

/* --- WRITE (deductive argument) --------------------------------- */

function drawWrite(root) {
  const suspect = SUSPECTS.find(s => s.id === _state.accusedSuspect);

  root.innerHTML = html`
    ${raw(topbar({ act: 4, name: 'The Final Deduction', progress: `Accusing: ${suspect.name}` }))}

    <div class="stage stack-wide">
      <div class="parchment stack-tight" style="font-size: var(--type-base); line-height: 1.6;">
        ${raw(ACT4_WRITE_PROMPT)}
      </div>

      <div class="grid-2" style="grid-template-columns: 2fr 1fr; gap: var(--s-4); align-items: start;">
        <div class="stack">
          <h3 style="font-style: italic;">Your deductive argument</h3>
          <textarea class="arg-editor" id="argument-editor" maxlength="3000" style="min-height: 280px;"
            placeholder="P1: ...
P2: ...
P3: ...
P4: ...
∴ C: Therefore, ${escape(suspect.name)} is the murderer of Sir Arthur Pelham."
            aria-label="Argument editor"></textarea>

          <div class="row" style="gap: var(--s-2);">
            <button class="btn" id="submit-btn">Submit to Holmes</button>
            <button class="btn btn-secondary" id="back-to-accuse">← Change suspect</button>
            <button class="btn btn-ghost" id="back-to-scene-from-write">Re-examine room</button>
          </div>

          <div id="thinking" style="display: none;">
            <p class="thinking" style="color: var(--brass);">Holmes is reading...</p>
          </div>

          ${_state.attempts > 0 ? html`
            <p style="color: var(--warning); font-style: italic; font-size: 14px;">${raw(ACT4_FAIL_HINT)}</p>
          ` : ''}
        </div>

        <aside class="stack">
          <div class="shelf">
            <h4>Holmes will check</h4>
            <ul>
              <li><strong>Validity</strong> — if the premises are all true, does the conclusion follow with certainty?</li>
              <li><strong>Soundness</strong> — are the premises actually true given the evidence we\u0027ve gathered?</li>
            </ul>
            <p style="font-style: italic; margin-top: var(--s-2); font-size: 14px;">A valid argument with even ONE false premise is unsound. Both must hold.</p>
          </div>

          <div class="shelf">
            <h4>Findings ledger</h4>
            ${_state.findings.length === 0 ? html`
              <p style="color: var(--chalk-mute); font-style: italic;">No findings.</p>
            ` : html`
              <ul>
                ${_state.findings.map(f => html`<li style="font-size: 13px; margin-bottom: 6px;">${raw(f)}</li>`)}
              </ul>
            `}
          </div>

          <div class="shelf">
            <h4>From earlier acts</h4>
            <ul>
              <li>Telegram: <em>"He arrives the eight-fifteen. Be ready."</em> — Foreign Office code for an arriving informer.</li>
              <li>Mycroft: the Captain killed Naunihal Singh in Multan, 1893. Pelham was using this for blackmail.</li>
              <li>Mycroft: there is a Hari Singh, brother of Naunihal, who took the train from Liverpool that arrives Paddington at 8.15.</li>
              <li>The Captain\u0027s mental state: documented fugues since the Punjab fever.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  `;

  const editor = root.querySelector('#argument-editor');
  if (_state.studentArgument) editor.value = _state.studentArgument;
  editor.focus();

  root.querySelector('#submit-btn').addEventListener('click', () => onSubmit(root, suspect));
  root.querySelector('#back-to-accuse').addEventListener('click', () => { _state.beat = 'accuse'; drawBeat(root); });
  root.querySelector('#back-to-scene-from-write').addEventListener('click', () => { _state.beat = 'scene'; drawBeat(root); });
  editor.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') onSubmit(root, suspect);
  });
}

async function onSubmit(root, suspect) {
  if (_state.submitting) return;
  const editor = root.querySelector('#argument-editor');
  const text = editor.value.trim();
  if (text.length < 50) {
    toast('A deductive argument needs more substance.', 'warning');
    return;
  }

  _state.submitting = true;
  _state.studentArgument = text;
  _state.attempts++;
  root.querySelector('#submit-btn').disabled = true;
  root.querySelector('#thinking').style.display = '';

  const act1Evidence = (Casebook.get().acts[1]?.evidenceMarked || []);
  const result = await judge({
    stage: 'holmes-final',
    payload: { argument: text, suspect: suspect.name, evidence: act1Evidence }
  });

  _state.submitting = false;
  root.querySelector('#submit-btn').disabled = false;
  root.querySelector('#thinking').style.display = 'none';

  if (!result.ok) {
    toast(`Holmes is unreachable: ${result.error}`, 'warning');
    return;
  }
  if (result.data.error === 'parse_failed') {
    toast('Holmes\u0027s reply was unintelligible. Try sending again.', 'warning');
    return;
  }

  _state.finalEvaluation = result.data;
  _state.beat = 'result';
  drawBeat(root);
}

/* --- RESULT ----------------------------------------------------- */

function drawResult(root) {
  const e = _state.finalEvaluation;
  const verdict = e.verdict;     // 'case_closed' | 'case_remains_open' | 'case_misdirected'
  const isClosed = verdict === 'case_closed';

  const verdictPill =
    verdict === 'case_closed'      ? `<span class="pill pill-evidence">Case closed</span>` :
    verdict === 'case_misdirected' ? `<span class="pill pill-warning">Wrong man</span>` :
                                     `<span class="pill pill-warning">Case open</span>`;

  root.innerHTML = html`
    ${raw(topbar({ act: 4, name: 'The Final Deduction', progress: verdict.replace(/_/g, ' ') }))}

    <div class="stage stack-wide">

      <div class="row" style="gap: var(--s-2);">
        ${raw(verdictPill)}
        <span class="pill ${e.is_valid ? 'pill-evidence' : 'pill-warning'}">${e.is_valid ? 'Valid ✓' : 'Invalid ✗'}</span>
        <span class="pill ${e.is_sound ? 'pill-evidence' : 'pill-warning'}">${e.is_sound ? 'Sound ✓' : 'Unsound ✗'}</span>
      </div>

      ${raw(speech({
        who: 'Sherlock Holmes',
        role: 'holmes',
        initial: 'H',
        says: e.in_character || 'Holmes nods slowly and reads your argument again.'
      }))}

      <div class="grid-2" style="grid-template-columns: 1fr 1fr; gap: var(--s-3); align-items: stretch;">
        <div class="parchment">
          <h4 style="color: var(--oxblood); font-style: italic; margin-bottom: var(--s-2);">Validity</h4>
          <p>${escape(e.validity_analysis || 'No analysis returned.')}</p>
        </div>
        <div class="parchment">
          <h4 style="color: var(--oxblood); font-style: italic; margin-bottom: var(--s-2);">Soundness</h4>
          <p>${escape(e.soundness_analysis || 'No analysis returned.')}</p>
        </div>
      </div>

      ${isClosed && e.the_truth ? html`
        <div class="parchment" style="border-left: 4px solid var(--evidence);">
          <h3 style="color: var(--oxblood); font-style: italic; margin-bottom: var(--s-2);">The Truth of the Reform Club</h3>
          <p style="font-size: var(--type-md); line-height: 1.65;">${escape(e.the_truth)}</p>
        </div>
      ` : ''}

      <div class="row" style="justify-content: center; gap: var(--s-2); flex-wrap: wrap;">
        ${!isClosed && _state.attempts < 3 ? html`
          <button class="btn btn-secondary" id="retry">Try a different argument</button>
          <button class="btn btn-secondary" id="reaccuse">Accuse a different suspect</button>
        ` : ''}
        <button class="btn btn-large" id="close-act">${isClosed ? 'To the finale →' : 'Accept the verdict'}</button>
      </div>
    </div>
  `;

  Casebook.deposit({
    act: 4,
    stamp: `Holmes evaluates — ${verdict.replace(/_/g, ' ')}`,
    quote: `Argument: ${e.is_valid ? 'valid' : 'invalid'}, ${e.is_sound ? 'sound' : 'unsound'}. ${(e.in_character || '').slice(0, 100)}…`
  });

  root.querySelector('#retry')?.addEventListener('click', () => {
    _state.beat = 'write';
    drawBeat(root);
  });
  root.querySelector('#reaccuse')?.addEventListener('click', () => {
    _state.beat = 'accuse';
    drawBeat(root);
  });
  root.querySelector('#close-act').addEventListener('click', () => {
    Casebook.completeAct(4, {
      evidenceFound: Array.from(_state.examined),
      suspectAccused: _state.accusedSuspect,
      finalArgument: _state.studentArgument,
      epitaph: isClosed
        ? 'The locked room has yielded its secret. Captain Whitcombe will live.'
        : 'The case is unresolved. The student\'s argument did not bear weight.'
    });
    navigate('#/finale');
  });

  announce(`Holmes has evaluated. ${e.in_character?.slice(0, 80) || ''}`);
}
