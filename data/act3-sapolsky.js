/**
 * Act III — The Free Will Inquiry.
 *
 * Five beats:
 *   1. Pentonville Gaol cell (atmosphere, the Captain)
 *   2. Sapolsky's letter (read, then identify the faithful standard-form rendering)
 *   3. Lestrade's objection (which premise is he attacking?)
 *   4. Student writes their own argument; AI-Sapolsky challenges one premise
 *   5. Holmes evaluates and sets up Act IV
 */

export const ACT3_INTRO = {
  setting: 'Pentonville Gaol — Thursday, 4.10 am.',
  body: [
    `It is the dead hour before dawn. Sherlock met you on the platform at King's
     Cross. He has read the operational briefing twice and is not in the mood for
     riddles.`,
    `<em>"The motive is real, Watson. So is the alibi-shaking. But before we name
     a killer we must address a deeper irregularity, and there is only one man in
     the world I trust to think about it cleanly. He is in California. You have
     not heard of him."</em>`,
    `He hands you an envelope. Heavy paper. American postage.`,
    `<em>"Dr Robert Sapolsky. A neurobiologist of unconventional opinions. I
     wrote to him last summer about a similar matter — a man in Marseille who
     confessed to a poisoning he did not commit. His reply was instructive. I had
     him dictate into a phonograph and shipped it to me a fortnight ago, in
     anticipation that this question would arise tonight."</em>`,
    `He takes a key from his pocket.`,
    `<em>"The Captain is in cell seventeen. Read Sapolsky first. Then we go and
     look at our prisoner."</em>`
  ]
};

export const SAPOLSKY_LETTER = `<em>"My dear Mr Holmes,</em>
<br><br>
<em>You ask me whether a man who confessed to a murder during a 'fugue state' can
be said to have done so freely. I will give you a longer answer than the
question deserves.</em>
<br><br>
<em>I do not believe in free will. Let me say it plainly. There is no daylight,
in my view, between the man in the fugue and the man in his right mind: both
are, equally, the inevitable products of brain states they did not author.</em>
<br><br>
<em>Consider the man and his action. <span class="case-clue">Every action a man
performs — opening a door, firing a revolver, signing a confession — is produced
by a brain state at the moment of action.</span> <span class="case-clue">Every
brain state is the inevitable consequence of prior brain states, hormones, the
day's events, childhood, prenatal environment, genes, evolutionary
history.</span> NONE of these are chosen by the man whose brain it is. He did
not choose his genes, his mother's diet, his country of birth, the war that put
him at Multan, the fever that altered him there. And yet these antecedents
produce the brain state that produces the action.</em>
<br><br>
<em><span class="case-clue">If an action is the inevitable consequence of factors
no man chose, then no man freely chooses his actions.</span> That is the case for
Captain Whitcombe. It is also the case for you and me. The fugue makes the point
legible; the point is the same.</em>
<br><br>
<em>Yours, in inevitable goodwill,</em>
<br><br>
<em>R. M. Sapolsky</em>"`;

/**
 * Three candidate standard-form renderings. Student picks the faithful one.
 * Two are subtly wrong (one is too narrow, one drops a premise).
 */
export const STANDARD_FORM_OPTIONS = [
  {
    id: 'A',
    label: 'Rendering A',
    body: `P1: Every human action is produced by a brain state at the moment of action.
P2: Every brain state is the inevitable result of prior causes (genes, prenatal environment, life history) which the agent did not choose.
P3: An action that is the inevitable result of factors the agent did not choose is not freely chosen.
∴ C: No human action is freely chosen.`,
    correct: true,
    feedback: `Yes. All three of Sapolsky's premises are present and the conclusion is his — universal, not just about the Captain.`
  },
  {
    id: 'B',
    label: 'Rendering B',
    body: `P1: The Captain was in a fugue state when he confessed.
P2: People in fugue states cannot freely choose their actions.
∴ C: The Captain's confession was not free.`,
    correct: false,
    feedback: 'No. Too narrow. Sapolsky explicitly refuses this move: "the fugue is unusual; the predicament is universal." This drops the brain-states and prior-causes premises.'
  },
  {
    id: 'C',
    label: 'Rendering C',
    body: `P1: Every human action is produced by a brain state.
P2: Brain states sometimes feel involuntary.
∴ C: No human action is freely chosen.`,
    correct: false,
    feedback: 'No. P2 is much too weak — "sometimes feel involuntary" is not what Sapolsky claims. The "inevitable result of unchosen prior causes" premise is missing, and the conclusion does not follow.'
  }
];

/**
 * Lestrade arrives with a common-sense objection. Student picks which
 * Sapolsky premise he's attacking.
 */
export const LESTRADE_OBJECTION = `<em>"With respect, Doctor — and Mr Holmes —
this is dangerous nonsense. I have been a peeler for twenty-two years. Men know
right from wrong. Captain Whitcombe knew it was wrong to shoot Sir Arthur,
brain-state or no. If we cannot hold a man accountable for his choices, what is
the law for? You will tell me next we should let Multan off the hook for putting
him through it. Where does it end? It proves too much."</em>`;

export const PREMISE_OPTIONS = [
  {
    id: 'P1',
    label: 'P1 — Every human action is produced by a brain state.',
    correct: false,
    feedback: `Lestrade does not deny actions come from brains. He grants Sapolsky's neuroscience and rejects the moral conclusion. Look for the premise where he pushes back on the leap.`
  },
  {
    id: 'P2',
    label: 'P2 — Every brain state is the inevitable result of unchosen prior causes.',
    correct: false,
    feedback: `Closer. Lestrade isn't arguing the science — he's arguing the philosophy. He grants prior causes shape us. He thinks moral choice is still possible WITHIN that. The premise he targets is about inferring "not freely chosen."`
  },
  {
    id: 'P3',
    label: 'P3 — An action that is the inevitable result of unchosen factors is not freely chosen.',
    correct: true,
    feedback: `Yes. Lestrade says "men know right from wrong … Captain Whitcombe knew it was wrong." He grants determinism (P1, P2) but denies the bridge to "not freely chosen." He's a compatibilist: free choice is compatible with determinism.`
  },
  {
    id: 'C',
    label: 'C — No human action is freely chosen.',
    correct: false,
    feedback: `You can't attack a conclusion directly in standard form — only the premises that produce it. Lestrade IS rejecting the conclusion, but he gets there by attacking P3, where the inference happens.`
  }
];

export const STUDENT_WRITES_PROMPT = `Sherlock leans against the cell door, arms
folded.
<br><br>
<em>"Now you, Watson. The Captain awaits. Before you face him, set down your own
position in standard form."</em>
<br><br>
<em>"The proposition: <strong>The Captain should be held morally responsible for
shooting Sir Arthur Pelham, even if his confession was given in a fugue
state.</strong>"</em>
<br><br>
<em>"You may argue FOR or AGAINST. Use Sapolsky's framework, Lestrade's,
or your own. Sapolsky himself will, by phonograph, challenge one of your
premises."</em>`;

export const ACT3_OUTRO = {
  body: [
    `Sherlock takes the cell key from his pocket.`,
    `<em>"You have done well. Sapolsky's challenge is the right kind of
     challenge: it asks whether the inference can bear weight. Whether you stood
     by your conclusion or revised it, you have argued in earnest."</em>`,
    `<em>"But the question of whether the confession was FREE is no longer the
     most pressing one. The most pressing question is whether it is TRUE. For
     that we must go to the Reform Club itself. Lestrade has agreed we shall have
     one hour."</em>`,
    `He turns the key in the lock of cell seventeen.`,
    `<em>"Captain. We are going to the place where it happened. With your
     permission — and your sister's — Watson and I would like to know what
     you cannot tell us, by listening to the room itself."</em>`,
    `The Captain looks at Watson with something between hope and grief, says
     nothing, and follows.`
  ]
};

export const SAPOLSKY_PROPOSITION = 'The Captain should be held morally responsible for shooting Sir Arthur Pelham, even if his confession was given in a fugue state.';
