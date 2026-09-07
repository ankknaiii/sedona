---
name: forecast-methods
description: Judge quantitative forecasting, disclosed methods, and scenario / alternative-futures work. Use when the user asks if a model, simulation, or AI forecast is trustworthy, whether a point prediction is overprecise, or when to prefer scenarios over a single number.
icon: code
color: yellow
metadata:
  framework: future-savvy-forecast-filtering
  chapter: "8-9"
---

# Methods: quantities, models, and alternative futures

Method is how a forecast earns (or forfeits) confidence. Fancy tools do not lift a claim that hid its assumptions. When the system is open, contested, or reflexive, a precise point is often exactly wrong. Plural futures that are roughly right are the adult form.

If the user wants a full filter after this, continue with [../forecast-filter/SKILL.md](../forecast-filter/SKILL.md).

## Disclose or cap confidence

- Methods named at a replayable level (data, steps, model class, validation)?
- “Too complex / proprietary / our AI” used as a velvet rope?
- Novelty of method offered as a reason to believe (“new and improved,” “first end-to-end model”)?

No disclosure → `low` confidence, regardless of decimal places.

## When quantitative tools are in lane

Appropriate when categories are stable, the horizon is short relative to the system’s memory, feedback is weak, and the question is about a measurable stock or flow.

Out of lane when:

- The act of forecasting changes the outcome (markets, politics, viral tech).
- Definitions will not sit still (what counts as a “user,” an “EV,” a “war”).
- The interesting question is qualitative (who has power, which norm flips).
- A machine is producing the appearance of thought: dashboards, ensembles, and generated prose with no owner for the assumptions.

A model can be a prosthesis for arithmetic. It cannot be a substitute for choosing what matters.

## Specificity and certainty

Match mode to method:

| Mode | Honest product |
| --- | --- |
| Predictive | Point or range, dated, with error and a kill-criterion |
| Speculative | Alternative futures, drivers that distinguish them, signposts |

Too much certainty for an open system is a defect. So is a hedge so thick that no decision can attach. Pace of change must be stated: a year, a range, or a leading indicator — not “soon.”

## Alternative futures

Use scenarios when two or more structurally different worlds remain plausible. Good scenario work:

- Is not three flavors of the same official future (“base / upside / downside” on one knob).
- Names what would have to be true, not just what the index does.
- Gives the reader signposts to watch, so they can update without rereading the deck.
- Prefers being vaguely right (direction, couplings, options) over being exactly wrong (a TAM to two decimals in year 8).

Scenarios are not a dodge. They are the method when point forecasts pretend to know a path the system has not chosen.

## Output

```markdown
## Method
**Disclosed?** yes | partial | no
**Class:** judgment | trend | statistical / ML | simulation | scenarios | unnamed
**In lane for this question?** yes | no | mixed
**Mode:** predictive | speculative | confused
**Certainty vs openness:** too much | about right | too little
**Timing:** dated | ranged | hazy

## Use
What the method can support (range, signpost, option).
What it cannot (a single number to bet the firm on).
If scenarios are needed: the 2–4 futures worth tracking and the signposts.
```

## Traps

- Mistaking calibration on the past for validity on a shifted system.
- One “most likely” scenario that is just the official future in a nicer font.
- Letting a generator or a spreadsheet become the thinker of record.
- Throwing out quantitative work entirely. In-lane counting is still counting.

Better to be vaguely right than exactly wrong — and honest about which of those the method can deliver.
