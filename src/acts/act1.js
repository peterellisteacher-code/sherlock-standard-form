/**
 * Act I — The Adventure of the Singular Visitor
 *
 * Rebuilt as a deduction-4e investigation (see /make-learning-game playbook).
 * Phaser 3 (CDN) scene + pixel-art sprites + ambient audio + DOM overlays.
 *
 * Flow:
 *   1. opening — atmospheric text card (no game yet)
 *   2. parlour — Phaser scene with 6 evidence items + Mrs Whitcombe dialogue
 *   3. outro — closing narrative; the marked evidence is in the Casebook for Acts II/III/IV
 */

import { Casebook } from '../core/state.js?v=7';
import { html, raw, escape, toast } from '../core/components.js?v=7';
import { announce, navigate } from '../core/nav.js?v=7';

/* ===== Evidence definitions =====
 *
 * Each item has a `theme` — the case-thread it touches. Themes guide the
 * student about WHAT to look for. The six themes map to the four "What to
 * look for" prompts shown in the side panel.
 */

const EVIDENCE = [
  {
    id: 'watch',
    title: "A gentleman's pocket-watch",
    theme: 'Time & whereabouts',
    sprite: '/assets/pixel/item-watch.png',
    x: 0.78, y: 0.74,
    examine: `Half-hunter, gold. Dial stopped at <span class="case-clue">11:14</span>. Glass cracked diagonally. The chain carries <span class="case-clue">pale clay mud</span> — suburban soil, not London. Inside the case, three letters: <span class="case-clue">J · T · W</span>.`,
    relevant: "Stopped at 11:14. Body found at 11:30 — a sixteen-minute gap. Mud on the chain puts the watch outside London earlier, against the Captain's claim he was at the Club all evening.",
    discardWhy: 'A scratched watch on its own proves little.'
  },
  {
    id: 'telegram',
    title: 'A folded telegram',
    theme: 'Identity of visitor',
    sprite: '/assets/pixel/item-telegram.png',
    x: 0.88, y: 0.66,
    examine: `Yellow post-office paper, seal already broken. Eight words: <em><span class="case-clue">"He arrives the eight-fifteen. Be ready."</span></em> James received it <span class="case-clue">an hour before the murder</span>. Mrs Whitcombe cannot account for it.`,
    relevant: "Hour before the killing: \"He arrives the eight-fifteen. Be ready.\" Phrasing is wrong for trade. Mrs Whitcombe cannot explain it.",
    discardWhy: 'A telegram with no clear sender is hard to use.'
  },
  {
    id: 'rose',
    title: 'A pressed dried rose',
    theme: 'Personal',
    sprite: '/assets/pixel/item-rose.png',
    x: 0.32, y: 0.50,
    examine: `Between two yellowed pages: a dark crimson rose, preserved with care. The pages are blank, kept only for the rose. Mrs Whitcombe will not say from whom.`,
    relevant: 'A pressed rose, kept with care. Mrs Whitcombe declines to say from whom. Possibly personal, possibly not.',
    discardWhy: 'A rose is sentimental, not evidential.'
  },
  {
    id: 'letters',
    title: 'Three letters tied with ribbon',
    theme: 'Motive (blackmail)',
    sprite: '/assets/pixel/item-letters.png',
    x: 0.16, y: 0.62,
    examine: `Three letters from Pelham to the Captain over recent months. The third, sealed differently: <em>"James, <span class="case-clue">my patience is at its end</span>. If we cannot resolve our accounts in private, we shall do so <span class="case-clue">very publicly indeed</span>. I shall be at the Club Wednesday."</em>`,
    relevant: "Three letters. The third threatens public exposure: \"resolve our accounts … very publicly.\" Pelham held something over the Captain.",
    discardWhy: 'Old correspondence between business partners.'
  },
  {
    id: 'medal',
    title: "The Captain's service medal",
    theme: 'What Pelham knew',
    sprite: '/assets/pixel/item-medal.png',
    x: 0.42, y: 0.16,
    examine: `Indian Service Medal, bronze octagon. Faded crimson ribbon. The prison would not let him wear it; his sister has kept it for him. The reverse is inscribed: <em><span class="case-clue">"For Multan, 1893."</span></em>`,
    relevant: "Inscribed \"For Multan, 1893.\" Whatever happened there, Pelham knew. His sister says it was the lever Pelham had on him.",
    discardWhy: 'A medal is decoration, not evidence.'
  },
  {
    id: 'casefile',
    title: 'The leather case-file',
    theme: 'State of mind',
    sprite: '/assets/pixel/item-casefile.png',
    x: 0.62, y: 0.78,
    examine: `Mrs Whitcombe's portfolio: inquest report, public service record, and at the back a discharge note from the Aldershot regimental surgeon: <em>"Capt. J. T. Whitcombe, 23rd Foot. Returned from Punjab with prolonged fever. <span class="case-clue">Marked episodes of fugue and confessional disorientation.</span>"</em>`,
    relevant: "Aldershot discharge: \"fugue and confessional disorientation.\" His confession may not be a reliable record of fact.",
    discardWhy: 'Service records are public — Mycroft will have his own.'
  }
];

/* ===== Case threads — shown as a "What to look for" card ===== */

const CASE_THREADS = [
  { name: 'Time & whereabouts', hint: 'When did things happen? Was the Captain where he claimed?' },
  { name: 'Motive', hint: 'Why might someone want Pelham dead? What was Pelham holding over the Captain?' },
  { name: 'Who else was here?', hint: 'Was the Captain alone? Who else might have come to the Club?' },
  { name: 'State of mind', hint: 'Can the confession be trusted as a record of what happened?' }
];

/* ===== Mrs Whitcombe dialogue ===== */

const WHITCOMBE_LINES = [
  `<em>"Eleanor Whitcombe. My brother is Captain James Whitcombe, 23rd Foot. Three days ago he was arrested at the Reform Club for the murder of Sir Arthur Pelham. He has confessed. He hangs on Saturday."</em>`,
  `<em>"I do not believe he did it. I have ridden the night train from Edinburgh to say so. Mr Holmes is not here. So I shall settle for you."</em>`,
  `<em>"I have brought what I could find. His watch, the telegram, three letters from Sir Arthur, his service medal, his discharge papers. Examine what you will. I shall answer what I can."</em>`,
  `<em>"Click my portrait when you wish to speak. First, look at the desk and the mantel. The room stands as it did the night he was taken."</em>`
];

const WHITCOMBE_TOPICS = [
  { triggerEvidence: 'watch', line: `<em>"Theodore — yes, the monogram is his. Father gave him the watch when he came of age. He wound it every morning. If it stopped at 11:14, something stopped it. He would not have let the spring run down."</em>` },
  { triggerEvidence: 'telegram', line: `<em>"An hour before the murder. He read it twice, took his coat, went out. He has not spoken of it since. I suspect it is the heart of the matter."</em>` },
  { triggerEvidence: 'rose', line: `She looks at the rose for a long moment. <em>"That is not for you, sir. With respect. There are some things that belong only to a brother and a sister."</em>` },
  { triggerEvidence: 'letters', line: `<em>"Sir Arthur was not the gentleman his title suggested. For a year he had pressed James to sign over a larger share. When James refused, the threats began. The third letter is the worst of them."</em>` },
  { triggerEvidence: 'medal', line: `<em>"What happened at Multan in '93 I do not know. James has not spoken of it. Sir Arthur knew. James once said, ‘The man knows what happened at Multan, and I cannot have him telling it.’ That was the lever Sir Arthur had on him."</em>` },
  { triggerEvidence: 'casefile', line: `<em>"The Aldershot surgeon was kind enough to write that note. It is not in the official record — were it, James would lose his pension. I should not even have it. But I am his sister. And his confession reads like one of his fugues."</em>` },
  { isClose: true, line: `<em>"I shall take a room at the Langham. James has three days. Take to Mr Holmes whatever you think will hold a candle. The bell-pull is by the door for Mrs Hudson."</em>` }
];

/* ===== State ===== */

let _phaserGame = null;
let _state = null;

function freshState() {
  return {
    beat: 'opening',
    evidence: Object.fromEntries(EVIDENCE.map(e => [e.id, { examined: false, marked: null }])),
    dialogueIdx: 0,
    talkedAfter: new Set()
  };
}

export function render(root, _params) {
  _state = freshState();
  drawBeat(root);
}

export function cleanup() {
  destroyPhaser();
  window.removeEventListener('act1:examine', onExamineEvent);
  window.removeEventListener('act1:talk-whitcombe', onTalkEvent);
}

function destroyPhaser() {
  if (_phaserGame) {
    try { _phaserGame.destroy(true); } catch {}
    _phaserGame = null;
  }
  document.querySelectorAll('audio[data-act1]').forEach(a => { a.pause(); a.src = ''; a.remove(); });
}

function drawBeat(root) {
  if (_state.beat === 'opening') return drawOpening(root);
  if (_state.beat === 'parlour') return drawParlour(root);
  if (_state.beat === 'outro')   return drawOutro(root);
}

/* --- BEAT 1: OPENING NARRATIVE ----------------------------------- */

function drawOpening(root) {
  destroyPhaser();
  root.innerHTML = `
    <div class="topbar">
      <div class="row" style="gap: var(--s-2);">
        <a href="#/title" class="btn btn-ghost" style="padding: 8px 16px; min-height: 0;">← Index</a>
        <span class="topbar-title">The Adventure of the Singular Visitor</span>
      </div>
      <span class="topbar-meta">Act I</span>
    </div>

    <div class="stage stage-narrow stack-wide">
      <header class="stack-tight">
        <p style="font-family: var(--font-evidence); color: var(--brass); letter-spacing: 0.2em; text-transform: uppercase; font-size: 13px;">
          221 B Baker Street — Wednesday, 11.42 pm.
        </p>
      </header>

      <div class="parchment stack-tight" style="font-size: var(--type-md); line-height: 1.6;">
        <p>Holmes is at the docks. He left a note: <em>"Investigating the Romanian shipping clerk. Back Thursday. Do not eat my anchovies."</em></p>
        <p>You are at the desk over Watson's memoir of Reichenbach. The fire is low. Fog presses at the windows. The clock reads thirteen minutes to midnight.</p>
        <p>Three knocks. Loud. Then a fourth, hard on the third.</p>
        <p>You open the door. A woman in deep mourning presses past you into the hallway, soaked through, and speaks first.</p>
        <p><em>"My brother is to be hanged on Saturday. I do not believe he did it. I have brought everything I could find. May we begin?"</em></p>
      </div>

      <div class="row" style="justify-content: center;">
        <button class="btn btn-large" id="enter-parlour">Show her into the parlour →</button>
      </div>
    </div>
  `;
  root.querySelector('#enter-parlour').addEventListener('click', () => {
    _state.beat = 'parlour';
    drawBeat(root);
  });
  announce('Act One opens. Mrs Whitcombe arrives at 221B Baker Street.');
}

/* --- BEAT 2: PARLOUR (Phaser + DOM overlays) -------------------- */

function drawParlour(root) {
  root.innerHTML = `
    <div class="topbar">
      <div class="row" style="gap: var(--s-2);">
        <a href="#/title" class="btn btn-ghost" style="padding: 8px 16px; min-height: 0;">← Index</a>
        <span class="topbar-title">The Adventure of the Singular Visitor</span>
      </div>
      <div class="row" style="gap: var(--s-2);">
        <span class="topbar-meta" id="evidence-counter">0 / 6 examined</span>
        <button class="btn btn-ghost" id="mute-btn" aria-label="Toggle audio" style="padding: 6px 14px; min-height: 0; font-size: 13px;">🔊 Audio</button>
      </div>
    </div>

    <div id="parlour-stage" style="position: relative; width: 100%; padding: var(--s-3);">
      <div class="parlour-grid">

        <div style="position: relative; min-width: 0;">
          <div id="parlour-phaser" style="width: 100%; max-width: 960px; aspect-ratio: 384 / 224; background: #0B0D14; border: 1px solid var(--brass); border-radius: var(--radius-md); overflow: hidden; image-rendering: pixelated; margin: 0 auto;"></div>

          <div id="speech-overlay" style="position: relative; margin-top: var(--s-2); background: rgba(20, 23, 31, 0.95); border: 1px solid var(--brass); border-radius: var(--radius-md); padding: var(--s-3); display: none; gap: var(--s-3); align-items: flex-start; box-shadow: var(--shadow-card);">
            <img id="speech-portrait" src="/assets/pixel/whitcombe-portrait.png" alt="Mrs Eleanor Whitcombe" style="width: 80px; height: 107px; image-rendering: pixelated; border: 1px solid var(--brass); border-radius: var(--radius-sm); flex-shrink: 0;" />
            <div style="flex: 1;">
              <div style="font-family: var(--font-display); font-style: italic; color: var(--brass-soft); font-size: var(--type-md); margin-bottom: 4px;">Mrs Eleanor Whitcombe</div>
              <div id="speech-text" style="color: var(--chalk); line-height: 1.55;"></div>
              <div class="row" style="justify-content: flex-end; margin-top: var(--s-2); gap: var(--s-1);">
                <button class="btn btn-secondary" id="speech-next" style="padding: 6px 14px; min-height: 0; font-size: 14px;">Continue →</button>
              </div>
            </div>
          </div>
        </div>

        <aside class="stack" id="casebook-side">
          <!-- "What to look for" — orients students before they start clicking. -->
          <div class="case-themes">
            <h4>What to look for</h4>
            <ul>
              ${CASE_THREADS.map(t => `<li><strong>${escape(t.name)}.</strong> ${escape(t.hint)}</li>`).join('')}
            </ul>
          </div>

          <!-- Keyboard-accessible evidence list (parallel to the Phaser sprite hotspots).
               Real <button>s so Tab reaches every evidence item without needing the mouse. -->
          <div class="panel">
            <h4 style="font-style: italic; color: var(--brass-soft); margin-bottom: var(--s-2);">Evidence in the parlour</h4>
            <p style="color: var(--chalk-mute); font-size: 13px; margin-bottom: var(--s-2); font-style: italic;">Click any glowing item in the scene, or pick from this list.</p>
            <ul id="evidence-keyboard-list" role="list" style="list-style: none; padding: 0; margin: 0;">
              ${EVIDENCE.map(e => `
                <li style="margin-bottom: 8px;">
                  <button class="btn btn-secondary evidence-row-btn" data-evidence="${e.id}" style="width: 100%; text-align: left; justify-content: flex-start; padding: 8px 12px; min-height: 0; font-size: 14px; gap: 8px; flex-wrap: wrap;">
                    <img src="${e.sprite}" alt="" aria-hidden="true" style="width: 24px; height: 24px; image-rendering: pixelated; flex-shrink: 0;" />
                    <span style="flex: 1;">${escape(e.title)}</span>
                    <span class="evidence-status" data-status-for="${e.id}" style="font-size: 11px; color: var(--chalk-mute); font-family: var(--font-evidence); letter-spacing: 0.08em;">unexamined</span>
                    <span class="theme-tag" style="flex-basis: 100%; margin-left: 32px;">${escape(e.theme)}</span>
                  </button>
                </li>
              `).join('')}
            </ul>
            <button class="btn btn-ghost" id="talk-whitcombe-btn" style="width: 100%; margin-top: var(--s-2); padding: 8px 12px; min-height: 0; font-size: 13px;">
              💬 Speak with Mrs Whitcombe
            </button>
          </div>

          <div class="panel">
            <h4 style="font-style: italic; color: var(--brass-soft); margin-bottom: var(--s-2);">Casebook — marked for Holmes</h4>
            <div id="casebook-relevant" style="font-size: 14px;">
              <p style="color: var(--chalk-mute); font-style: italic;">No evidence marked yet.</p>
            </div>
          </div>

          <div class="panel">
            <h4 style="font-style: italic; color: var(--brass-soft); margin-bottom: var(--s-2);">Set aside</h4>
            <div id="casebook-discarded" style="font-size: 13px; color: var(--chalk-mute);">
              <p style="font-style: italic;">Items you have decided are not for Holmes.</p>
            </div>
          </div>

          <div class="panel" style="text-align: center;">
            <p style="color: var(--chalk-mute); font-size: 13px; margin-bottom: var(--s-1); font-style: italic;">Mark <strong>four or more</strong> pieces of evidence to submit.</p>
            <p style="color: var(--chalk-mute); font-size: 12px; margin-bottom: var(--s-2); font-style: italic;">Click any set-aside item to reconsider it.</p>
            <button class="btn btn-large" id="submit-evidence" disabled>Submit to Holmes →</button>
          </div>
        </aside>
      </div>

      <p style="margin-top: var(--s-3); color: var(--chalk-mute); font-size: 14px; text-align: center; font-style: italic;">
        Click any glowing item to examine it. Click Mrs Whitcombe's portrait at any time to talk.
      </p>
    </div>
  `;

  // Audio
  const audioEl = document.createElement('audio');
  audioEl.src = '/assets/audio/ambient.wav';
  audioEl.loop = true;
  audioEl.volume = 0.35;
  audioEl.dataset.act1 = 'true';
  audioEl.preload = 'auto';
  document.body.appendChild(audioEl);
  // Shared mute flag — used by both the ambient music AND the Web Audio synth SFX
  // (sfxClick/sfxChime check window._act1Muted before producing tone).
  window._act1Muted = false;
  root.querySelector('#mute-btn').addEventListener('click', () => {
    window._act1Muted = !window._act1Muted;
    audioEl.muted = window._act1Muted;
    root.querySelector('#mute-btn').textContent = window._act1Muted ? '🔇 Audio' : '🔊 Audio';
  });
  root.querySelector('#submit-evidence').addEventListener('click', () => closeAct1(root));

  // Keyboard-accessible evidence list — every row dispatches the same examine event the Phaser sprites do
  root.querySelectorAll('.evidence-row-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.evidence;
      window.dispatchEvent(new CustomEvent('act1:examine', { detail: { id } }));
    });
  });
  root.querySelector('#talk-whitcombe-btn').addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('act1:talk-whitcombe'));
  });

  // Set up event listeners (idempotent)
  window.removeEventListener('act1:examine', onExamineEvent);
  window.removeEventListener('act1:talk-whitcombe', onTalkEvent);
  window.addEventListener('act1:examine', onExamineEvent);
  window.addEventListener('act1:talk-whitcombe', onTalkEvent);

  bootPhaserParlour(audioEl);

  // First Mrs Whitcombe line
  showSpeech(WHITCOMBE_LINES[0], () => advanceWhitcombe());
  refreshCasebook(root);
  announce('You are in the parlour at 221B. Click any glowing item to examine it; click Mrs Whitcombe to talk.');
}

function bootPhaserParlour(audioEl) {
  if (!window.Phaser) {
    console.error('Phaser CDN not loaded — abort parlour scene.');
    return;
  }
  const w = 384, h = 224;

  // prefers-reduced-motion gates ALL looped/decorative tweens. Static feedback
  // (tint on hover, etc.) still happens — but the parlour does not pulse,
  // scale-on-hover-tween, or bob. Required by accessible-web-composition Tier 3.
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  _phaserGame = new Phaser.Game({
    type: Phaser.AUTO,
    width: w, height: h,
    parent: 'parlour-phaser',
    pixelArt: true,
    backgroundColor: '#0B0D14',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: {
      preload() {
        this.load.image('parlour-bg', '/assets/pixel/parlour-bg.png');
        for (const e of EVIDENCE) this.load.image('item-' + e.id, e.sprite);
        this.load.image('whitcombe-portrait', '/assets/pixel/whitcombe-portrait.png');
      },
      create() {
        this.add.image(0, 0, 'parlour-bg').setOrigin(0, 0);

        // Mrs Whitcombe sprite — small, lower-left of the room
        const portrait = this.add.image(38, 132, 'whitcombe-portrait');
        portrait.setOrigin(0.5, 1);
        portrait.setScale(0.38);
        portrait.setInteractive({ useHandCursor: true });
        if (!reducedMotion) {
          this.tweens.add({ targets: portrait, y: 130, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        }
        portrait.on('pointerover', () => portrait.setTint(0xfff3d0));
        portrait.on('pointerout',  () => portrait.clearTint());
        portrait.on('pointerdown', () => window.dispatchEvent(new CustomEvent('act1:talk-whitcombe')));

        // A name plate label above her
        this.add.text(38, 88, 'Mrs Whitcombe', {
          fontFamily: 'monospace', fontSize: '8px', color: '#E0C99B', backgroundColor: 'rgba(0,0,0,0.6)', padding: { x: 3, y: 1 }
        }).setOrigin(0.5, 0.5);

        // Evidence sprites
        for (const ev of EVIDENCE) {
          const x = ev.x * w;
          const y = ev.y * h;

          // Pulsing ring underneath — STATIC if reduced-motion
          const ring = this.add.circle(x, y, 18, 0xB89968, reducedMotion ? 0.32 : 0.16);
          if (!reducedMotion) {
            this.tweens.add({ targets: ring, alpha: 0.40, scale: 1.15, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
          }

          const sprite = this.add.image(x, y, 'item-' + ev.id);
          sprite.setOrigin(0.5, 0.5);
          sprite.setScale(0.22);
          sprite.setInteractive({ useHandCursor: true });

          sprite._ring = ring;
          sprite._evId = ev.id;

          sprite.on('pointerover', () => {
            if (reducedMotion) {
              sprite.setScale(0.27);
            } else {
              this.tweens.add({ targets: sprite, scale: 0.27, duration: 120 });
            }
            sprite.setTint(0xfff8c8);
          });
          sprite.on('pointerout', () => {
            if (reducedMotion) {
              sprite.setScale(0.22);
            } else {
              this.tweens.add({ targets: sprite, scale: 0.22, duration: 120 });
            }
            sprite.clearTint();
          });
          sprite.on('pointerdown', () => window.dispatchEvent(new CustomEvent('act1:examine', { detail: { id: ev.id } })));

          if (_state.evidence[ev.id].marked) {
            sprite.setAlpha(0.55);
            ring.setAlpha(0);
          }
        }

        // Try to play audio on first interaction (browser autoplay policy)
        this.input.once('pointerdown', () => {
          if (window._act1Muted) return;
          try { audioEl.play().catch(() => {}); } catch {}
        });
      }
    }
  });
}

function onExamineEvent(e) {
  const id = e.detail && e.detail.id;
  const ev = EVIDENCE.find(x => x.id === id);
  if (ev) examineItem(ev);
}

function onTalkEvent() {
  advanceWhitcombe();
}

/* --- Mrs Whitcombe dialogue progression -------------------------- */

function advanceWhitcombe() {
  if (_state.dialogueIdx < WHITCOMBE_LINES.length - 1) {
    _state.dialogueIdx++;
    showSpeech(WHITCOMBE_LINES[_state.dialogueIdx], () => advanceWhitcombe());
    return;
  }
  const candidates = WHITCOMBE_TOPICS.filter(t => t.triggerEvidence
    && _state.evidence[t.triggerEvidence].examined
    && !_state.talkedAfter.has(t.triggerEvidence));
  if (candidates.length) {
    const pick = candidates[0];
    _state.talkedAfter.add(pick.triggerEvidence);
    showSpeech(pick.line, () => advanceWhitcombe());
    return;
  }
  const close = WHITCOMBE_TOPICS.find(t => t.isClose);
  showSpeech(close.line, () => hideSpeech());
}

function showSpeech(text, onNext) {
  const overlay = document.getElementById('speech-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.getElementById('speech-text').innerHTML = text;
  const btn = document.getElementById('speech-next');
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  newBtn.addEventListener('click', () => { if (onNext) onNext(); });
}

function hideSpeech() {
  const overlay = document.getElementById('speech-overlay');
  if (overlay) overlay.style.display = 'none';
}

/* --- Examine modal --------------------------------------------- */

function examineItem(ev) {
  const alreadyMarked = _state.evidence[ev.id].marked;
  // Remember who opened the modal so we can restore focus on close (a11y).
  const opener = document.activeElement;

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-labelledby', 'examine-heading');
  backdrop.innerHTML = `
    <div class="modal stack" style="max-width: 720px;">
      <div class="row" style="gap: var(--s-3); align-items: flex-start;">
        <img src="${ev.sprite}" alt="${escape(ev.title)}" style="width: 96px; height: 96px; image-rendering: pixelated; border: 1px solid var(--brass); border-radius: var(--radius-sm); flex-shrink: 0;" />
        <div style="flex: 1;">
          <h2 id="examine-heading" style="font-style: italic; margin-bottom: var(--s-2);">${escape(ev.title)}</h2>
          <p style="line-height: 1.6;">${ev.examine}</p>
        </div>
      </div>

      ${alreadyMarked === 'relevant' ? `
        <div class="feedback correct"><h4>Marked for Holmes</h4><p>${ev.relevant}</p></div>
      ` : alreadyMarked === 'discarded' ? `
        <div class="feedback partial"><h4>Set aside</h4><p>${ev.discardWhy}</p></div>
      ` : ''}

      <div class="row row-end" style="gap: var(--s-2); flex-wrap: wrap;">
        <button class="btn btn-ghost" id="examine-close">Set down</button>
        <button class="btn btn-secondary" id="examine-discard">${alreadyMarked === 'discarded' ? 'Already set aside' : 'Set aside'}</button>
        <button class="btn" id="examine-mark" autofocus>${alreadyMarked === 'relevant' ? 'Already marked ✓' : 'Mark for Holmes'}</button>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);
  document.body.classList.add('modal-open');

  _state.evidence[ev.id].examined = true;
  updateCounter();
  refreshCasebook(document.getElementById('app'));

  // Focus trap: Tab cycles within the modal until close.
  const focusables = backdrop.querySelectorAll('button:not([disabled])');
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const trap = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  backdrop.addEventListener('keydown', trap);

  // Move focus into the modal — autofocus may not always fire after innerHTML assignment
  setTimeout(() => backdrop.querySelector('#examine-mark')?.focus(), 30);

  const closeModal = () => {
    backdrop.removeEventListener('keydown', trap);
    document.removeEventListener('keydown', escHandler);
    backdrop.remove();
    if (!document.querySelector('.modal-backdrop')) document.body.classList.remove('modal-open');
    // Restore focus to the element that opened the modal. The opener is sometimes <body> (Phaser
    // sprite clicks don't focus a DOM element) — fall back to the matching evidence row button.
    const target = (opener && opener !== document.body && document.body.contains(opener) && typeof opener.focus === 'function')
      ? opener
      : document.querySelector(`.evidence-row-btn[data-evidence="${ev.id}"]`);
    setTimeout(() => target?.focus(), 0);
  };

  backdrop.querySelector('#examine-close').addEventListener('click', closeModal);
  backdrop.querySelector('#examine-discard').addEventListener('click', () => {
    if (_state.evidence[ev.id].marked === 'discarded') { closeModal(); return; }
    _state.evidence[ev.id].marked = 'discarded';
    closeModal();
    refreshCasebook(document.getElementById('app'));
    toast(`${ev.title} — set aside`, 'warning');
    sfxClick(120, 0.06);
    window.dispatchEvent(new CustomEvent('act1:clue-elicited', { detail: { id: ev.id, action: 'discarded' } }));
  });
  backdrop.querySelector('#examine-mark').addEventListener('click', () => {
    if (_state.evidence[ev.id].marked === 'relevant') { closeModal(); return; }
    _state.evidence[ev.id].marked = 'relevant';
    closeModal();
    refreshCasebook(document.getElementById('app'));
    toast(`${ev.title} — marked for Holmes`, 'evidence');
    sfxChime();
    Casebook.deposit({ act: 1, stamp: ev.title, quote: ev.relevant });
    window.dispatchEvent(new CustomEvent('act1:relevance-marked', { detail: { id: ev.id } }));
    if (_phaserGame) {
      const scene = _phaserGame.scene.scenes[0];
      const sprite = scene && scene.children.list.find(c => c._evId === ev.id);
      if (sprite) {
        scene.tweens.add({ targets: sprite, alpha: 0.55, duration: 250 });
        if (sprite._ring) sprite._ring.setAlpha(0);
      }
    }
  });

  // Also close on backdrop click (outside the modal box)
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  const escHandler = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', escHandler);

  // Playbook feedback event for analytics / future extension
  window.dispatchEvent(new CustomEvent('act1:evidence-found', { detail: { id: ev.id } }));
}

/* --- Casebook side panel update --------------------------------- */

function refreshCasebook(root) {
  if (!root) return;
  const relevant = EVIDENCE.filter(e => _state.evidence[e.id].marked === 'relevant');
  const discarded = EVIDENCE.filter(e => _state.evidence[e.id].marked === 'discarded');

  const rEl = root.querySelector('#casebook-relevant');
  const dEl = root.querySelector('#casebook-discarded');
  if (rEl) {
    rEl.innerHTML = relevant.length
      ? relevant.map(e => `
          <div style="padding: 8px 0; border-bottom: 1px solid rgba(184, 153, 104, 0.15); display: flex; gap: 8px; align-items: flex-start;">
            <img src="${e.sprite}" alt="" style="width: 36px; height: 36px; image-rendering: pixelated; border-radius: 3px; flex-shrink: 0;" />
            <div style="flex: 1;">
              <div style="font-style: italic; color: var(--brass-soft); font-size: 13px;">${escape(e.title)}</div>
              <div style="font-size: 13px; color: var(--chalk); line-height: 1.4; margin-top: 2px;">${e.relevant.slice(0, 100)}${e.relevant.length > 100 ? '…' : ''}</div>
            </div>
          </div>
        `).join('')
      : '<p style="color: var(--chalk-mute); font-style: italic;">No evidence marked yet.</p>';
  }
  if (dEl) {
    dEl.innerHTML = discarded.length
      ? discarded.map(e => `<div style="padding: 4px 0; font-size: 12px;">${escape(e.title)}</div>`).join('')
      : '<p style="font-style: italic;">Items you have decided are not for Holmes.</p>';
  }

  const submit = root.querySelector('#submit-evidence');
  if (submit) {
    submit.disabled = relevant.length < 4;
    submit.textContent = relevant.length < 4
      ? `Submit to Holmes (${relevant.length} / 4 marked)`
      : `Submit ${relevant.length} pieces to Holmes →`;
  }

  // Update the keyboard-accessible evidence list's status spans
  for (const ev of EVIDENCE) {
    const state = _state.evidence[ev.id];
    const span = root.querySelector(`.evidence-status[data-status-for="${ev.id}"]`);
    if (!span) continue;
    let label = 'unexamined', color = 'var(--chalk-mute)';
    if (state.marked === 'relevant') { label = '✓ marked'; color = 'var(--evidence-soft)'; }
    else if (state.marked === 'discarded') { label = 'set aside'; color = '#E89E5C'; }
    else if (state.examined) { label = 'examined'; color = 'var(--brass-soft)'; }
    span.textContent = label;
    span.style.color = color;
  }

  updateCounter();
}

function updateCounter() {
  const examined = Object.values(_state.evidence).filter(e => e.examined).length;
  const el = document.getElementById('evidence-counter');
  if (el) el.textContent = `${examined} / 6 examined`;
}

/* --- Web Audio SFX --------------------------------------------- */

let _ac = null;
function audioCtx() {
  if (!_ac) {
    try { _ac = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
  }
  return _ac;
}

function sfxClick(freq = 800, duration = 0.05) {
  if (window._act1Muted) return;
  const ctx = audioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function sfxChime() {
  if (window._act1Muted) return;
  const ctx = audioCtx();
  if (!ctx) return;
  const notes = [392, 494, 587];
  notes.forEach((f, i) => {
    setTimeout(() => {
      if (window._act1Muted) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }, i * 90);
  });
}

/* --- BEAT 3: OUTRO ---------------------------------------------- */

function closeAct1(root) {
  const marked = EVIDENCE.filter(e => _state.evidence[e.id].marked === 'relevant');
  const markedSnapshot = marked.map(e => ({ id: e.id, title: e.title, relevant: e.relevant }));

  Casebook.updateAct(1, { evidenceMarked: markedSnapshot, evidenceCount: marked.length });
  Casebook.completeAct(1, {
    score: marked.length,
    total: EVIDENCE.length,
    epitaph: `${marked.length} pieces of evidence submitted. The Diogenes Club next.`
  });

  destroyPhaser();
  _state.beat = 'outro';

  root.innerHTML = `
    <div class="topbar">
      <div class="row" style="gap: var(--s-2);">
        <a href="#/title" class="btn btn-ghost" style="padding: 8px 16px; min-height: 0;">← Index</a>
        <span class="topbar-title">The Adventure of the Singular Visitor</span>
      </div>
      <span class="topbar-meta">Act I — Closed</span>
    </div>

    <div class="stage stage-narrow stack-wide" style="text-align: center;">
      <p style="font-family: var(--font-evidence); color: var(--brass); letter-spacing: 0.2em; text-transform: uppercase; font-size: 13px;">Mrs Whitcombe rises to leave.</p>
      <h1 style="font-style: italic;">The case is in your hands.</h1>

      <div class="parchment stack-tight" style="text-align: left;">
        <p>She gathers her gloves. <em>"I shall take a room at the Langham. James has three days. Take to Mr Holmes whatever you think will hold a candle."</em></p>
        <p>You have marked <strong>${marked.length}</strong> ${marked.length === 1 ? 'item' : 'items'} for the case:</p>
        <ul style="margin-left: var(--s-4); margin-top: var(--s-2);">
          ${marked.map(e => `<li style="margin-bottom: 6px;"><strong>${escape(e.title)}.</strong> ${e.relevant}</li>`).join('')}
        </ul>
        <p style="margin-top: var(--s-3); font-style: italic;">One man in London can place these items in their political setting. He is at the Diogenes Club. He does not part with secrets cheaply.</p>
      </div>

      <div class="row" style="justify-content: center; gap: var(--s-2);">
        <a href="#/title" class="btn btn-secondary">Return to the index</a>
        <a href="#/act/2" class="btn btn-large">To Mycroft →</a>
      </div>
    </div>
  `;

  announce(`Act One closed. ${marked.length} pieces of evidence marked for Holmes.`);
}
