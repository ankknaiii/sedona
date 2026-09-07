---
name: forecast-data-quality
description: Stress-test the data and evidence inside a forecast. Use when the user questions numbers, sources, TAM, surveys, government stats, recycled charts, stale figures, or whether a cited number is a measurement or a prior projection.
icon: beaker
color: green
metadata:
  framework: future-savvy-forecast-filtering
  chapter: "2"
---

# Forecast data quality

Erode unearned confidence in data. A cited number is not automatically a fact, a fact is not automatically relevant, and a relevant fact does not automatically travel into the future.

If the user wants a full filter after this, continue with [../forecast-filter/SKILL.md](../forecast-filter/SKILL.md).

## Stance

Forecasts fail from bad inputs as often as from bad imagination. The task is not “find a statistic.” It is “find whether this statistic can carry this claim.”

Prefer a smaller, well-defined series over a large, vague TAM. Prefer a dated primary source over a compelling secondary recap.

## Tests

Run in order. Stop treating a number as load-bearing when it fails a test; you may still use it as color.

1. **Fitness.** Does the series measure the same thing the claim names (definition, unit, geography, population)? “Users” vs “paying users” vs “downloads” is a typical mismatch.
2. **Extent.** Is there enough history and enough coverage to support the leap being asked of it?
3. **Recency.** Could the mechanism have moved since the last observation? In fast categories, last year’s census is already a story about the past.
4. **Provenance.** Primary collection, administrative data, or a secondary restatement of someone else’s slide? Each hop adds spin and rounding.
5. **Observation vs projection.** Is this a measurement, a model output, or a goal? Projections that get re-cited as “the market is $X” are a standard laundering move.
6. **Construction.** Sampling, missingness, seasonal effects, revisions, vendor-sponsored collection, survivorship.
7. **Comparability.** Did the category, accounting rule, or product definition change under the time series?
8. **Independence.** Do three citations collapse to one original table?

When a source is missing, mark `unknown` and cap confidence. Do not invent a dataset to complete the vibe.

## What “good enough” means

Data quality is relative to the decision:

- Ambient awareness: a directional, slightly stale secondary source can be enough.
- Resource commitment: you need definitions, dates, and a path to the original.
- Irreversible bet: you need primary or audited series plus a stated error band.

Say which tier the evidence supports. Do not upgrade the tier because the slide is pretty.

## Output

```markdown
## Data
**Load-bearing numbers:** list each, with unit, date, geography, source
**Observation or projection?** for each
**Fitness:** pass / fail / unknown
**Recency:** pass / fail / unknown
**Provenance:** primary | secondary | unknown
**Independence:** distinct sources | duplicated | unknown

## Use
Which numbers may inform the claim. Which must be treated as decoration.
What to fetch next if the decision is real.
```

## Traps

- Spreadsheet precision as a substitute for definitional honesty.
- Mixing real consumption data with addressable-market fiction in one chart.
- Using a global figure for a local decision (or the reverse).
- Trusting a number because it is government-issued or consultant-issued. Ask the same questions of both.

If you cannot say what was counted, when, and by whom, you do not have data. You have rhetoric with digits.
