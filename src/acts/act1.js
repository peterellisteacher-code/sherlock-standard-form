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

import { Casebook } from '../core/state.js?v=4';
import { html, raw, escape, toast } from '../core/components.js?v=4';
import { announce, navigate } from '../core/nav.js?v=4';

/* ===== Evidence definitions ===== */

const EVIDENCE = [
  {
    id: 'watch',
    title: "A gentleman's pocket-watch",
    sprite: '/assets/pixel/item-watch.png',
    x: 0.78, y: 0.74,
    examine: `Half-hunter case, gold. Open in your hand it shows the dial stopped at <strong>11:14</strong>. A single sharp crack runs diagonally across the glass; the chain is smeared with pale clay mud — suburban soil, not central London. Inside the case, three letters: <strong>J · T · W</strong>. The Captain's name is James — his sister might know the middle initial.`,
    relevant: "Stopped at 11:14 (body found at 11:30 — sixteen-minute gap). Clay mud on the chain suggests the watch was outdoors hours before the murder, but the Captain claims he was at the Club all evening. JTW monogram needs Mrs Whitcombe to confirm.",
    discardWhy: 'A scratched watch on its own proves little.'
  },
  {
    id: 'telegram',
    title: 'A folded telegram',
    sprite: '/assets/pixel/item-telegram.png',
    x: 0.88, y: 0.66,
    examine: `Yellow post-office paper, the wax seal broken once already. Inside, eight words: <em>"He arrives the eight-fifteen. Be ready."</em> Mrs Whitcombe says James received this an hour before the murder. She cannot account for it.`,
    relevant: "A telegram an hour before the killing: 'He arrives the eight-fifteen. Be ready.' Mrs Whitcombe cannot explain it. The phrasing is unusual for trade.",
    discardWhy: 'A telegram with no clear sender is hard to use.'
  },
  {
    id: 'rose',
    title: 'A pressed dried rose',
    sprite: '/assets/pixel/item-rose.png',
    x: 0.32, y: 0.50,
    examine: `Between two yellowed pages: a single rose, dark crimson fading to brown, withered but preserved with care. The pages it sits between are blank — kept only for the rose. Mrs Whitcombe will not say from whom.`,
    relevant: 'A pressed rose, kept with deliberate care between blank pages. Mrs Whitcombe declines to say from whom. Possibly significant; possibly purely personal.',
    discardWhy: 'A rose is sentimental, not evidential.'
  },
  {
    id: 'letters',
    title: 'Three letters tied with ribbon',
    sprite: '/assets/pixel/item-letters.png',
    x: 0.16, y: 0.62,
    examine: `Three letters from Sir Arthur Pelham to Captain Whitcombe, sent over the months preceding the murder. The third — sealed differently — opens with: <em>"James, my patience is at its end. If we cannot resolve our accounts in private, we shall do so very publicly indeed. I shall be at the Club Wednesday."</em>`,
    relevant: "Three letters from Pelham to the Captain. The third is explicitly threatening: 'we shall resolve our accounts … very publicly indeed.' Pelham held something over him.",
    discardWhy: 'Old correspondence between business partners.'
  },
  {
    id: 'medal',
    title: "The Captain's service medal",
    sprite: '/assets/pixel/item-medal.png',
    x: 0.42, y: 0.16,
    examine: `Bronze, octagonal, the Indian Service Medal — awarded for service in the colonial campaigns. The ribbon is faded crimson with two green stripes. Mrs Whitcombe says they would not let him wear it home from prison; she has kept it for him. The reverse is inscribed: <em>"For Multan, 1893."</em>`,
    relevant: "The Captain's service medal: 'For Multan, 1893.' Whatever happened at Multan, Pelham knew. Mrs Whitcombe confirms it was the leverage in their business dispute.",
    discardWhy: 'A medal is decoration, not evidence.'
  },
  {
    id: 'casefile',
    title: 'The leather case-file',
    sprite: '/assets/pixel/item-casefile.png',
    x: 0.62, y: 0.78,
    examine: `Mrs Whitcombe's portfolio. Inside: the inquest report, the Captain's public service record from Horse Guards, and — at the back, paper-clipped — a discharge note from the regimental surgeon at Aldershot. The note is brief: <em>"Capt. J. T. Whitcombe, 23rd Foot. Returned from Punjab with prolonged fever. Marked episodes of fugue and confessional disorientation. Recommend cautious return to civil life."</em>`,
    relevant: "The Captain's discharge note from Aldershot: 'Marked episodes of fugue and confessional disorientation.' His confession to the murder may not be a reliable record of fact.",
    discardWhy: 'Service records are public — Mycroft will have his own.'
  }
];

/* ===== Mrs Whitcombe dialogue ===== */

const WHITCOMBE_LINES = [
  `<em>"My name is Eleanor Whitcombe. My brother is Captain James Whitcombe of the 23rd Foot. Three days ago he was arrested at the Reform Club for the murder of his business partner, Sir Arthur Pelham. He has confessed. He is to be hanged on Saturday."</em>`,
  `<em>"I do not believe he did it. I have ridden the night train from Edinburgh to say so to the only man in England who might listen. Mr Holmes is — I see — not here. So I shall have to settle for you."</em>`,
  `<em>"I have brought everything I could find. His pocket-watch, the telegram he received that night, three letters from Sir Arthur, his service medal — and his discharge papers, which the army did not want printed. Examine what you will. I shall answer what I can."</em>`,
  `<em>"You may also ask me directly — click my portrait whenever you wish to speak. But first, look at what is on the desk and the mantel. The room is in the same state it was the night he was taken."</em>`
];

const WHITCOMBE_TOPICS = [
  { triggerEvidence: 'watch', line: `<em>"His middle name was Theodore — yes, the monogram is his. Father gave him the watch when he came of age. He wound it every morning without fail; if it stopped at 11:14, something stopped it. He would not have let the spring run down — not on the night of his arrest."</em>` },
  { triggerEvidence: 'telegram', line: `<em>"That telegram. It came an hour before the murder. He read it twice, asked for his coat, and went out. He has not, in three days, said one word about it. I suspect it is the heart of the matter."</em>` },
  { triggerEvidence: 'rose', line: `She looks at the rose for a long moment. <em>"That is not for you, sir. With respect. There are some things that belong only to a brother and a sister."</em>` },
  { triggerEvidence: 'letters', line: `<em>"Sir Arthur was, in life, not the gentleman his title suggested. He had been pressing James to sign over a larger share of the proceeds for over a year — and when James refused, Sir Arthur began to make threats. The third letter is the worst of them."</em>` },
  { triggerEvidence: 'medal', line: `<em>"What happened at Multan in '93 — I do not know. James has not spoken of it. But Sir Arthur knew. James once said, ‘The man knows what happened at Multan, and I cannot have him telling it.’ I do not know what he meant, only that it was the lever Sir Arthur had on him."</em>` },
  { triggerEvidence: 'casefile', line: `<em>"The Aldershot surgeon was kind enough to write that note. It has not been entered into the official record — were it, James's pension would be reduced and his name attached to a humiliation. I am told I should not even be in possession of it. But I am his sister. And his confession reads like one of his fugues."</em>` },
  { isClose: true, line: `<em>"I shall take a room at the Langham, sir. James has three days. Take to Mr Holmes whatever you think will hold a candle in his hand. The bell-pull is by the door if you require Mrs Hudson."</em>` }
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
        <p>Holmes is at the docks. He left a note. <em>"Investigating the matter of the Romanian shipping clerk. Back by Thursday morning. Do not eat my anchovies."</em></p>
        <p>You are at the desk, attempting Watson's memoir of the Reichenbach business. The fire is low. The fog has come up from the river and pressed itself against the parlour windows like a poorly-mannered acquaintance. The clock above the mantel reads thirteen minutes to midnight.</p>
        <p>Three knocks. Loud. Then a fourth, almost immediately, as though by someone who could not bear to wait between knocks.</p>
        <p>You open the door. A woman in deep mourning, soaked through, presses past you into the hallway. She speaks first, in the kind of voice that brooks no condolences.</p>
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
      <div style="display: grid; grid-template-columns: 1fr 360px; gap: var(--s-3); align-items: start; max-width: 1440px; margin: 0 auto;">

        <div style="position: relative;">
          <div id="parlour-phaser" style="width: 100%; max-width: 960px; aspect-ratio: 384 / 224; background: #0B0D14; border: 1px solid var(--brass); border-radius: var(--radius-md); overflow: hidden; image-rendering: pixelated;"></div>

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
            <p style="color: var(--chalk-mute); font-size: 13px; margin-bottom: var(--s-2); font-style: italic;">Submit to Holmes when you have <strong>four or more</strong> pieces of evidence marked.</p>
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
  let muted = false;
  root.querySelector('#mute-btn').addEventListener('click', () => {
    muted = !muted;
    audioEl.muted = muted;
    root.querySelector('#mute-btn').textContent = muted ? '🔇 Audio' : '🔊 Audio';
  });
  root.querySelector('#submit-evidence').addEventListener('click', () => closeAct1(root));

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
        this.tweens.add({ targets: portrait, y: 130, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
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

          // Pulsing ring underneath
          const ring = this.add.circle(x, y, 18, 0xB89968, 0.16);
          this.tweens.add({ targets: ring, alpha: 0.40, scale: 1.15, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

          const sprite = this.add.image(x, y, 'item-' + ev.id);
          sprite.setOrigin(0.5, 0.5);
          sprite.setScale(0.22);
          sprite.setInteractive({ useHandCursor: true });

          sprite._ring = ring;
          sprite._evId = ev.id;

          sprite.on('pointerover', () => {
            this.tweens.add({ targets: sprite, scale: 0.27, duration: 120 });
            sprite.setTint(0xfff8c8);
          });
          sprite.on('pointerout', () => {
            this.tweens.add({ targets: sprite, scale: 0.22, duration: 120 });
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
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.innerHTML = `
    <div class="modal stack" style="max-width: 720px;">
      <div class="row" style="gap: var(--s-3); align-items: flex-start;">
        <img src="${ev.sprite}" alt="${escape(ev.title)}" style="width: 96px; height: 96px; image-rendering: pixelated; border: 1px solid var(--brass); border-radius: var(--radius-sm); flex-shrink: 0;" />
        <div style="flex: 1;">
          <h2 style="font-style: italic; margin-bottom: var(--s-2);">${escape(ev.title)}</h2>
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
        <button class="btn" id="examine-mark">${alreadyMarked === 'relevant' ? 'Already marked ✓' : 'Mark for Holmes'}</button>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);

  _state.evidence[ev.id].examined = true;
  updateCounter();

  backdrop.querySelector('#examine-close').addEventListener('click', () => backdrop.remove());
  backdrop.querySelector('#examine-discard').addEventListener('click', () => {
    if (_state.evidence[ev.id].marked === 'discarded') return;
    _state.evidence[ev.id].marked = 'discarded';
    backdrop.remove();
    refreshCasebook(document.getElementById('app'));
    toast(`${ev.title} — set aside`, 'warning');
    sfxClick(120, 0.06);
  });
  backdrop.querySelector('#examine-mark').addEventListener('click', () => {
    if (_state.evidence[ev.id].marked === 'relevant') return;
    _state.evidence[ev.id].marked = 'relevant';
    backdrop.remove();
    refreshCasebook(document.getElementById('app'));
    toast(`${ev.title} — marked for Holmes`, 'evidence');
    sfxChime();
    Casebook.deposit({ act: 1, stamp: ev.title, quote: ev.relevant });
    if (_phaserGame) {
      const scene = _phaserGame.scene.scenes[0];
      const sprite = scene && scene.children.list.find(c => c._evId === ev.id);
      if (sprite) {
        scene.tweens.add({ targets: sprite, alpha: 0.55, duration: 250 });
        if (sprite._ring) sprite._ring.setAlpha(0);
      }
    }
  });

  const escHandler = (e) => {
    if (e.key === 'Escape') {
      backdrop.remove();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
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
  const ctx = audioCtx();
  if (!ctx) return;
  const notes = [392, 494, 587];
  notes.forEach((f, i) => {
    setTimeout(() => {
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
        <p>She gathers her gloves. <em>"I shall take a room at the Langham. James has three days. Take to Mr Holmes whatever you think will hold a candle in his hand."</em></p>
        <p>You have marked <strong>${marked.length}</strong> ${marked.length === 1 ? 'item' : 'items'} for the case:</p>
        <ul style="margin-left: var(--s-4); margin-top: var(--s-2);">
          ${marked.map(e => `<li style="margin-bottom: 6px;"><strong>${escape(e.title)}.</strong> ${e.relevant}</li>`).join('')}
        </ul>
        <p style="margin-top: var(--s-3); font-style: italic;">There is, as Holmes has it, exactly one person in London who can place these items in their proper political setting. He is at the Diogenes Club. He does not part with secrets cheaply.</p>
      </div>

      <div class="row" style="justify-content: center; gap: var(--s-2);">
        <a href="#/title" class="btn btn-secondary">Return to the index</a>
        <a href="#/act/2" class="btn btn-large">To Mycroft →</a>
      </div>
    </div>
  `;

  announce(`Act One closed. ${marked.length} pieces of evidence marked for Holmes.`);
}
