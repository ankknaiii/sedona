---
name: forecast-intent
description: Classify a forecast as future-aligning or future-influencing, and surface hidden purpose. Use when the user asks why a prediction exists, whether it is advocacy or analysis, if a claim is trying to make the future happen, or to separate positioning advice from campaigns, hype, and scare stories.
icon: book-open
color: cyan
metadata:
  framework: future-savvy-forecast-filtering
  chapter: "1"
---

# Forecast intent

A forecast is a speech act. Before judging accuracy, name what it is trying to do to the reader.

If the user wants a full filter after this, continue with [../forecast-filter/SKILL.md](../forecast-filter/SKILL.md).

## The fork

**Future-aligning.** Helps the reader position for conditions they mostly do not control. Weather, some demographics, a competitor’s already-funded build. Success = the reader is less surprised. The author’s win does not require the audience to obey.

**Future-influencing.** Tries to recruit the audience into producing the stated future. Sales, fundraising, policy campaigns, morale speeches, deterrence. Success = someone acts (buys, funds, votes, panics, adopts). Accuracy is secondary to mobilization.

Most public “forecasts” are mixed. Name the dominant purpose. Hidden purpose is a quality failure: the reader cannot tell whether they are being informed or enrolled.

## How to classify

Score these. One “yes” is a hint; a cluster is a diagnosis.

| Marker | Tips toward |
| --- | --- |
| Purpose stated in the opening; uncertainty and disconfirmers included | Aligning |
| Widely publicized, shareable, made for headlines | Influencing |
| Specifies an action in the external world (“invest now,” “ban this,” “switch vendors”) | Influencing |
| Lives on extremes (collapse, miracle, total replacement) | Influencing |
| Author or sponsor wins if the audience complies | Influencing |
| Author still useful if the base case is dull | Aligning |
| Timeline used to create urgency more than to bound a mechanism | Influencing |
| Venue is a filing, ops briefing, or decision memo with named owners | Aligning (often) |
| Venue is a keynote, launch blog, or “industry will never be the same” essay | Influencing (often) |

Influencing work is not a lie by default. It is a poor input to alignment decisions unless you recast it as “this actor wants X, and here is what that implies.”

## Questions to answer in output

1. What does the author need from the reader?
2. Aligning, influencing, or mixed — and which parts are which?
3. Is purpose upfront or smuggled?
4. If influencing: what campaign is this (raise, sell, scare, recruit, regulate)? What would “success” look like for them even if the prediction is wrong?
5. What, if anything, remains useful as an aligning signal once the campaign is stripped off?

## Output

```markdown
## Intent
**Class:** future-aligning | future-influencing | mixed | hidden
**Author needs the reader to:** …
**Campaign (if any):** …
**Safe aligning residue:** … | none
**Do not use this as:** …
```

## Traps

- Treating a vendor roadmap as environmental scanning.
- Treating a social-movement deadline as a base-rate forecast.
- Discounting an aligning forecast because it is boring.
- Accepting an influencing forecast because it is vivid.

Purpose first. Quality second. Decision-fit last.
