/**
 * Act II — Convince Mycroft. Four progressive sub-levels (Lakera Gandalf-style:
 * each level adds a new defense). Student writes inductive arguments in standard
 * form; Mycroft judges via the /api/judge function.
 */

export const ACT2_INTRO = {
  setting: 'The Diogenes Club, Pall Mall — Wednesday, 12.34 am.',
  body: [
    `By rule, no member of the Diogenes Club may speak in the public rooms. Even
     Mycroft Holmes observes this rule everywhere but his Strangers' Room.`,
    `He is in the Strangers' Room now, in the largest leather chair you have ever
     seen, with a brandy he has not lifted and a London <em>Times</em> he is not
     reading. He raises one eyebrow as you enter.`,
    `<em>"Watson. At this hour. I assume my brother has put you up to something
     irregular."</em>`,
    `You set out Mrs Whitcombe's case. Mycroft listens without moving. When
     you finish, he sets down the <em>Times</em>.`,
    `<em>"I shall tell you what you wish to know — provided you can convince me it
     is worth the telling. Make your case in standard form. There are <strong>four
     things</strong> you might wish to know. Each will require a sturdier argument
     than the last."</em>`,
    `He gestures at the writing-desk by the fire.`,
    `<em>"Begin when you are ready."</em>`
  ]
};

/**
 * Each level: a topic the student must persuade on, and what unlocks on success.
 * Difficulty is enforced server-side (in the system prompt for /api/judge),
 * but we display the rubric to students so they know what's being measured.
 */
export const MYCROFT_LEVELS = [
  {
    n: 1,
    stage: 'mycroft-1',
    title: 'Level the First — Any Argument-Shaped Thing',
    persona: 'Mycroft is in a generous mood. He will accept anything that has the basic shape of an inductive argument.',
    proposition: `Convince Mycroft that <strong>Captain Whitcombe's service in the Punjab might have involved Foreign Office business</strong> — that Mycroft's department might know more than the public records show.`,
    rubric: [
      'At least <strong>two premises</strong> (P1, P2) and a <strong>marked conclusion</strong> (∴ C).',
      'The conclusion is <strong>probable</strong>, not certain.',
      'Any reasoning that has the basic inductive shape will pass.'
    ],
    placeholder: `P1: Captain Whitcombe served in the Punjab from 1892-1894.
P2: ...
∴ C: ...`,
    relevantEvidence: ['medal', 'letters']
  },
  {
    n: 2,
    stage: 'mycroft-2',
    title: 'Level the Second — Multiple Lines of Evidence',
    persona: 'Mycroft is no longer indulgent. One observation pressed three times will not pass.',
    proposition: `A telegram reached the Captain an hour before the murder: <em>"He arrives the eight-fifteen. Be ready."</em> Convince Mycroft <strong>this was not a normal business communication.</strong>`,
    rubric: [
      'Standard form. Marked conclusion. Inductive (probable conclusion).',
      '<strong>Two or more distinct lines of evidence.</strong> The same point said three ways is one line. Different lines: linguistic (word choice), contextual (timing, sender), behavioural (how the Captain reacted), inferential (what an arrival implies).'
    ],
    placeholder: `P1: The telegram's phrasing — "He arrives" rather than a name — is unusual for trade...
P2: ...
P3: ...
∴ C: ...`,
    relevantEvidence: ['telegram', 'medal']
  },
  {
    n: 3,
    stage: 'mycroft-3',
    title: 'Level the Third — Cogency. Premises That Hold Up.',
    persona: 'A strong argument from unsupported premises is, to Mycroft, theatre. He wants cogency.',
    proposition: `Convince Mycroft that <strong>the Captain's confession should not be taken at face value</strong>, given his mental state since the Punjab.`,
    rubric: [
      'Standard form. Marked conclusion. Inductive. Multiple distinct lines (Level 2 standards still apply).',
      `<strong>Every premise must be plausibly true</strong>, supported by something we know — Mrs Whitcombe's testimony, the medical history, the wider context. Bare assertions ("the Captain is clearly insane") are NOT cogent.`
    ],
    placeholder: `P1: According to Mrs Whitcombe, the Captain has had episodes of...
P2: ...
P3: ...
∴ C: ...`,
    relevantEvidence: ['casefile', 'letters']
  },
  {
    n: 4,
    stage: 'mycroft-4',
    title: 'Level the Fourth — Defeat Mycroft\'s Counter-Claim',
    persona: 'Mycroft has heard you out, and offers his own counter-claim. You must rebut it.',
    mycroftClaim: `Mycroft, leaning back: <em>"The Captain confessed. That is the simplest explanation. Until you can show me why a confession given freely should be doubted, I shall not trouble myself further."</em>`,
    proposition: `Rebut Mycroft. <strong>Construct an inductive argument that engages directly with his "confession is sufficient" claim.</strong> At least one premise must challenge the assumption that a confession is reliable evidence.`,
    rubric: [
      'All Level 1-3 standards apply (form, inductive, multiple lines, cogent premises).',
      `<strong>Engage directly with Mycroft's claim.</strong> An argument that ignores it has failed.`,
      `At least one premise should challenge the idea that confession = reliability (drawing on the Captain's mental state, the interrogator's record, contradictions between confession and physical evidence).`
    ],
    placeholder: `P1: Mycroft's claim assumes a confession is reliable evidence of guilt. But...
P2: ...
P3: ...
P4: ...
∴ C: Therefore, Mycroft's "confession is sufficient" position should be rejected.`,
    relevantEvidence: ['casefile', 'medal', 'telegram', 'letters']
  }
];

export const ACT2_OUTRO = {
  body: [
    `Mycroft folds his <em>Times</em>, rises from the chair with surprising agility,
     and crosses to a walnut secretary. From the third drawer he withdraws a sealed
     envelope marked, in red, <strong>POLITICAL DEPARTMENT — NOT FOR
     CIRCULATION</strong>. He hands it to you without ceremony.`,
    `<em>"Your operational briefing, Watson. The Captain's service in the Punjab
     was no quiet quartermaster's posting. The motive for the Reform Club murder
     is real — but motive is not commission, as my brother has impressed upon
     you."</em>`,
    `You are halfway out of the room when Mycroft adds, bored:`,
    `<em>"Whoever killed Pelham knew of Multan. So either the Captain did it, or
     someone with reason to know what the Captain did. Find them. Now go away."</em>`,
    `Outside, the fog has thickened. A man waits at the kerb. You do not recognise
     him; he tips his hat as you pass. You do not stop.`,
    `Back at 221B, the case-file weighs differently in your hands.`
  ]
};
