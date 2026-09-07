---
name: forecast-complexity
description: Test whether a forecast respects interconnected systems, feedback, triggers, and tipping points. Use when a prediction changes one variable and holds the world still, assumes exponential takeoff, ignores second-order effects, or the user asks what else would move if this claim were true.
icon: git-branch
color: magenta
metadata:
  framework: future-savvy-forecast-filtering
  chapter: "7"
---

# Complexity in forecasts

The world is coupled. Changing one element changes others, often on a delay, often in a direction nobody put in the slide. A forecast that moves one celebrated variable and freezes everything else is a story, not a system.

If the user wants a full filter after this, continue with [../forecast-filter/SKILL.md](../forecast-filter/SKILL.md).

## What “interconnected” demands

For the core claim, name:

1. **Direct effect** — the intended move (price down, model better, rule passed).
2. **Second-order** — who reacts (competitors, regulators, users, complementors, spoilsports).
3. **Feedback** — whether those reactions reinforce, dampen, or invert the first move.
4. **Delay** — what lands this year vs after capital stock, law, or culture turns over.
5. **Cross-scale** — local win that becomes global mess, or the reverse.

If the author cannot spend a paragraph on (2)–(4), they have not modeled change. They have modeled a knob.

## Accelerators and derailers

Ask what could **speed** the stated future and what could **knock it off**.

- Triggers: a war, a standard, a price spike, a court case, a platform opening its API.
- Tipping points: a share at which the complement becomes default, or a norm flips.
- Bottlenecks: talent, energy, permitting, rare inputs, trust, last-mile behavior.

A serious forecast names both a path and the off-ramps. “And then it takes off” is not a trigger.

## Exponential language

Exponential claims need a reason the doubling continues (network effect, learning curve still steep, unconstrained complement) and a reason it stops (saturation, congestion, regulation, scarcity, backlash).

If the chart is a hockey stick with no S-curve in sight, mark complexity `fail` for the magnitude even if the direction is plausible.

## Oversimplification tells

- One cause, one effect, one date.
- Ceteris paribus used as a lifestyle, not as a temporary scaffold.
- No enemies, no copycats, no regulators.
- Users portrayed as a homogeneous mass.
- The rest of the stack (payments, logistics, law, identity, maintenance) assumed to appear on time.

## Output

```markdown
## System
**Knob the forecast turns:** …
**What else would have to move:** …
**Feedback (reinforce / dampen / invert):** …
**Delays:** …
**Triggers and tipping points:** named | missing
**Derailers:** named | missing
**Growth shape:** linear | S-curve | unconstrained exponential | unspecified

## Use
Which couplings you will keep in the mental model.
Which “and nothing else changes” clauses you will discard.
A cheap probe (indicator) for whether second-order effects are arriving.
```

## Traps

- Adding complexity theater (buzzword diagrams) without naming a single feedback loop.
- Refusing to forecast at all because “everything is complex.” Filter for neglected couplings; still extract directional value.
- Treating surprise as proof the world is random. Often the coupling was visible and ignored.

When one element changes, ask “what else becomes true?” If the piece has no answer, you supply it or you drop the magnitude.
