/**
 * Act II — Convince Mycroft. Four progressive sub-levels (Lakera Gandalf-style:
 * each level adds a new defense). Student writes inductive arguments in standard
 * form; Mycroft judges via the /api/judge function.
 */

export const ACT2_INTRO = {
  setting: 'The Diogenes Club, Pall Mall — Wednesday, 12.34 am.',
  body: [
    `The Diogenes Club is a strange institution. By rule, no member may speak to another
     in the public rooms, on pain of expulsion at the third offence. Even Mycroft Holmes
     observes this rule everywhere except his Strangers\u0027 Room.`,
    `He is in the Strangers\u0027 Room now, in the largest leather chair you have ever
     seen, with a brandy he has not lifted and a London <em>Times</em> he is not reading.
     He raises one eyebrow as you enter.`,
    `<em>"Watson. At this hour. I assume my brother has put you up to something irregular."</em>`,
    `You explain Mrs Whitcombe\u0027s case. Mycroft listens without moving. When you finish,
     he sets down the <em>Times</em>.`,
    `<em>"I shall tell you what you wish to know, Watson — provided you can convince me
     it is worth the telling. I am, as you know, a creature of LOGIC. Not eloquence,
     not feeling. LOGIC. Make your case for me, in standard form, and let us see if
     you have the wit for it. There are FOUR things you might wish to know. Each will
     require a sturdier argument than the last."</em>`,
    `He gestures at a small writing-desk by the fire.`,
    `<em>"Begin whenever you are ready."</em>`
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
    title: 'Level the First — A Thing That Has the Shape of an Argument',
    persona: 'Mycroft is feeling generous tonight. He will accept anything that has the basic shape of an inductive argument.',
    proposition: `Convince Mycroft that <strong>Captain Whitcombe\u0027s service in the Punjab might have involved Foreign Office business</strong> — i.e. that Mycroft\u0027s department might know something the public records don\u0027t.`,
    rubric: [
      'At least <strong>two premises</strong> (P1, P2) and a <strong>marked conclusion</strong> (∴ C).',
      'The conclusion is presented as <strong>probable</strong>, not certain.',
      'You may use any reasoning that fits the basic inductive shape.'
    ],
    placeholder: `P1: Captain Whitcombe served in the Punjab from 1892-1894.
P2: ...
∴ C: ...`
  },
  {
    n: 2,
    stage: 'mycroft-2',
    title: 'Level the Second — Multiple Lines of Evidence',
    persona: 'Mycroft is no longer indulgent. A single observation pressed thrice will not pass.',
    proposition: `A telegram reached the Captain an hour before the murder: <em>"He arrives the eight-fifteen. Be ready."</em> Convince Mycroft <strong>this was not a normal business communication.</strong>`,
    rubric: [
      'Standard form, marked conclusion, inductive (probable conclusion).',
      '<strong>At least two distinct LINES of evidence.</strong> A single observation rephrased is one line, not two. Examples of distinct lines: linguistic (the word choice), contextual (timing, sender), behavioural (how the Captain reacted), inferential (what an arrival implies).'
    ],
    placeholder: `P1: The telegram\u0027s phrasing — "He arrives" rather than a name — is unusual for trade...
P2: ...
P3: ...
∴ C: ...`
  },
  {
    n: 3,
    stage: 'mycroft-3',
    title: 'Level the Third — Cogency. Premises That Hold Up.',
    persona: 'A strong argument from unsupported premises is, to Mycroft, theatre. He wants COGENCY.',
    proposition: `Convince Mycroft that <strong>the Captain\u0027s confession should not be taken at face value</strong>, given his mental state since returning from the Punjab.`,
    rubric: [
      'Standard form, marked conclusion, inductive, multiple distinct lines (Level 2 standards still apply).',
      '<strong>Every premise must be plausibly TRUE</strong>, supportable by something we know — Mrs Whitcombe\u0027s testimony, the Captain\u0027s medical history, the wider context. Bare assertions ("The Captain is clearly insane") are NOT cogent unless backed by evidence.'
    ],
    placeholder: `P1: According to Mrs Whitcombe, the Captain has had episodes of...
P2: ...
P3: ...
∴ C: ...`
  },
  {
    n: 4,
    stage: 'mycroft-4',
    title: 'Level the Fourth — Defeat Mycroft\'s Counter-Claim',
    persona: 'Mycroft has heard you out, and offers his own counter-claim. You must rebut it.',
    mycroftClaim: `Mycroft, leaning back: <em>"The Captain confessed. That is the most parsimonious explanation. Until you can show me why a confession given freely should be doubted, I shall not trouble myself further. The simplest explanation is the truth."</em>`,
    proposition: `Rebut Mycroft. <strong>Construct an inductive argument that engages directly with his "confession is sufficient" claim.</strong> At least one premise must challenge the assumption that a confession is reliable evidence.`,
    rubric: [
      'All Level 1-3 standards (form, inductive, multiple distinct lines, cogent premises).',
      '<strong>You must directly engage with Mycroft\u0027s counter-claim.</strong> Not merely an argument that ignores it.',
      'At least one premise should challenge the implicit assumption that confession = reliability (drawing on the Captain\u0027s mental state, the interrogator\u0027s record, contradictions between confession and physical evidence).'
    ],
    placeholder: `P1: Mycroft\u0027s claim assumes that a confession is reliable evidence of guilt. But...
P2: ...
P3: ...
P4: ...
∴ C: Therefore, Mycroft\u0027s "confession is sufficient" position should be rejected.`
  }
];

export const ACT2_OUTRO = {
  body: [
    `Mycroft folds his <em>Times</em>, rises with surprising agility for a man of his
     bulk, and crosses to a tall walnut secretary. From its third drawer he withdraws
     a sealed envelope marked, in red, <strong>POLITICAL DEPARTMENT — NOT FOR
     CIRCULATION</strong>. He hands it to you without ceremony.`,
    `<em>"You have your operational briefing, Watson. The Captain\u0027s service in the
     Punjab was no quiet quartermaster\u0027s posting. The motive for the Reform Club
     murder is real — but motive is not commission, as I trust my brother has impressed
     upon you."</em>`,
    `You are halfway out of the Strangers\u0027 Room when Mycroft adds, in his most
     bored voice:`,
    `<em>"Oh — and Watson. Whoever killed Pelham knew of Multan. So either the Captain
     did it; or someone with reason to know what the Captain did, did it. Find them.
     Now go away."</em>`,
    `Outside, the fog has come up thicker. There is a man waiting at the kerb who you
     do not recognise, but who tips his hat as you pass. You do not stop.`,
    `Back at 221B, the case-file weighs differently in your hands.`
  ]
};
