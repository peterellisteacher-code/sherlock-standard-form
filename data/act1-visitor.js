/**
 * Act I — The Adventure of the Singular Visitor
 *
 * Pure narrative hook. ~12-15 minutes. Almost no overt pedagogy.
 * The student plays Watson at 221B; Holmes is "at the docks." A woman in
 * mourning arrives. The case she brings is the spine for Acts II–IV.
 *
 * Three interactive beats:
 *   1. Knock at the door (atmospheric choice with no consequence)
 *   2. Mrs Whitcombe's testimony (pick-3-questions-to-ask)
 *   3. The pocket-watch (hotspot deduction)
 * Plus narrative bookends.
 */

export const OPENING = {
  setting: '221 B Baker Street — Wednesday, 11.42 pm.',
  body: [
    `Holmes is at the docks. He left a note. <em>"Investigating the matter of the
     Romanian shipping clerk. Back by Thursday morning. Do not eat my anchovies."</em>`,
    `You are at the desk, attempting Watson&apos;s memoir of the Reichenbach business.
     The fire is low. The fog has come up from the river and pressed itself against the
     parlour windows like a poorly-mannered acquaintance. The clock above the mantel
     reads thirteen minutes to midnight.`,
    `Three knocks. Loud. Then a fourth, almost immediately, as though by someone who
     could not bear to wait between knocks.`
  ]
};

export const CHOICE_AT_DOOR = {
  prompt: 'A late call. Holmes&apos;s rule on visitors after eleven is that there should be none. What do you do?',
  options: [
    {
      id: 'open',
      label: 'Open the door at once.',
      after: `The figure on the step is a woman in deep mourning, soaked through. Her face
              is tear-stained but her jaw is set as though she has cried out the panic and
              what remains is decision. She presses past you into the hallway with an
              apology that is more of a command. <em>"Forgive me. There is very little
              time."</em>`
    },
    {
      id: 'window',
      label: 'Look from the window first — Holmes&apos;s precaution.',
      after: `From the window you see her plain enough — a woman in deep mourning, the
              gas-lamp catching the rain on her shoulders. She has come a long way
              tonight; the hem of her travelling cloak is grey to the knee. By the time
              you have crossed back to the door she has knocked again, more urgently, and
              when you open it she presses past you with an apology that is more command
              than apology. <em>"Forgive me. There is very little time."</em>`
    }
  ]
};

export const TESTIMONY_INTRO = `She places a heavy leather case-file on the desk
beside Watson&apos;s memoir, removes her wet gloves with the precision of someone
trying very hard not to fall apart, and sits.
<br><br>
<em>"My name is Eleanor Whitcombe. My brother is Captain James Whitcombe of the
Twenty-Third Foot, recently invalided home from the colonial service. Three days
ago he was arrested at the Reform Club, charged with the murder of his business
partner, Sir Arthur Pelham. He has confessed. He is to be hanged on Saturday."</em>
<br><br>
<em>"I do not believe he did it. I have ridden the night train from Edinburgh to
say so to the only man in England who might listen. Mr Holmes is — I see — not
here. So I shall have to settle for you."</em>
<br><br>
She opens the case-file. Inside: a sheaf of documents, a folded telegram, a
gentleman&apos;s pocket-watch, and a single dried rose.
<br><br>
<strong>Ask her three questions.</strong>`;

/**
 * Six questions; the student picks three. Each adds an entry to the casebook.
 * Some pairs are mutually exclusive (lock out the other once chosen) so the
 * student can&apos;t simply pick everything.
 */
export const QUESTIONS = [
  {
    id: 'scene',
    text: 'The murder scene — could you describe it?',
    locks: [],
    answer: `<em>"It was a private room at the Reform Club. James and Sir Arthur often
             dined there together. The door was locked from the inside — a Yale lock, the
             key still in its socket. The single window was painted shut. Sir Arthur lay
             dead on the rug, shot through the chest at close range. James was standing by
             the fire, my brother&apos;s service revolver — discharged once — at his feet.
             When the steward broke down the door, James said only, &apos;I had to do it.
             You could not understand.&apos; He has said almost nothing since."</em>`,
    casebook: 'A locked room. Single window painted shut. Captain Whitcombe found beside the body, his service revolver fired once, on the rug.'
  },
  {
    id: 'lastsaw',
    text: 'When did you last see your brother before the arrest?',
    locks: [],
    answer: `<em>"Five days ago. He came to my flat in Bayswater for dinner. He was —
             not himself. He had not been himself since returning from the Punjab.
             Distracted, watchful, sleeping ill. Twice during dinner he forgot what he was
             saying mid-sentence and stared at the wallpaper. Once he asked me what year
             it was. I did not press him."</em>`,
    casebook: 'In the days before the murder, the Captain was distracted, sleepless, occasionally disoriented — losing track of time and topic.'
  },
  {
    id: 'dispute',
    text: 'The nature of the dispute with Sir Arthur — what was it?',
    locks: [],
    answer: `<em>"They were partners in a small import concern — silks, mostly, from
             Lahore. There had been talk of dissolving it. Sir Arthur, by all accounts,
             wished to take a larger share of the proceeds; James wished to settle the
             books and walk away. But James was not a vengeful man. He came home from
             the army with no taste for argument."</em> She frowns.
             <em>"And yet — Sir Arthur held something over him. James once said,
             &apos;The man knows what happened at Multan, and I cannot have him telling
             it.&apos; I do not know what he meant."</em>`,
    casebook: 'The Captain and his partner were dissolving their import business. Sir Arthur "knew what happened at Multan" — a piece of leverage from the Captain&apos;s military past.'
  },
  {
    id: 'himself',
    text: 'Has the Captain been himself? Since returning, I mean.',
    locks: ['lastsaw'],
    answer: `<em>"That is the question I cannot answer, sir. He is and he is not. He
             returned in March of last year, with a fever they called &apos;jungle
             fever&apos; — though the surgeon at Aldershot thought it more likely some
             form of brain-fever. Since then, he is given to long silences and sudden
             alarms. He keeps a journal in which he writes things he does not
             remember writing. Once I found him in his garden at three in the morning,
             digging."</em>`,
    casebook: 'After a fever in the Punjab, the Captain has been subject to amnesias and dissociations — writing things he doesn&apos;t remember writing; once digging in his garden at 3am with no memory of why.'
  },
  {
    id: 'why',
    text: 'Why have you come to Holmes — specifically?',
    locks: [],
    answer: `<em>"Because the police are satisfied. The judge is satisfied. The
             newspapers are satisfied. James himself is satisfied. The only person on
             the Earth who is not satisfied that James shot Sir Arthur Pelham is me.
             And I do not know whether my conviction is sister&apos;s love or
             evidence."</em>
             She looks at you steadily.
             <em>"Mr Holmes, I am told, has the rare habit of treating evidence and
             love as separate questions. I should like to know which I have."</em>`,
    casebook: 'Mrs Whitcombe explicitly distinguishes "sister&apos;s love" from "evidence." She has come for evaluation, not consolation.'
  },
  {
    id: 'casefile',
    text: 'And the case-file — what is in it?',
    locks: [],
    answer: `<em>"The inquest report. James&apos;s service record from the regimental
             office at Horse Guards — what was made public, in any case. Three letters
             from Sir Arthur to my brother in the months before his death — the last
             of them a threat. A telegram James received an hour before the murder
             which I cannot account for; it reads, &apos;He arrives the eight-fifteen.
             Be ready.&apos; And — this."</em>
             She lifts a gentleman&apos;s pocket-watch from the file and lays it on
             the desk under the lamp.
             <em>"It was found in James&apos;s coat at the Reform Club. It is not his
             watch. It bears his initials, but not in his hand. I cannot say more than
             that."</em>`,
    casebook: 'Items in the file: inquest report; service record; three Pelham letters (the last a threat); a telegram — "He arrives the eight-fifteen. Be ready." And the pocket-watch — bearing JTW initials but in an unfamiliar hand.'
  }
];

export const TESTIMONY_OUTRO = `She closes the case-file. Her hands have steadied.
<br><br>
<em>"I shall take a room at the Langham. If anything in that file is of use to you,
or to Mr Holmes when he returns — please. My brother has three days."</em>
<br><br>
She rises, gathers her gloves, and is gone before you can offer her a hansom.
On the desk: the case-file, the pocket-watch, and a faint scent of damp wool
and lily-of-the-valley.
<br><br>
There is no chance of sleep tonight.`;

/**
 * The pocket-watch hotspot scene. Four hotspots; each is a small puzzle with
 * three multiple-choice options and Holmes&apos;s telegram-style reaction.
 * The hotspots are positioned over the watch.webp illustration as percentages
 * of the image dimensions.
 */
export const WATCH_INTRO = `You light a fresh lamp and clear the desk. Holmes is
unreachable until morning, but the wire from his hotel at the docks is open. You
sit, take up the watch, and begin to <em>see</em>.`;

export const WATCH_HOTSPOTS = [
  {
    id: 'monogram',
    label: 'A',
    x: 35,    // percent of image width
    y: 45,
    title: 'The monogram',
    detail: 'Three letters engraved into the inside of the case, in a slanted hand: <strong>J · T · W</strong>.',
    holmes_telegram: 'JTW. CAPTAIN&apos;S NAME IS JAMES WHITCOMBE. WHAT MIGHT THE T BE? - SH',
    options: [
      {
        id: 'theodore',
        text: 'Theodore. The Captain&apos;s middle name. Mrs Whitcombe will know.',
        correct: true,
        holmes: 'GOOD. ASK HER. IF SHE SAYS NO MIDDLE NAME OR DIFFERENT INITIAL, WATCH IS NOT HIS. - SH',
        casebook: 'The watch is engraved JTW. If James has no middle initial T, it is not his watch — though his sister says it bore his name.'
      },
      {
        id: 'tobias',
        text: 'Tobias, perhaps. A common Victorian name.',
        correct: false,
        holmes: 'GUESSING IS NOT DEDUCING. WHO MIGHT YOU ASK? - SH',
        hint: 'There is someone in the room with you who could simply tell you the Captain&apos;s middle name.'
      },
      {
        id: 'jeweller',
        text: 'Send the watch to a jeweller for examination.',
        correct: false,
        holmes: 'BY DAWN? CAPTAIN HANGS SATURDAY. ASK THE OBVIOUS QUESTION. - SH',
        hint: 'Mrs Whitcombe is staying at the Langham. The simplest source of the answer is the simplest source.'
      }
    ]
  },
  {
    id: 'crack',
    label: 'B',
    x: 65,
    y: 30,
    title: 'A crack across the glass',
    detail: 'A single sharp crack runs from the 1 o&apos;clock position diagonally to the 7 o&apos;clock — straight through the centre.',
    holmes_telegram: 'CRACK IS A WITNESS. WHAT DID IT SEE? - SH',
    options: [
      {
        id: 'falling',
        text: 'The watch was lying flat when struck — by something falling onto it.',
        correct: true,
        holmes: 'YES. ANGLE OF FRACTURE IMPLIES WATCH WAS LYING FACE UP, STRUCK FROM ABOVE. NOT IN A POCKET. - SH',
        casebook: 'The crack-pattern shows the watch was lying flat — not in a pocket — when it was struck. Something fell on it.'
      },
      {
        id: 'thrown',
        text: 'It was thrown against a wall.',
        correct: false,
        holmes: 'A THROWN WATCH SHATTERS. THIS IS A SINGLE FRACTURE. RECONSIDER. - SH',
        hint: 'A thrown watch tends to shatter into many pieces, not crack neatly across.'
      },
      {
        id: 'pocket',
        text: 'It was in the Captain&apos;s pocket when he fell.',
        correct: false,
        holmes: 'A WATCH IN A POCKET STRUCK SIDEWAYS. THIS FRACTURE IS PERPENDICULAR TO THE FACE. RECONSIDER. - SH',
        hint: 'Pocket-impacts hit the side of the watch, not the face. Look at how the crack runs.'
      }
    ]
  },
  {
    id: 'time',
    label: 'C',
    x: 50,
    y: 60,
    title: 'The hands have stopped',
    detail: 'The hands have halted at <strong>11:14</strong>. The crown has not been wound; the spring is fully released.',
    holmes_telegram: 'STEWARD FOUND BODY AT 11.30. WHY DOES WATCH SAY 11.14? - SH',
    options: [
      {
        id: 'tod',
        text: '11:14 was the actual moment the watch stopped — likely the moment of the impact in part B.',
        correct: true,
        holmes: 'YES. WATCH STOPPED AT 11.14, BODY DISCOVERED 11.30. SIXTEEN-MINUTE GAP NEEDS EXPLAINING. - SH',
        casebook: 'The watch stopped at 11:14 from a flat-impact strike. Body discovered at 11:30. Sixteen unaccounted minutes.'
      },
      {
        id: 'broken',
        text: 'The watch is simply broken; the time means nothing.',
        correct: false,
        holmes: 'WATCH HAS NO INTERNAL DAMAGE. STOPPED FROM EXTERNAL IMPACT AT 11.14. RECONSIDER. - SH',
        hint: 'A broken movement would tick irregularly before stopping. This watch was struck and stopped.'
      },
      {
        id: 'unwound',
        text: 'It simply ran out of spring at 11:14, by chance.',
        correct: false,
        holmes: 'GENTLEMAN&apos;S WATCH IS WOUND DAILY. CAPTAIN ARRESTED THAT EVENING. RECONSIDER. - SH',
        hint: 'Officers wind their watches each morning. An unwound watch on the night of an arrest is very unlikely.'
      }
    ]
  },
  {
    id: 'mud',
    label: 'D',
    x: 25,
    y: 75,
    title: 'A trace of mud on the chain',
    detail: 'The bottom links of the chain hold a streak of pale, gritty mud — not the dark Thames muck of central London, but a yellow-grey, clay-like soil.',
    holmes_telegram: 'CLAY-MUD IS SUBURBAN OR FURTHER. NOT REFORM CLUB. WHERE? - SH',
    options: [
      {
        id: 'outdoors',
        text: 'The watch was outdoors, in clay-rich soil, hours before the murder.',
        correct: true,
        holmes: 'CONFIRMED. CAPTAIN STATES HE WAS AT REFORM CLUB ALL EVENING. WATCH SAYS OTHERWISE. - SH',
        casebook: 'Pale clay mud on the chain implies the watch (or its bearer) was outside London hours before the killing — though the Captain claims he was at the Club all evening.'
      },
      {
        id: 'cleaning',
        text: 'A cleaning agent has discoloured the chain.',
        correct: false,
        holmes: 'A WATCH-MAKER&apos;S CLEANER IS NEUTRAL. THIS RESIDUE IS SOIL. RECONSIDER. - SH',
        hint: 'Run a finger across it. It rolls and crumbles like dirt — not like a chemical residue.'
      },
      {
        id: 'pocket',
        text: 'It picked up dirt inside the Captain&apos;s coat pocket.',
        correct: false,
        holmes: 'COAT POCKETS DO NOT GENERATE CLAY MUD. WATCH WAS DIRECTLY EXPOSED. RECONSIDER. - SH',
        hint: 'A pocket protects from external contamination. This mud came from outside the coat, not within.'
      }
    ]
  }
];

export const WATCH_OUTRO = `You set the watch down. Holmes&apos;s last telegram —
fifteen minutes ago, by the clock above the mantel — reads:
<br><br>
<em>"WATSON. STOP. THE WATCH TELLS A STORY THE CAPTAIN HAS NOT. STOP. MUD AND
TIME-STOP IMPLY HE WAS NOT AT THE REFORM CLUB AT ELEVEN. STOP. BUT BEFORE WE
PURSUE THE MURDER WE NEED THE BUSINESS. STOP. CAPTAIN&apos;S LAST POSTING WAS
NOT WHAT THE PAPERS SAY. STOP. ONLY MYCROFT KNOWS WHY. STOP. HE WILL NOT PART
WITH SECRETS CHEAPLY. STOP. YOU MUST ARGUE FOR THEM, AND ARGUE WELL. STOP. -
SH"</em>
<br><br>
You take down your overcoat. The night is not over. The Diogenes Club is half a
mile across the park — and Mycroft Holmes is, mercifully, an insomniac.`;
