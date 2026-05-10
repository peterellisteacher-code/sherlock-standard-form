/**
 * Finale — the closing reveal after all four acts are complete.
 * Replays the case, summarises the philosophical work, prints a casebook digest.
 */

import { Casebook } from './core/state.js';
import { html, raw, escape, topbar } from './core/components.js';
import { announce } from './core/nav.js';

export function render(root, _params) {
  const s = Casebook.get();
  const detective = s.detectiveName || 'Detective';
  const allDone = Casebook.allComplete();
  const act4Sound = s.acts[4]?.suspectAccused === 'hari';   // crude but the most informative signal

  if (!allDone) {
    root.innerHTML = html`
      ${raw(topbar({ act: 0, name: 'Finale', progress: 'Locked' }))}
      <div class="stage stage-narrow stack" style="text-align: center;">
        <h1 style="font-style: italic;">The finale is locked.</h1>
        <p style="color: var(--chalk-mute); font-size: var(--type-md);">
          One or more acts remain unfinished. Return to the index and complete the case.
        </p>
        <a href="#/title" class="btn btn-large">To the index →</a>
      </div>
    `;
    return;
  }

  // Compose timeline of casebook entries grouped by act
  const byAct = { 1: [], 2: [], 3: [], 4: [] };
  for (const e of s.casebook) {
    if (byAct[e.act]) byAct[e.act].push(e);
  }

  root.innerHTML = html`
    ${raw(topbar({ act: 0, name: 'Finale', progress: 'The case is closed' }))}

    <div class="stage stack-wide">
      <header style="text-align: center;">
        <p style="font-family: var(--font-evidence); color: var(--brass); letter-spacing: 0.3em; text-transform: uppercase; font-size: 13px;">
          The Adventure of the Singular Visitor &nbsp; · &nbsp; A Casebook of Standard Form
        </p>
        <h1 class="title-main" style="font-size: var(--type-2xl); margin-block: var(--s-3);">Closed.</h1>
        <p style="font-style: italic; color: var(--brass-soft); font-size: var(--type-md);">
          With thanks to ${escape(detective)}, of two-twenty-one B Baker Street.
        </p>
      </header>

      <div class="parchment stack-tight" style="font-size: var(--type-md); line-height: 1.65;">
        <p>It is Friday morning. The fog has lifted. Mrs Whitcombe is at the Langham, packing
        a suitcase she will not need; her brother will be released by noon, the charge of
        wilful murder withdrawn under the joint affidavit of Sherlock Holmes and an
        unnamed officer of the Political Department. The press will be told nothing.</p>

        ${act4Sound ? html`
          <p>Hari Singh has not been found. He will not be. He has, by Mycroft&apos;s reluctant
          admission, the protection of a small but well-placed circle in Lahore who consider
          his act on Wednesday night the just consequence of an injustice committed by the
          British state in 1893. Holmes is not satisfied with this resolution but accepts it
          as the practical limit of his office. <em>"We have saved an innocent life, Watson.
          We have not saved a guilty one. The two are different victories — one is achievable
          tonight; the other is the work of slower, larger institutions than ours."</em></p>
        ` : html`
          <p>The truth of the Reform Club is — for the moment — out of reach. Captain Whitcombe&apos;s
          life has been spared by Mycroft&apos;s direct intervention with the Home Secretary, but
          the sentence has been commuted rather than overturned. Holmes regards your argument
          as an honest piece of work that did not quite carry its conclusion. He looks forward,
          sardonically, to the next case in which you will do better.</p>
        `}

        <p>The four acts are closed. The Captain will live. The unjust dead remain unjust dead.
        And you have learnt — perhaps without noticing — what philosophers and detectives have
        always shared: that an argument is a thing made of premises and a conclusion, and that
        you can tell a great deal about both by looking at the joins.</p>
      </div>

      <h2 style="font-style: italic; text-align: center; margin-top: var(--s-5);">The Casebook</h2>

      <div class="grid-2" style="grid-template-columns: 1fr 1fr; gap: var(--s-3); align-items: start;">
        ${[1, 2, 3, 4].map(n => html`
          <div class="panel">
            <p style="font-family: var(--font-evidence); color: var(--brass); letter-spacing: 0.15em; text-transform: uppercase; font-size: 13px; margin-bottom: var(--s-2);">
              Act ${rom(n)} &middot; ${escape(actName(n))}
            </p>
            ${byAct[n].length === 0 ? html`
              <p style="color: var(--chalk-mute); font-style: italic;">(No entries.)</p>
            ` : html`
              <div class="stack-tight">
                ${byAct[n].map(e => html`
                  <div style="padding: 8px 0; border-bottom: 1px solid rgba(184, 153, 104, 0.15);">
                    <div style="font-family: var(--font-evidence); font-size: 12px; color: var(--brass); letter-spacing: 0.1em; text-transform: uppercase;">${escape(e.stamp || '')}</div>
                    <div style="margin-top: 4px; font-style: italic; line-height: 1.45;">${raw(e.quote || '')}</div>
                  </div>
                `)}
              </div>
            `}
          </div>
        `)}
      </div>

      ${s.acts[3]?.finalArgument ? html`
        <div class="parchment" style="margin-top: var(--s-4);">
          <h3 style="color: var(--oxblood); font-style: italic; margin-bottom: var(--s-2);">Your free-will argument (Act III)</h3>
          <pre style="font-family: var(--font-evidence); white-space: pre-wrap; line-height: 1.55; font-size: 15px;">${escape(s.acts[3].finalArgument)}</pre>
        </div>
      ` : ''}

      ${s.acts[4]?.finalArgument ? html`
        <div class="parchment" style="margin-top: var(--s-3);">
          <h3 style="color: var(--oxblood); font-style: italic; margin-bottom: var(--s-2);">Your final deduction (Act IV)</h3>
          <pre style="font-family: var(--font-evidence); white-space: pre-wrap; line-height: 1.55; font-size: 15px;">${escape(s.acts[4].finalArgument)}</pre>
        </div>
      ` : ''}

      <div class="parchment" style="margin-top: var(--s-4); text-align: center; border-color: var(--brass);">
        <h3 style="color: var(--oxblood); font-style: italic; margin-bottom: var(--s-2);">For the debrief</h3>
        <p style="line-height: 1.65;">When you next see your teacher, you will be asked three things:</p>
        <ol style="text-align: left; max-width: 540px; margin: var(--s-2) auto; padding-left: var(--s-3);">
          <li style="margin-bottom: 8px;">Where in the case did you first feel the difference between a <em>strong</em> argument and a <em>cogent</em> one?</li>
          <li style="margin-bottom: 8px;">In Act III, did you change your free-will argument after Sapolsky&apos;s challenge — or stand by it? Why?</li>
          <li>In Act IV, was your argument valid but unsound at any point? What did Holmes&apos;s feedback teach you about the difference?</li>
        </ol>
      </div>

      <div class="row" style="justify-content: center; gap: var(--s-2); margin-top: var(--s-4);">
        <a href="#/title" class="btn btn-secondary">Back to the index</a>
        <button class="btn" id="print-btn">Print the casebook</button>
      </div>

      <p style="text-align: center; color: var(--chalk-mute); font-size: 13px; font-family: var(--font-evidence); letter-spacing: 0.1em; margin-top: var(--s-5);">
        Two-twenty-one B Baker Street &middot; ${new Date().toLocaleDateString('en-GB')}
      </p>
    </div>
  `;

  root.querySelector('#print-btn').addEventListener('click', () => window.print());

  announce('Finale. The case is closed.');
}

export function cleanup() {}

function rom(n) { return ['', 'I', 'II', 'III', 'IV'][n] || String(n); }

function actName(n) {
  return ({
    1: 'The Adventure of the Singular Visitor',
    2: 'Convince Mycroft',
    3: 'The Free Will Inquiry',
    4: 'The Final Deduction'
  })[n] || `Act ${n}`;
}
