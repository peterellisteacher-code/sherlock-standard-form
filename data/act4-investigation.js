/**
 * Act IV — The Final Deduction.
 * Locked-room point-and-click investigation at the Reform Club.
 * Eight evidence hotspots; three suspects; final deductive argument.
 *
 * Each hotspot has a `theme` — the question this clue answers.
 * Each suspect has a `theme` — what the argument against them would rest on.
 */

export const ACT4_INTRO = {
  setting: 'The Reform Club, Pall Mall — Thursday, 5.15 am.',
  body: [
    `It has stopped raining. Lestrade is in the foyer with two constables, all
     three bone-tired. He hands Sherlock the keys without a word.`,
    `<em>"You have one hour, Mr Holmes. The body has been removed; the rest is as
     found. Captain Whitcombe is in the morning room with his sister."</em>`,
    `Sherlock turns to Watson at the door of the murder room.`,
    `<em>"Eight hotspots, Watson. Examine them all. When you have read the room,
     pick a suspect and present your case in standard form. I shall be reading the
     Captain's service file. The hour is yours."</em>`
  ]
};

export const HOTSPOTS = [
  {
    id: 'lock',
    label: '1',
    theme: 'Locked-room proof',
    x: 22, y: 35,
    title: 'The Yale lock — front door',
    summary: `A modern Yale lock. The <span class="case-clue">key is in the inside socket</span>; the <span class="case-clue">door bolted from within</span>. <span class="case-clue">Locked from inside</span> when the steward forced it.`,
    casebook: '<span class="case-clue">Front door locked from within</span> when the body was found. Key in the inside socket.'
  },
  {
    id: 'window',
    label: '2',
    theme: 'Locked-room proof',
    x: 75, y: 28,
    title: 'The single window',
    summary: `A tall sash window. <span class="case-clue">Multiple coats of paint seal the frame to the sill</span>. The window has <span class="case-clue">not been opened in years</span> and cannot now be opened without splitting the wood.`,
    casebook: '<span class="case-clue">Window painted shut</span> and has been for years. Not a means of entry or exit.'
  },
  {
    id: 'decanter',
    label: '3',
    theme: 'A struggle in the room',
    x: 38, y: 55,
    title: 'A tipped brandy decanter',
    summary: `A heavy crystal decanter on its side, contents pooling beneath. <span class="case-clue">Two brandy glasses</span>: one on the side-table <span class="case-clue">half full</span>; another <span class="case-clue">knocked off, lying whole on the carpet</span>.`,
    casebook: `<span class="case-clue">Two brandy glasses</span> — one half-full, one knocked over. The Captain was not Pelham's only company.`
  },
  {
    id: 'revolver',
    label: '4',
    theme: 'Where the Captain was',
    x: 50, y: 70,
    title: 'A service revolver',
    summary: `Webley Mk II, .455. <span class="case-clue">Discharged once</span>. Serial matches the Captain's issue. <span class="case-clue">Grip carries his initials</span>. Mud on the heel — the <span class="case-clue">same pale clay</span> as the pocket-watch chain.`,
    casebook: `Revolver IS the Captain's. Fired once. <span class="case-clue">Same suburban clay-mud</span> on the grip as the pocket-watch chain.`
  },
  {
    id: 'outline',
    label: '5',
    theme: 'Where the shot came from',
    x: 45, y: 58,
    title: 'The chalk outline',
    summary: `The body lay face-up beside the leather chair, <span class="case-clue">three feet from the revolver</span>. Single shot, mid-chest, fired from <span class="case-clue">about six feet</span>. The <span class="case-clue">angle suggests the shot came from the back-stair door</span>, not the fireplace where the Captain was found.`,
    casebook: `Body, revolver, and Captain's reported position do not line up. <span class="case-clue">Shot came from the back-stair direction</span>, not where the Captain was standing.`
  },
  {
    id: 'backstair',
    label: '6',
    theme: 'Who else was here',
    x: 12, y: 78,
    title: 'The back-stair door',
    summary: `A narrower service door at the rear. Its bolt is <span class="case-clue">heavily oiled — recent, professional</span> — though the rest of the brass in the room is the dull green of un-cleaned fittings. The door <span class="case-clue">opens silently</span>.`,
    casebook: '<span class="case-clue">Back-stair door newly and professionally oiled</span> — recent, deliberate. Someone wanted it to open silently. The Captain has no reason to oil it.'
  },
  {
    id: 'token',
    label: '7',
    theme: 'Who else was here',
    x: 65, y: 80,
    title: 'A small brass object',
    summary: `Half-hidden under the writing-desk: a small brass token, octagonal, stamped with a <span class="case-clue">Sikh khanda</span>. <span class="case-clue">Punjabi work</span> — the kind carried by attendants of Sikh temples. <span class="case-clue">Not the Captain's</span>.`,
    casebook: `A <span class="case-clue">Sikh brass token (khanda)</span> under the desk. Punjabi work, NOT the Captain's. Someone of South Asian origin has been in this room.`
  },
  {
    id: 'mud',
    label: '8',
    theme: 'Who else was here',
    x: 30, y: 80,
    title: 'Footprint traces by the back-stair',
    summary: `Partial footprint in <span class="case-clue">pale clay-mud</span> on the rug nearest the back-stair. <span class="case-clue">Same colour and grain</span> as the Captain's pocket-watch chain. The print is <span class="case-clue">size 7, narrower than a British military boot</span>. The Captain wears <span class="case-clue">size 9</span>.`,
    casebook: '<span class="case-clue">Size 7 narrow boot-print in clay mud</span> near the back-stair door. The Captain wears size 9. Someone with smaller feet came in by the back-stair.'
  }
];

export const SUSPECTS = [
  {
    id: 'captain',
    name: 'Captain James Whitcombe',
    blurb: `The confessed murderer. <span class="case-clue">Found beside the body</span>. <span class="case-clue">Service revolver</span> in the room. Long history of <span class="case-clue">fugue states</span>.`,
    note: `A valid argument can be made for him. But <span class="case-clue">valid is not sound</span>: which premises hold up against ALL the evidence?`
  },
  {
    id: 'hari',
    name: 'Hari Singh',
    blurb: `Brother of <span class="case-clue">Naunihal Singh</span>, the man the Captain killed in <span class="case-clue">Multan</span>. Per Mycroft, arrived from <span class="case-clue">Liverpool on the 8.15</span>.`,
    note: `Look for motive, means, opportunity. Each must be a separate premise.`
  },
  {
    id: 'steward',
    name: 'The Reform Club Steward',
    blurb: 'Long-serving employee. Discovered the body. Broke down the door. No known motive.',
    note: 'No motive established. No evidence places him in the room at the shot. A red herring — but an argument naming him can still be tried.'
  }
];

export const ACT4_WRITE_PROMPT = `Sherlock returns with the Captain's service
file under his arm. He looks drawn but alert.
<br><br>
<em>"Lestrade has agreed to entertain a deductive argument. Time is short — the
execution is set for Saturday at six. Name the suspect you accuse and your case
in standard form. The case must be SOUND, not merely valid. A valid argument
with one false premise will hang the wrong man."</em>
<br><br>
<em>"Take your time. The Club's clocks are slow."</em>`;

export const ACT4_BACK_TO_HOTSPOTS_REMINDER = `You may revisit any of the eight
hotspots before submitting.`;

export const ACT4_FAIL_HINT = `Holmes wires Lestrade. He returns with a furrowed
brow.
<br><br>
<em>"Lestrade is unconvinced, Watson. Your argument has problems. Examine your
premises against the evidence. Look again at the room if you must. We have time
for one more attempt."</em>`;
