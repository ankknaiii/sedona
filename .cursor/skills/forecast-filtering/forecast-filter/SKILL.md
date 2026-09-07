---
name: forecast-filter
description: Evaluate forecasts, predictions, trend pieces, TAM claims, and future-oriented articles using quality filters. Use when the user asks to vet a forecast, judge a prediction, decide what to believe about the future, filter hype, extract usable signal from a weak forecast, or apply forecast filtering / Future Savvy self-defense.
icon: shield
color: blue
metadata:
  framework: future-savvy-forecast-filtering
  role: orchestrator
---

# Forecast Filtering for Self-Defense

Take a middle course: neither swallow the prediction nor smirk and discard it. Errors are instructive. The job is to weigh a future-oriented claim, keep the parts that earn a place in planning, and ignore the rest.

Read this file first. Load a sibling skill or a reference only when that filter is in play.

| Need | Load |
| --- | --- |
| Purpose: aligning vs influencing | [../forecast-intent/SKILL.md](../forecast-intent/SKILL.md) |
| Data and evidence | [../forecast-data-quality/SKILL.md](../forecast-data-quality/SKILL.md) |
| Spin, bias, mental models | [../forecast-bias/SKILL.md](../forecast-bias/SKILL.md) |
| Utility, drivers, blockers, trends | [../forecast-utility/SKILL.md](../forecast-utility/SKILL.md) |
| Interconnected change | [../forecast-complexity/SKILL.md](../forecast-complexity/SKILL.md) |
| Quant models vs scenarios | [../forecast-methods/SKILL.md](../forecast-methods/SKILL.md) |
| Full hurdle list | [references/checklist.md](references/checklist.md) |
| How a dissection looks | [references/worked-examples.md](references/worked-examples.md) |

## Stance

- Forecasts are mixed-quality guides, not oracles. Independence of mind is the product.
- A weak forecast can still contain a usable fragment. Extract it. Do not require an all-or-nothing verdict.
- Failed forecasts (picture phones vs cell phones; oil-dry-by-2000 vs hybrid uptake) teach repeated error types. Name the error class. Do not mock the miss.
- Breathless “latest new thing” copy is the default input. Keep your head.

Every claim must answer:

1. How credible is it?
2. How accurate or biased?
3. Which parts belong in the reader’s mental model?
4. Which parts belong in the organization’s preparation, and which can be discounted?
5. Does this further the institution’s actual goals?
6. Can a decision rest on this with stated confidence?

## Procedure

Work in this order. Skip a gate only when the input has no material on that gate, and mark the skip as `unknown`, not as a pass.

1. **Restate the claim** in one sentence: subject, magnitude, timing, and who is supposed to act.
2. **Intent** — future-aligning (position for a world you do not control) vs future-influencing (try to make a world happen). Hidden purpose is a defect.
3. **Specificity** — predictive point-forecast vs speculative alternatives; too much certainty or too much hedge; pace and dates stated or left hazy.
4. **Information** — base data extent, recency, primary vs secondary, observation vs projection.
5. **Interpretation** — natural vs intentional bias; sponsor, self-interest, ideology, single-issue tunnel, missing editorial check.
6. **Assumptions and zeitgeist** — stated assumptions; bandwagon; expert-as-proof; whether the piece can leave the official future.
7. **Utility and friction** — who benefits, who blocks, habits, law, culture, tech-love vs user-love, what does not change.
8. **Complexity** — feedback, triggers, tipping points, exponential leaps, “change one thing and nothing else moves.”
9. **Method** — methods disclosed; quantitative tools used inside their lane; scenarios used when the system is open and contested.
10. **Utility to this reader** — map surviving fragments onto the user’s decision, not onto a generic “interesting future.”

If the user named a decision, score the forecast against that decision. If they did not, say what kind of decision it could support and what it cannot.

## Verdict format

Lead with the verdict. Do not open with a book report.

```markdown
## Verdict
**Use:** note | prepare | decide | ignore
**Confidence:** low | medium | high
**Intent:** future-aligning | future-influencing | mixed / hidden

## Claim
One-sentence restatement (what, how much, by when, for whom).

## Keep
- Fragment → why it survives the filters → how to use it

## Discount
- Fragment → which filter it fails → why it is safe to ignore for this decision

## Hurdles
| Gate | Result | Note |
| --- | --- | --- |
| Intent | pass / fail / unknown | |
| Specificity | | |
| Information | | |
| Bias | | |
| Assumptions / zeitgeist | | |
| Utility / blockers | | |
| Complexity | | |
| Method | | |

## Decision use
What this can support. What it cannot. What evidence would upgrade or kill the claim.
```

Rules for the table: `fail` on a gate does not auto-ignore the whole piece. It removes or downgrades the parts that depend on that gate.

## Depth

- Short claim, obvious hype, or a yes/no “should I care?” → run the procedure here. Do not load every sibling.
- User wants a full filter, a board memo, or a contested market call → load [references/checklist.md](references/checklist.md) and the sibling skills for the gates that actually wobble.
- User wants to learn the method from a miss → load [references/worked-examples.md](references/worked-examples.md) and dissect with the same verdict format.

## Do not

- Treat a confident number as a quality signal.
- Confuse advocacy, fundraising, or product marketing with a future-aligning forecast.
- Throw away a forecast because it is imperfect; say which pieces still inform preparation.
- Reconstruct or quote long passages from any forecasting book. Apply the method; do not reprint it.
