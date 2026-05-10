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
    `It is the dead hour before dawn. Sherlock has met you on the platform at King\u0027s
     Cross. He has read the operational briefing twice. He is not in the mood for
     riddles.`,
    `<em>"The motive is real, Watson. So is the alibi-shaking. So is the brother-in-law
     business. But before we name a killer, we must address a deeper irregularity in
     this case — and there is, perhaps, only one man in the world I trust to think
     about it cleanly. He is in California; you have not heard of him."</em>`,
    `He hands you an envelope. Heavy paper. American postage.`,
    `<em>"Dr Robert Sapolsky. A neurobiologist of unconventional opinions. I corresponded
     with him last summer about a similar matter — a man in Marseille who confessed to
     a poisoning he did not commit. Sapolsky\u0027s reply was — instructive. I had him
     dictate something into a phonograph and shipped to me a fortnight ago in
     anticipation that this question would arise tonight."</em>`,
    `He takes a key from his pocket.`,
    `<em>"The Captain is in cell seventeen. Read Sapolsky first. Then we go and look
     at our prisoner."</em>`
  ]
};

export const SAPOLSKY_LETTER = `<em>"My dear Mr Holmes,</em>
<br><br>
<em>You have asked me whether a man who confessed to a murder during what you call a
\u0027fugue state\u0027 can be said to have done so freely. I will give you a longer
answer than the question deserves.</em>
<br><br>
<em>I do not believe in free will. Let me say it plainly. There is no daylight, in my
view, between the man in the fugue state and the man in his right mind — they are
both, equally, the inevitable products of brain states they did not author. The fugue
is unusual; the predicament is universal.</em>
<br><br>
<em>Consider the man and his action. EVERY action a man performs — opening a door,
firing a revolver, signing a confession — is produced by a particular brain state at
the moment of action. EVERY brain state is the inevitable consequence of prior brain
states, hormonal weather, the day\u0027s events, the year\u0027s experiences,
childhood, fetal environment, genetic inheritance, evolutionary history. NONE of
these are chosen by the man whose brain it is. He did not choose his genes, his
mother\u0027s diet during pregnancy, his country of birth, the war that put him at
Multan, the fever that altered him there. And yet these — and a thousand thousand
other antecedents — produce the brain state that produces the action.</em>
<br><br>
<em>If an action is the inevitable consequence of factors no man chose, then no man
freely chooses his actions. That is the case for Captain Whitcombe; it is also the
case for you and me. The fugue makes the point legible, but the point is the
same.</em>
<br><br>
<em>Yours, in inevitable goodwill,</em>
<br><br>
<em>R. M. Sapolsky</em>"`;

/**
 * Three candidate standard-form renderings. Student picks the faithful one.
 * Two are subtly wrong (one is too strong, one drops a premise).
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
    feedback: 'Yes. This is faithful: every premise from Sapolsky\u0027s letter is present, the inductive→deductive bridge is preserved, and the conclusion is exactly his — universal, not just about the Captain.'
  },
  {
    id: 'B',
    label: 'Rendering B',
    body: `P1: The Captain was in a fugue state when he confessed.
P2: People in fugue states cannot freely choose their actions.
∴ C: The Captain\u0027s confession was not free.`,
    correct: false,
    feedback: 'No. This is a much weaker claim — only about the Captain, and only about fugue states. Sapolsky explicitly rejects this narrowing: "the fugue is unusual; the predicament is universal." This rendering drops the premises about brain states and prior causes entirely.'
  },
  {
    id: 'C',
    label: 'Rendering C',
    body: `P1: Every human action is produced by a brain state.
P2: Brain states sometimes feel involuntary.
∴ C: No human action is freely chosen.`,
    correct: false,
    feedback: 'No. This rendering has only two premises and the second is much too weak ("sometimes feel involuntary" is not what Sapolsky claims). The conclusion does not follow from these premises — it\u0027s not even a valid argument structure. Sapolsky\u0027s actual argument leans heavily on the "inevitable result of unchosen prior causes" premise, which is missing here.'
  }
];

/**
 * Lestrade arrives with a common-sense objection. Student picks which
 * Sapolsky premise he's attacking.
 */
export const LESTRADE_OBJECTION = `<em>"With respect, Doctor — and with respect to
you, Mr Holmes — this is a dangerous lot of nonsense. I have been a peeler for
twenty-two years. Men know right from wrong. Captain Whitcombe knew it was wrong
to shoot Sir Arthur, brain-state or no brain-state. If we cannot hold a man
accountable for his choices, what is the law for? What are courts for? You will
tell me next that we should let Multan off the hook for putting him through it,
and the East India Company off the hook for letting Multan happen. Where does it
end, sir? What COULD a man choose, on this view? It is all very clever and it
proves too much."</em>`;

export const PREMISE_OPTIONS = [
  {
    id: 'P1',
    label: 'P1 — Every human action is produced by a brain state.',
    correct: false,
    feedback: 'Lestrade does not deny that actions come from brains. He grants Sapolsky\u0027s neuroscience but rejects the moral conclusion. Look for the premise where Lestrade pushes back on the leap.'
  },
  {
    id: 'P2',
    label: 'P2 — Every brain state is the inevitable result of unchosen prior causes.',
    correct: false,
    feedback: 'Closer, but Lestrade isn\u0027t arguing the science — he\u0027s arguing the philosophy. He grants that prior causes shape us. He just thinks moral choice is still possible WITHIN that. The premise he targets is about INFERRING "not freely chosen."'
  },
  {
    id: 'P3',
    label: 'P3 — An action that is the inevitable result of unchosen factors is not freely chosen.',
    correct: true,
    feedback: 'Yes. Lestrade is arguing exactly this: "Men know right from wrong … Captain Whitcombe knew it was wrong to shoot Sir Arthur." He grants determinism (P1, P2) but denies the bridge — the move from "inevitable from unchosen causes" to "not freely chosen." He\u0027s a compatibilist, in the philosophical jargon: free choice is compatible with determinism.'
  },
  {
    id: 'C',
    label: 'C — No human action is freely chosen.',
    correct: false,
    feedback: 'You can\u0027t directly attack a conclusion in standard form — only the premises that produce it. Lestrade IS attacking the conclusion, but he does so by attacking premise three, where the inference happens.'
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
<em>"You may argue FOR or AGAINST. Use Sapolsky\u0027s framework, Lestrade\u0027s,
or your own. I do not require you to agree with me, the doctor, or the inspector
— only that your reasoning be in good order. Sapolsky himself will, by phonograph,
challenge one of your premises. Be prepared for that."</em>`;

export const ACT3_OUTRO = {
  body: [
    `Sherlock takes the cell key from his pocket.`,
    `<em>"You have done well, Watson. Sapolsky\u0027s challenge is the right kind of
     challenge — it asks whether the inference can bear weight. Whether you stood by
     your conclusion or revised it, you have argued in earnest, which is more than
     most men do in a lifetime."</em>`,
    `<em>"But the question of whether the Captain\u0027s confession was FREE is no
     longer the most pressing question. The most pressing question is whether it is
     TRUE. And for that — for the actual sequence of events at the Reform Club on
     Wednesday night — we must go to the Reform Club itself. The morning shift will
     have left it largely as it stood when Pelham was found. Lestrade has agreed that
     we shall have one hour."</em>`,
    `He turns the key in the lock of cell seventeen.`,
    `<em>"Captain. We are going to the place where it happened. With your permission
     — and your sister\u0027s — Watson and I would like to know what you cannot tell
     us, by listening to the room itself."</em>`,
    `The Captain looks at Watson with something between hope and grief, says nothing,
     and follows.`
  ]
};

export const SAPOLSKY_PROPOSITION = 'The Captain should be held morally responsible for shooting Sir Arthur Pelham, even if his confession was given in a fugue state.';
