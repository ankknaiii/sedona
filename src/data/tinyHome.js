/** Sedona tiny-home catalog — decorate to learn IGPO (English). */

export const ROOMS = [
  {
    id: "cabin",
    title: "Trailhead Cabin",
    goal: "Feel silent batches vs an alive signal.",
    unlockAt: 0,
    required: 3,
  },
  {
    id: "loft",
    title: "Switchback Loft",
    goal: "Learn turn-level elevation (information gain).",
    unlockAt: 3,
    required: 3,
  },
  {
    id: "study",
    title: "Summit Study",
    goal: "Compare the party, update, then verify.",
    unlockAt: 6,
    required: 3,
  },
];

/** 3D anchor points in room space (meters, y-up) */
export const ANCHORS = [
  { id: "floor-center", label: "Center floor", position: [0, 0.02, 0.2], kind: "floor" },
  { id: "floor-left", label: "Left floor", position: [-1.4, 0.02, 0.6], kind: "floor" },
  { id: "floor-right", label: "Right floor", position: [1.4, 0.02, 0.5], kind: "floor" },
  { id: "wall-left", label: "Left wall", position: [-2.35, 1.35, -0.2], kind: "wall" },
  { id: "wall-right", label: "Right wall", position: [2.35, 1.35, -0.1], kind: "wall" },
  { id: "window-ledge", label: "Window ledge", position: [0, 1.05, -2.35], kind: "ledge" },
  { id: "corner", label: "Corner nook", position: [1.7, 0.02, -1.5], kind: "floor" },
  { id: "hearth-spot", label: "Hearth alcove", position: [-1.6, 0.02, -1.6], kind: "floor" },
];

/**
 * signal: reward | penalty | mixed
 * igDelta: elevation change when placed on a preferred anchor
 * wrongDelta: when placed off-preferred
 */
export const CATALOG = [
  {
    id: "quiet-lantern",
    name: "Quiet Lantern",
    room: "cabin",
    color: "#6b615a",
    emissive: "#000000",
    shape: "lantern",
    preferred: ["window-ledge", "wall-left"],
    signal: "penalty",
    igDelta: -0.25,
    wrongDelta: -0.35,
    concept: "Silent batch",
    process: "outcome-collapse",
    lesson:
      "When every climb ends with the same summit score, the lantern goes cold. The batch has nothing left to teach.",
    how: "Outcome-only GRPO: tied rewards → advantage ≈ 0 → no policy gradient.",
  },
  {
    id: "copper-hearth",
    name: "Copper Hearth",
    room: "cabin",
    color: "#c08a5a",
    emissive: "#ffb070",
    shape: "hearth",
    preferred: ["hearth-spot", "floor-left"],
    signal: "reward",
    igDelta: 0.4,
    wrongDelta: 0.15,
    concept: "Alive signal",
    process: "process-alive",
    lesson:
      "The hearth keeps glowing when middle steps still differ—even if every summit photo looks the same.",
    how: "Process credit preserves a learning signal when final outcomes tie.",
  },
  {
    id: "trail-bench",
    name: "Overlook Bench",
    room: "cabin",
    color: "#8b6248",
    emissive: "#000000",
    shape: "bench",
    preferred: ["window-ledge", "floor-center"],
    signal: "reward",
    igDelta: 0.2,
    wrongDelta: 0.05,
    concept: "Think / plan",
    process: "think",
    lesson:
      "Before searching, the agent thinks. Sedona judges the hike by elevation at each switchback—not only the summit postcard.",
    how: "Action token: <think>…</think> then choose tool or answer.",
  },
  {
    id: "switchback-rug",
    name: "Switchback Rug",
    room: "loft",
    color: "#a47864",
    emissive: "#000000",
    shape: "rug",
    preferred: ["floor-center", "floor-right"],
    signal: "reward",
    igDelta: 0.35,
    wrongDelta: 0.1,
    concept: "Tool call turn",
    process: "tool",
    lesson:
      "Each curve is a search turn: the place where process reward is computed.",
    how: "Action token: <tool_call>…</tool_call> — then measure IG after the response.",
  },
  {
    id: "elevation-gauge",
    name: "Elevation Gauge",
    room: "loft",
    color: "#d8b48a",
    emissive: "#c08a5a",
    shape: "gauge",
    preferred: ["wall-right", "wall-left"],
    signal: "reward",
    igDelta: 0.3,
    wrongDelta: 0.1,
    concept: "Process reward IG",
    process: "ig",
    lesson:
      "THIS is the process reward: belief in the ground-truth answer before vs after a search step.",
    how: "IG_t = P(GT | context_t) − P(GT | context_t−1) under teacher forcing.",
  },
  {
    id: "weather-chest",
    name: "Weather Chest",
    room: "loft",
    color: "#5a3d30",
    emissive: "#000000",
    shape: "chest",
    preferred: ["corner", "floor-right"],
    signal: "mixed",
    igDelta: 0.25,
    wrongDelta: -0.1,
    concept: "Masked tool response",
    process: "weather",
    lesson:
      "Tool replies are canyon weather. Store them—do not train the policy to copy the storm.",
    how: "Environment tokens in <tool_response> are masked from the loss.",
  },
  {
    id: "party-chairs",
    name: "Party of Chairs",
    room: "study",
    color: "#b88968",
    emissive: "#000000",
    shape: "chairs",
    preferred: ["floor-center", "floor-left"],
    signal: "reward",
    igDelta: 0.3,
    wrongDelta: 0.1,
    concept: "Group advantage",
    process: "group",
    lesson:
      "Same trail, several hikers. Rank process+outcome scores inside the group—no critic network.",
    how: "Separate z-norm on IG vs F1, then Ã_t = discounted turn advantages.",
  },
  {
    id: "ridge-map",
    name: "Ridge Map",
    room: "study",
    color: "#efe6dc",
    emissive: "#000000",
    shape: "map",
    preferred: ["wall-left", "wall-right"],
    signal: "reward",
    igDelta: 0.25,
    wrongDelta: 0.05,
    concept: "Full train loop",
    process: "loop",
    lesson:
      "Roll out → score process IG + outcome F1 → compare → clipped update.",
    how: "IGPO objective (paper Eqs. 3–8) on a verification-scale stack.",
  },
  {
    id: "summit-scope",
    name: "Summit Scope",
    room: "study",
    color: "#2a211c",
    emissive: "#d8b48a",
    shape: "scope",
    preferred: ["window-ledge", "corner"],
    signal: "reward",
    igDelta: 0.35,
    wrongDelta: 0.1,
    concept: "Outcome + verify",
    process: "answer",
    lesson:
      "Outcome reward lands on the final assistant answer. Then verify on a held-out overlook.",
    how: "r_T = F1 (or format penalty). Eval: F1 / EM / collapse / mean |IG|.",
  },
];

export const STORAGE_KEY = "sedona-tiny-home-3d-v1";

export function computePlacementScore(item, anchorId) {
  const preferred = item.preferred?.includes(anchorId);
  const delta = preferred ? item.igDelta : item.wrongDelta;
  return {
    delta,
    preferred: !!preferred,
    kind: delta >= 0 ? "reward" : "penalty",
  };
}
