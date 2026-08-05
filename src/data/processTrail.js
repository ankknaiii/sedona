/**
 * Explicit IGPO process objects — the missing "process things".
 * These are first-class game mechanics, not only furniture metaphors.
 */

export const PROCESS_STEPS = [
  {
    id: "think",
    label: "Think",
    title: "<think>",
    kind: "action",
    blurb: "The agent plans the next climb—what to search, or whether to answer.",
    unlockItem: "trail-bench",
  },
  {
    id: "tool",
    label: "Tool call",
    title: "<tool_call>",
    kind: "action",
    blurb: "A search step. This is where process credit is earned or lost.",
    unlockItem: "switchback-rug",
  },
  {
    id: "weather",
    label: "Tool response",
    title: "<tool_response>",
    kind: "env",
    blurb: "Canyon weather—environment text. Masked from the loss (not learned as policy).",
    unlockItem: "weather-chest",
  },
  {
    id: "ig",
    label: "Info gain",
    title: "IG_t = ΔP(GT)",
    kind: "process-reward",
    blurb: "Process reward: did belief in the ground-truth answer rise after this step?",
    unlockItem: "elevation-gauge",
  },
  {
    id: "answer",
    label: "Answer",
    title: "<answer>",
    kind: "action",
    blurb: "Summit attempt. Outcome F1 / format penalty lands here—not on tool text.",
    unlockItem: "summit-scope",
  },
  {
    id: "group",
    label: "Group norm",
    title: "GRPO / Ã_t",
    kind: "optimize",
    blurb: "Compare several climbs of the same query; discount turn advantages; clip update.",
    unlockItem: "party-chairs",
  },
];

/** Demo climb shown once process pieces unlock — concrete IGPO numbers */
export const DEMO_CLIMB = {
  question: "Who directed the film whose lead was born in 1956 in Kentucky?",
  turns: [
    {
      id: "t1",
      role: "think+tool",
      text: "Search: actor born 1956 Kentucky",
      beliefBefore: 0.18,
      beliefAfter: 0.22,
      ig: 0.04,
      tag: "process reward (+)",
    },
    {
      id: "t2",
      role: "think+tool",
      text: "Refine search: 1956 Kentucky lead → film → director",
      beliefBefore: 0.22,
      beliefAfter: 0.61,
      ig: 0.39,
      tag: "process reward (++)",
    },
    {
      id: "t3",
      role: "answer",
      text: "Final answer submitted",
      beliefBefore: 0.61,
      beliefAfter: 0.61,
      ig: null,
      f1: 1.0,
      tag: "outcome reward",
    },
  ],
};

export function processUnlocked(placements, catalog) {
  const placedIds = new Set(Object.values(placements));
  return PROCESS_STEPS.map((step) => ({
    ...step,
    unlocked: placedIds.has(step.unlockItem),
    itemName: catalog.find((c) => c.id === step.unlockItem)?.name ?? step.unlockItem,
  }));
}
