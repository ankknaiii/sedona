/**
 * Toolkit = boxes from the IGPO training / eval architecture.
 * The tiny home is the sandbox agent — not a riddle.
 */

export const ZONES = [
  {
    id: "data",
    title: "1 · Data",
    subtitle: "Inputs to the trainer",
    hint: "QA offline / eval + retrieval corpus",
    x: 4,
    y: 8,
    w: 28,
    h: 22,
  },
  {
    id: "rollout",
    title: "2 · Multi-turn Rollout × G",
    subtitle: "Sandbox agent loop",
    hint: "Policy · think / tool_call / answer · masked tool_response",
    x: 36,
    y: 6,
    w: 58,
    h: 36,
  },
  {
    id: "reward",
    title: "3 · Reward Construction",
    subtitle: "Process + outcome scores",
    hint: "IG_t and r_T = F1 / format penalty",
    x: 4,
    y: 36,
    w: 44,
    h: 28,
  },
  {
    id: "advantage",
    title: "4 · Advantage",
    subtitle: "Group-relative credit",
    hint: "Separate z-norm · discounted Ã_t",
    x: 52,
    y: 46,
    w: 42,
    h: 22,
  },
  {
    id: "optim",
    title: "5 · Optimization",
    subtitle: "Update the policy",
    hint: "PPO/GRPO clip · ppo_epochs · KL to base",
    x: 4,
    y: 70,
    w: 44,
    h: 24,
  },
  {
    id: "eval",
    title: "6 · Eval loop",
    subtitle: "Inference / effect metrics",
    hint: "Scorer · F1/EM/collapse/IG · badcase → iterate",
    x: 52,
    y: 72,
    w: 42,
    h: 22,
  },
];

/** Toolkit parts — beautiful furniture that maps to IGPO modules */
export const TOOLKIT = [
  {
    id: "qa-data",
    furniture: "Trail Journal",
    name: "QA offline / eval",
    shape: "journal",
    accent: "#8b6248",
    tokenCost: 30,
    zone: "data",
    repo: "igpo/data/qa_offline.jsonl · qa_eval.jsonl",
    clueTag: "Clue · Beginning",
    clue: "A notebook that already knows the answers—and pretends not to.",
    whisper:
      "Some pages are for practice walks. Others stay sealed until judgment day.",
    about:
      "Question–answer pairs with ground truth. Train split for rollouts; held-out eval for honest scoring.",
    metrics: { dataReady: 1 },
  },
  {
    id: "corpus",
    furniture: "Canyon Bookcase",
    name: "Offline Retrieval Corpus",
    shape: "bookcase",
    accent: "#6f4f40",
    tokenCost: 40,
    zone: "data",
    repo: "igpo/env/mock_kb.py",
    clueTag: "Clue · Memory",
    clue: "A shelf of borrowed winds. Pull one volume, and the room remembers a place you have never been.",
    whisper: "Not the open web—just a private canyon of searchable pages.",
    about:
      "Searchable document store used instead of a paid web API. Optional noise approximates imperfect retrieval.",
    metrics: { retrievalReady: 1 },
  },
  {
    id: "policy-lora",
    furniture: "Copper Desk Lamp",
    name: "Policy πθ + LoRA",
    shape: "lamp",
    accent: "#c08a5a",
    tokenCost: 55,
    zone: "rollout",
    repo: "igpo/train/trainer.py · PEFT LoRA",
    clueTag: "Clue · Self",
    clue: "The little light that learns. It does not rebuild the whole house—only the glow that chooses the next step.",
    whisper: "A LoRA adapter: small, trainable, and stubbornly curious.",
    about:
      "The actor being trained. Samples multi-turn trajectories; adapters keep single-GPU training feasible.",
    metrics: { policyReady: 1 },
  },
  {
    id: "think-tool-answer",
    furniture: "Three Clay Bowls",
    name: "think / tool_call / answer",
    shape: "bowls",
    accent: "#a47864",
    tokenCost: 35,
    zone: "rollout",
    repo: "igpo/agent/prompts.py · rollout.py",
    clueTag: "Clue · Choice",
    clue: "Three bowls, three destinies—ponder, reach out, or speak the ending. Never all at once.",
    whisper: "Each turn, the agent may only fill one.",
    about:
      "Legal action space each turn: plan, call search, or submit a final answer. Mutual exclusivity keeps credit clean.",
    metrics: { actionsReady: 1 },
  },
  {
    id: "web-search",
    furniture: "Field Telescope",
    name: "Function Call · web_search",
    shape: "telescope",
    accent: "#7a6558",
    tokenCost: 45,
    zone: "rollout",
    repo: "igpo/agent/rollout.py · env/mock_kb.py",
    clueTag: "Clue · Reach",
    clue: "Point it at the bookcase, and distant ink becomes near.",
    whisper: "A tool call—here it searches the offline corpus, not a paid sky.",
    about:
      "Tool the policy may invoke. In this stack it hits the offline corpus; official paper uses live search.",
    metrics: { toolReady: 1 },
  },
  {
    id: "tool-mask",
    furniture: "Linen Screen",
    name: "tool_response (masked)",
    shape: "screen",
    accent: "#d8b48a",
    tokenCost: 40,
    zone: "rollout",
    repo: "rollout TurnRecord.is_decision · trainer mask",
    clueTag: "Clue · Veil",
    clue: "What returns from the shelf must be seen—but never imitated. The screen keeps the lesson honest.",
    whisper: "Tool text is masked from the loss. The lamp learns decisions, not weather reports.",
    about:
      "Environment text returned to the agent. Masked from the loss so the policy does not imitate the tool.",
    metrics: { maskReady: 1 },
  },
  {
    id: "ig-reward",
    furniture: "Elevation Gauge",
    name: "IG_t = P(GT)_t − P(GT)_{t−1}",
    shape: "gauge",
    accent: "#c08a5a",
    tokenCost: 50,
    zone: "reward",
    repo: "igpo/rewards/info_gain.py",
    clueTag: "Clue · Ascent",
    clue: "It does not ask if you reached the summit. It asks: did this switchback lift you closer to the truth?",
    whisper: "Information gain—the process reward between turns.",
    about:
      "Process reward via teacher forcing: did this search turn raise belief in the ground-truth answer?",
    metrics: { igReady: 1, meanAbsIg: 0.22 },
  },
  {
    id: "f1-reward",
    furniture: "Summit Seal",
    name: "r_T = F1 or format penalty",
    shape: "seal",
    accent: "#b55b4a",
    tokenCost: 45,
    zone: "reward",
    repo: "igpo/rewards/f1.py",
    clueTag: "Clue · Verdict",
    clue: "Pressed only at the end. A clean answer earns the mark; a broken form is refused at the gate.",
    whisper: "Outcome reward: F1—or a format penalty if the ritual is wrong.",
    about:
      "Outcome reward on the last assistant answer. Illegal think/tool/answer format gets a fixed penalty (−2).",
    metrics: { f1Ready: 1, meanF1: 0.48 },
  },
  {
    id: "group-znorm",
    furniture: "Balance Scale",
    name: "Group z-norm (separate IG / F1)",
    shape: "scale",
    accent: "#9a7b66",
    tokenCost: 40,
    zone: "advantage",
    repo: "igpo/advantage/turn_level.py",
    clueTag: "Clue · Fairness",
    clue: "Among companions who walked the same trail, weigh ascent and summit on separate pans—so neither drowns the other.",
    whisper: "Group z-norm, process and outcome kept apart.",
    about:
      "Inside one query’s G rollouts, normalize process and outcome rewards separately so scales do not drown each other.",
    metrics: { normReady: 1, collapse: 0.18 },
  },
  {
    id: "discount-adv",
    furniture: "Hourglass",
    name: "Ã_t = Σ γ^{k−t} A_k",
    shape: "hourglass",
    accent: "#d8b48a",
    tokenCost: 40,
    zone: "advantage",
    repo: "discounted_turn_advantages · gamma=0.95",
    clueTag: "Clue · Echo",
    clue: "Credit trickles backward through time. A good step today still hears tomorrow’s applause—softly, then softer.",
    whisper: "Discounted turn-level advantage. γ keeps the future from shouting.",
    about:
      "Turn-level advantage: credit from this step through the future, discounted. Gives multi-turn search temporal structure.",
    metrics: { advReady: 1 },
  },
  {
    id: "ppo-clip",
    furniture: "Forge Clamps",
    name: "PPO/GRPO clip × ppo_epochs",
    shape: "clamps",
    accent: "#6f4f40",
    tokenCost: 50,
    zone: "optim",
    repo: "igpo/algo/losses.py · trainer ppo_epochs",
    clueTag: "Clue · Temper",
    clue: "Hold the change, but do not twist the metal past its heat. Strike again on the same billet—gently, several times.",
    whisper: "PPO/GRPO clip across ppo_epochs. Restraint is the craft.",
    about:
      "Clipped surrogate updated for several epochs on the same batch so the clip actually constrains learning.",
    metrics: { optimReady: 1, clipfrac: 0.12, meanRatio: 1.02 },
  },
  {
    id: "kl-base",
    furniture: "Ballast Stone",
    name: "KL to frozen base",
    shape: "stone",
    accent: "#5c4a40",
    tokenCost: 35,
    zone: "optim",
    repo: "trainer ref logprobs · kl_coef",
    clueTag: "Clue · Anchor",
    clue: "A heavy kindness. Without it, the lamp drifts into beautiful nonsense.",
    whisper: "KL to the frozen base—stay near who you were.",
    about:
      "Regularize LoRA updates toward the frozen base policy so the agent does not drift into gibberish.",
    metrics: { klReady: 1 },
  },
  {
    id: "scorer",
    furniture: "Loupe Tray",
    name: "Scorer + metrics",
    shape: "loupe",
    accent: "#a47864",
    tokenCost: 40,
    zone: "eval",
    repo: "igpo/eval/evaluator.py",
    clueTag: "Clue · Appraisal",
    clue: "Under glass: F1, exact match, collapse, the mean breath of ascent. No training—only truth-telling.",
    whisper: "Held-out evaluation. The mirror that does not flatter.",
    about:
      "Held-out greedy evaluation. Tracks F1, EM, format, collapse rate, mean |IG|.",
    metrics: { evalReady: 1, meanEm: 0.36 },
  },
  {
    id: "badcase-loop",
    furniture: "Red Thread Spool",
    name: "Badcase → data / reward iterate",
    shape: "spool",
    accent: "#b55b4a",
    tokenCost: 45,
    zone: "eval",
    repo: "scripts/run_ablation.py · docs + metrics.jsonl",
    clueTag: "Clue · Return",
    clue: "Failures leave a scarlet thread. Follow it back to data, prompts, rewards—then begin the walk again.",
    whisper: "The effect loop: taxonomy → fix → another train step.",
    about:
      "Close the effect loop: taxonomy of failures feeds data mix, prompts, and reward fixes—then another train step.",
    metrics: { loopReady: 1 },
  },
];


/** Tokens = scarce cabin budget; mirrors LLM tokens burned in rollouts. */
export const TOKEN_RULES = {
  start: 1000,
  clueCost: 8,
  moveFree: true,
  correctBonus: 22,
  zoneBonus: 70,
  rolloutCost: 120,
  /** Return scales with architecture coverage after a simulated rollout */
  rolloutReturnMax: 220,
};

export const STORAGE_KEY = "sedona-trainer-cabin-v4";

export const METRIC_DEFS = [
  { key: "meanF1", label: "mean F1", orient: "h", max: 1 },
  { key: "meanEm", label: "mean EM", orient: "h", max: 1 },
  { key: "meanAbsIg", label: "mean |IG|", orient: "h", max: 0.5 },
  { key: "collapse", label: "collapse rate", orient: "v", max: 1, invert: true },
  { key: "meanRatio", label: "mean ratio", orient: "v", max: 2, center: 1 },
  { key: "clipfrac", label: "clipfrac", orient: "v", max: 0.5 },
];

const ZONE_WEIGHT = {
  data: 2,
  rollout: 4,
  reward: 2,
  advantage: 2,
  optim: 2,
  eval: 2,
};

export function emptyMetrics() {
  return {
    dataReady: 0,
    retrievalReady: 0,
    policyReady: 0,
    actionsReady: 0,
    toolReady: 0,
    maskReady: 0,
    igReady: 0,
    f1Ready: 0,
    normReady: 0,
    advReady: 0,
    optimReady: 0,
    klReady: 0,
    evalReady: 0,
    loopReady: 0,
    meanF1: 0.08,
    meanEm: 0.04,
    meanAbsIg: 0.02,
    collapse: 0.72,
    meanRatio: 0.7,
    clipfrac: 0,
  };
}

export function simulateMetrics(placements) {
  const m = emptyMetrics();
  const placed = Object.values(placements);
  for (const p of placed) {
    const tool = TOOLKIT.find((t) => t.id === p.id);
    if (!tool?.metrics) continue;
    for (const [k, v] of Object.entries(tool.metrics)) {
      if (k.endsWith("Ready")) m[k] = Math.max(m[k], v);
      else if (k === "collapse") m[k] = Math.min(m[k], v);
      else if (k === "meanRatio") m[k] = v;
      else m[k] = Math.max(m[k], v);
    }
  }

  // Synergy: fuller trainer → healthier simulated curves
  const completeness = scoreArchitecture(placements).coverage;
  m.meanF1 = Number(Math.min(0.92, m.meanF1 + completeness * 0.35).toFixed(2));
  m.meanEm = Number(Math.min(0.85, m.meanEm + completeness * 0.3).toFixed(2));
  m.meanAbsIg = Number(
    Math.min(0.45, m.meanAbsIg + completeness * 0.25).toFixed(2),
  );
  m.collapse = Number(
    Math.max(0.05, m.collapse - completeness * 0.55).toFixed(2),
  );
  if (m.optimReady) m.clipfrac = Math.max(m.clipfrac, 0.08);
  if (m.optimReady && m.maskReady) m.meanRatio = 1.01;
  return m;
}

export function scoreArchitecture(placements) {
  const byZone = Object.fromEntries(ZONES.map((z) => [z.id, []]));
  for (const p of Object.values(placements)) {
    const tool = TOOLKIT.find((t) => t.id === p.id);
    if (!tool) continue;
    const inRightZone = p.zoneId === tool.zone;
    byZone[tool.zone].push({ ...tool, inRightZone, zoneId: p.zoneId });
  }

  let earned = 0;
  let possible = 0;
  const checklist = [];

  for (const zone of ZONES) {
    const need = TOOLKIT.filter((t) => t.zone === zone.id);
    possible += ZONE_WEIGHT[zone.id];
    const got = need.filter((t) =>
      Object.values(placements).some((p) => p.id === t.id),
    );
    const correct = got.filter((t) =>
      Object.values(placements).some(
        (p) => p.id === t.id && p.zoneId === zone.id,
      ),
    );
    const ratio = need.length ? correct.length / need.length : 0;
    earned += ZONE_WEIGHT[zone.id] * ratio;
    checklist.push({
      zone: zone.id,
      title: zone.title,
      have: got.length,
      need: need.length,
      correct: correct.length,
      ok: correct.length === need.length,
    });
  }

  const coverage = possible ? earned / possible : 0;
  const misplaced = Object.values(placements).filter((p) => {
    const tool = TOOLKIT.find((t) => t.id === p.id);
    return tool && p.zoneId !== tool.zone;
  }).length;

  const finalScore = Math.round(
    Math.max(0, coverage * 100 - misplaced * 4),
  );

  return {
    coverage,
    finalScore,
    checklist,
    misplaced,
    placedCount: Object.keys(placements).length,
    totalParts: TOOLKIT.length,
  };
}

export function zoneAt(xPct, yPct) {
  return (
    ZONES.find(
      (z) =>
        xPct >= z.x &&
        xPct <= z.x + z.w &&
        yPct >= z.y &&
        yPct <= z.y + z.h,
    ) || null
  );
}
