/**
 * Act I evidence — exported so Acts II/III/IV can surface relevant items
 * in their per-step "Evidence for this argument" panels.
 *
 * Each item has a `theme` (the case-thread it touches) and the load-bearing
 * clues are wrapped in <span class="case-clue"> inside `examine` and
 * `relevant`. The renderer in src/core/components.js#evidencePanel pulls
 * by `id` and shows the `relevant` quote (the case-clue spans render
 * highlighted automatically).
 */

export const EVIDENCE = [
  {
    id: 'watch',
    title: "A gentleman's pocket-watch",
    theme: 'Time & whereabouts',
    sprite: '/assets/pixel/item-watch.png',
    x: 0.78, y: 0.74,
    examine: `Half-hunter, gold. Dial <span class="case-clue">stopped at 11:14</span>. Glass cracked diagonally. The chain carries <span class="case-clue">pale clay mud</span> — <span class="case-clue">suburban soil, not London</span>. Inside the case, three letters: <span class="case-clue">J · T · W</span>.`,
    relevant: `Watch stopped at <span class="case-clue">11:14</span>. Body found at <span class="case-clue">11:30</span> — a <span class="case-clue">sixteen-minute gap</span>. <span class="case-clue">Clay mud</span> on the chain puts the watch outside London earlier, against the Captain's claim he was <span class="case-clue">at the Club all evening</span>.`,
    discardWhy: 'A scratched watch on its own proves little.'
  },
  {
    id: 'telegram',
    title: 'A folded telegram',
    theme: 'Identity of visitor',
    sprite: '/assets/pixel/item-telegram.png',
    x: 0.88, y: 0.66,
    examine: `Yellow post-office paper, seal already broken. Eight words: <em><span class="case-clue">"He arrives the eight-fifteen. Be ready."</span></em> James received it <span class="case-clue">an hour before the murder</span>. He <span class="case-clue">read it twice, took his coat, went out</span> — and has not spoken of it since.`,
    relevant: `<span class="case-clue">An hour before the killing</span>: <span class="case-clue">"He arrives the eight-fifteen. Be ready."</span> <span class="case-clue">Phrasing is wrong for trade</span>. The Captain went out at once on reading it. Mrs Whitcombe cannot explain it.`,
    discardWhy: 'A telegram with no clear sender is hard to use.'
  },
  {
    id: 'rose',
    title: 'A pressed dried rose',
    theme: 'Personal',
    sprite: '/assets/pixel/item-rose.png',
    x: 0.32, y: 0.50,
    examine: `Between two yellowed pages: a dark crimson rose, preserved with care. The pages are blank, kept only for the rose. Mrs Whitcombe will not say from whom.`,
    relevant: `A pressed rose, kept with care. Mrs Whitcombe declines to say from whom. Possibly personal, possibly not.`,
    discardWhy: 'A rose is sentimental, not evidential.'
  },
  {
    id: 'letters',
    title: 'Three letters tied with ribbon',
    theme: 'Motive (blackmail)',
    sprite: '/assets/pixel/item-letters.png',
    x: 0.16, y: 0.62,
    examine: `Three letters from <span class="case-clue">Pelham to the Captain</span> over recent months. <span class="case-clue">The third</span>, sealed differently: <em>"James, <span class="case-clue">my patience is at its end</span>. If we cannot resolve our accounts in private, we shall do so <span class="case-clue">very publicly indeed</span>. <span class="case-clue">I shall be at the Club Wednesday</span>."</em>`,
    relevant: `Three letters. The third threatens public exposure: <span class="case-clue">"resolve our accounts … very publicly."</span> <span class="case-clue">Pelham held something over the Captain</span>. He had announced he would be <span class="case-clue">at the Club Wednesday</span> — the night of the murder.`,
    discardWhy: 'Old correspondence between business partners.'
  },
  {
    id: 'medal',
    title: "The Captain's service medal",
    theme: 'What Pelham knew',
    sprite: '/assets/pixel/item-medal.png',
    x: 0.42, y: 0.16,
    examine: `Indian Service Medal, bronze octagon. Faded crimson ribbon. The prison would not let him wear it; his sister has kept it for him. The reverse is inscribed: <em><span class="case-clue">"For Multan, 1893."</span></em>`,
    relevant: `Inscribed <span class="case-clue">"For Multan, 1893."</span> Whatever happened there, <span class="case-clue">Pelham knew</span>. His sister says it was <span class="case-clue">the lever Pelham had on him</span>.`,
    discardWhy: 'A medal is decoration, not evidence.'
  },
  {
    id: 'casefile',
    title: 'The leather case-file',
    theme: 'State of mind',
    sprite: '/assets/pixel/item-casefile.png',
    x: 0.62, y: 0.78,
    examine: `Mrs Whitcombe's portfolio: inquest report, public service record, and at the back a discharge note from the <span class="case-clue">Aldershot regimental surgeon</span>: <em>"Capt. J. T. Whitcombe, 23rd Foot. Returned from Punjab with <span class="case-clue">prolonged fever</span>. <span class="case-clue">Marked episodes of fugue and confessional disorientation.</span>"</em>`,
    relevant: `Aldershot discharge: <span class="case-clue">"fugue and confessional disorientation."</span> The Captain has <span class="case-clue">confessed to crimes he did not commit</span> during fugues before. <span class="case-clue">His confession may not be a reliable record of fact</span>.`,
    discardWhy: 'Service records are public — Mycroft will have his own.'
  }
];

/* ===== Case threads — shown as a "What to look for" card in Act I ===== */

export const CASE_THREADS = [
  { name: 'Time & whereabouts', hint: 'When did things happen? Was the Captain where he claimed?' },
  { name: 'Motive', hint: 'Why might someone want Pelham dead? What was Pelham holding over the Captain?' },
  { name: 'Who else was here?', hint: 'Was the Captain alone? Who else might have come to the Club?' },
  { name: 'State of mind', hint: 'Can the confession be trusted as a record of what happened?' }
];

/** Lookup helper. */
export function evidenceById(id) {
  return EVIDENCE.find(e => e.id === id);
}
