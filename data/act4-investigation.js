/**
 * Act IV — The Final Deduction.
 * Locked-room point-and-click investigation at the Reform Club.
 * Eight evidence hotspots; three suspects; final deductive argument.
 */

export const ACT4_INTRO = {
  setting: 'The Reform Club, Pall Mall — Thursday, 5.15 am.',
  body: [
    `It has stopped raining. Lestrade is in the foyer with two constables, all three
     visibly bone-tired. He hands Sherlock the keys without a word.`,
    `<em>"You have one hour, Mr Holmes. The body has been removed; the rest is as
     found. Captain Whitcombe is in the morning room with his sister."</em>`,
    `Sherlock turns to Watson at the door of the murder room.`,
    `<em>"Eight hotspots, Watson. Examine them all. When you have read the room,
     pick a suspect, and present your case in standard form. I shall be reading the
     Captain\u0027s service file. The hour is yours."</em>`
  ]
};

export const HOTSPOTS = [
  {
    id: 'lock',
    label: '1',
    x: 22, y: 35,
    title: 'The Yale lock — front door',
    summary: 'A modern Yale lock. The key is in the socket on the inside, with the door bolted. The door was found locked from within when the steward forced it.',
    casebook: 'Front door: Yale lock with key in inside socket; bolted. Locked from within when the body was discovered.'
  },
  {
    id: 'window',
    label: '2',
    x: 75, y: 28,
    title: 'The single window',
    summary: 'A tall sash window. Closer inspection shows multiple coats of paint sealing the frame to the sill — the window has not been opened in years and cannot now be opened without splitting the wood. Only daylight passes here.',
    casebook: 'The window is painted shut and has been for years. Not a means of entry or exit.'
  },
  {
    id: 'decanter',
    label: '3',
    x: 38, y: 55,
    title: 'A tipped brandy decanter',
    summary: 'A heavy crystal decanter on its side, contents pooling beneath. The pool runs UPHILL to a slight tilt in the rug — it was tipped recently. One glass on the side-table is half full; another has been knocked off and lies whole on the carpet.',
    casebook: 'Two brandy glasses. One half-full on the table; the other knocked over but unbroken. The decanter was tipped during a struggle or altercation.'
  },
  {
    id: 'revolver',
    label: '4',
    x: 50, y: 70,
    title: 'A service revolver',
    summary: 'Webley Mk II, .455 calibre. Discharged once, the cartridge in the chamber. The serial matches Captain Whitcombe\u0027s issue. The grip carries his initials. Mud on the heel — the same pale clay as the pocket-watch chain.',
    casebook: 'The revolver IS the Captain\u0027s. Fired once. Same suburban clay-mud on the grip as the pocket-watch chain — links the weapon to outside-of-London earlier in the day.'
  },
  {
    id: 'outline',
    label: '5',
    x: 45, y: 58,
    title: 'The chalk outline',
    summary: 'The body lay face-up beside the leather club-chair, three feet from the revolver. The wound was a single shot, mid-chest, fired from approximately six feet away — too far for the Captain\u0027s position behind the chair, where the steward says he was found. The angle of the wound suggests the shot came from the direction of the back-stair door, not the fireplace.',
    casebook: 'Body position vs. revolver position vs. Captain\u0027s reported standing position do NOT line up. The shot came from the direction of the back-stair door, not where the Captain was standing.'
  },
  {
    id: 'backstair',
    label: '6',
    x: 12, y: 78,
    title: 'The back-stair door',
    summary: 'A narrower service door at the rear of the room — used by the staff for laying fires and clearing trays. It has its own bolt. The bolt is HEAVILY OILED — recently, professionally — though the rest of the brass in the room is the dull green of un-cleaned fittings. The door opens silently.',
    casebook: 'The back-stair door has been newly and professionally oiled — recent, deliberate. Someone wanted it to open silently. The Captain has no reason to oil this door.'
  },
  {
    id: 'token',
    label: '7',
    x: 65, y: 80,
    title: 'A small brass object',
    summary: 'Half-hidden under the writing-desk: a small brass token, octagonal, stamped with a Sikh khanda symbol. Punjabi work — the kind of identifier carried by attendants of Sikh temples in the home country. Not the Captain\u0027s. Lestrade\u0027s constable did not mark it.',
    casebook: 'A small Sikh brass token (khanda symbol) was on the floor under the desk — Punjabi origin, NOT the Captain\u0027s. Someone of South Asian origin, almost certainly Sikh, has been in this room.'
  },
  {
    id: 'mud',
    label: '8',
    x: 30, y: 80,
    title: 'Footprint traces by the back-stair',
    summary: 'On the corner of the rug nearest the back-stair: a partial footprint in pale clay-mud. Same colour and grain as the Captain\u0027s pocket-watch chain. The print is small — roughly a size 7 boot, narrower than a standard British military boot. The Captain wears a size 9.',
    casebook: 'A small (size 7), narrow boot-print in clay mud near the back-stair door. The Captain wears size 9. Someone with smaller feet entered through the back-stair.'
  }
];

export const SUSPECTS = [
  {
    id: 'captain',
    name: 'Captain James Whitcombe',
    blurb: 'The confessed murderer. Found beside the body. Service revolver. Long history of fugue states.',
    note: 'A valid-looking argument can be made for him. But valid is not sound: examine which premises hold up against ALL the evidence.'
  },
  {
    id: 'hari',
    name: 'Hari Singh',
    blurb: 'Brother of Naunihal Singh, the man the Captain killed in Multan. Per Mycroft, arrived from Liverpool on the 8.15. Mentioned in the Captain\u0027s telegram.',
    note: 'Has motive (revenge for Multan), means (taken the Captain\u0027s revolver during a fugue), opportunity (the back-stair).'
  },
  {
    id: 'steward',
    name: 'The Reform Club Steward',
    blurb: 'A long-serving employee. Discovered the body, broke down the door. No known motive.',
    note: 'No motive established. No evidence of his presence at the moment of the shot. A red herring — but you might still construct an argument naming him.'
  }
];

export const ACT4_WRITE_PROMPT = `Sherlock returns from the morning room with the
Captain\u0027s service file under his arm. He looks drawn but alert.
<br><br>
<em>"Lestrade has agreed to entertain a deductive argument from us. Time is short
— Captain Whitcombe\u0027s execution is set for Saturday at six. Watson, name the
suspect you accuse and your case in standard form. The case must be SOUND, not
merely valid. A valid argument with one false premise will hang the wrong man, or
free the right one, or both."</em>
<br><br>
<em>"Take your time. The Reform Club\u0027s clocks are slow."</em>`;

export const ACT4_BACK_TO_HOTSPOTS_REMINDER = `You may revisit any of the eight
hotspots above before submitting.`;

export const ACT4_FAIL_HINT = `Holmes wires Lestrade with the case-as-stated. He
returns shortly with a furrowed brow.
<br><br>
<em>"Lestrade is unconvinced, Watson. He says — accurately — that your argument
has problems. Examine your premises against the evidence we have gathered. Look
again at the room if you must. The clock above the mantel says we have time for
one more attempt — but only one."</em>`;
