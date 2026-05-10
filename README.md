# The Baker Street File — An Inquiry in Standard Form

A four-act SACE Stage 1 Philosophy detective game teaching standard form, inductive vs deductive reasoning, validity, soundness, and Sapolsky's argument against free will.

**Live URL**: https://sherlock-standard-form.netlify.app/

## How students play

1. Open the URL on any device (school Chromebook, iPad, or laptop).
2. Sign the casebook with their name.
3. Play the four acts in order:
   - **Act I — The Adventure of the Singular Visitor** (~12 min). A late-night visitor at 221B with a doomed brother. Visual deduction on a pocket-watch. *No AI.*
   - **Act II — Convince Mycroft** (~20 min). Four progressively stricter levels (Lakera Gandalf-style). The student writes inductive arguments in standard form; Mycroft (AI) judges.
   - **Act III — The Free Will Inquiry** (~15 min). Read Sapolsky's *Determined* argument, identify the faithful standard-form rendering, defend a position; AI-Sapolsky rebuts one premise.
   - **Act IV — The Final Deduction** (~25 min). Locked-room point-and-click. Eight evidence hotspots. Student picks a suspect and writes a deductive argument; Holmes (AI) evaluates validity + soundness.
4. The case closes; the Casebook is printable.

Total play time: **70–95 minutes.**

## Stack

- **Frontend**: Vanilla HTML/CSS/JS, ES modules, no build step.
- **Backend**: One Netlify Function (`netlify/functions/judge.mjs`) routing to one of six stage-specific prompts on Anthropic Claude Haiku 4.5.
- **Caching**: System prompts are byte-identical per stage; 1-hour ephemeral cache via Anthropic's `cache_control`. Expect 5–10× lower cost on subsequent identical-system-prompt calls.
- **Art**: Six recraft v3 illustrations generated via fal.ai. Total cost: $0.24.
- **State**: localStorage for casebook persistence across acts.

## Files of interest

| Path | What it is |
|---|---|
| `index.html` | Entry. Loads fonts, mounts `#app`, points at `src/main.js`. |
| `src/main.js` | Scene registry + router boot. |
| `src/core/state.js` | Casebook (localStorage). |
| `src/core/nav.js` | Hash router + announcer (a11y live regions). |
| `src/core/components.js` | `html` tagged template + `topbar` / `speech` / `modal` / `toast`. |
| `src/core/ai-client.js` | Wrapper around `/api/judge`. |
| `src/acts/act1.js` ... `act4.js` | Scene modules per act. |
| `src/title.js` | Title screen + name capture. |
| `src/casebook.js` | Slide-in Casebook overlay. |
| `src/finale.js` | Case-closed reveal. |
| `data/act1-visitor.js` ... `act4-investigation.js` | Hand-authored content (narration, options, hotspots). |
| `netlify/functions/judge.mjs` | The AI judge. Stage routes: `mycroft-1` … `mycroft-4`, `sapolsky-rebut`, `holmes-final`. |
| `netlify.toml` | Build/deploy config + `/api/judge` redirect. |
| `assets/images/*.webp` | Six fal.ai illustrations. |

## Local development

```bash
cd sherlock-standard-form
python -m http.server 8782 --directory .
# Open http://localhost:8782/
```

The AI endpoints will be unreachable locally unless you run `netlify dev`. Most of the game works offline (Acts I, the structure of II–IV); only the AI-judging calls require the live function.

## Deployment

Connected via GitHub auto-deploy. Push to `main` → Netlify rebuilds. Or trigger a manual deploy via the Netlify MCP (the one-shot proxy command is given by `netlify-deploy-services-updater`).

Required Netlify env var:
- `ANTHROPIC_API_KEY` — Claude Haiku 4.5 access. Set as secret, scope `functions` only.

## Cost (Wednesday 11 May 2026 build)

| Item | Estimated |
|---|---|
| fal.ai illustrations (6 × $0.04) | $0.24 |
| Anthropic Haiku 4.5 (9 students × ~50 calls × ~3K tokens, cached) | ~$1–3 |
| **Total per classroom run** | **~$1.50–3.50** |

Anthropic's $20 cap on the post-paid key gives roughly 6–10 classroom runs of headroom.
