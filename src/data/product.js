export const PRODUCT = {
  name: "Sedona",
  fullName: "Sedona — elevation gain for search agents",
  engine: "IGPO",
  tagline: "Grade every switchback—not only the summit",
  category: "Post-train signal product",
  year: "2026",
  metaphorTitle: "Why Sedona",
  metaphor:
    "In Sedona, a trail is judged by elevation gain at each switchback—not only by whether you touched the summit. IGPO does the same for multi-turn search: each tool step is scored by whether it raised belief toward the right answer.",
  painPlain:
    "Training a search agent is expensive. If every try in a batch gets the same final score, the update teaches nothing—even when some middle steps were useful.",
  promisePlain:
    "Sedona makes process credit visible: see which steps gained elevation toward the truth, catch silent batches early, and keep GPU time attached to real learning.",
  valueHeadline: "What you get",
  values: [
    {
      title: "Stop silent batches",
      body: "When finals tie, Sedona still separates tries by step-level help—so the model keeps a gradient instead of a zero update.",
    },
    {
      title: "Credit the right steps",
      body: "Good searches mid-trail get rewarded even if the final answer later fails. Bad detours get marked before the summit.",
    },
    {
      title: "Verify before you scale",
      body: "Same IGPO math as the paper, as a single-GPU / Colab product you can audit, ablate, and show in one board.",
    },
  ],
};

export const LINKS = {
  github: "https://github.com/ankknaiii/igpo-agentic-search",
  colab:
    "https://colab.research.google.com/github/ankknaiii/igpo-agentic-search/blob/main/notebooks/train_igpo_colab.ipynb",
  paper: "https://arxiv.org/abs/2510.14967",
  official: "https://github.com/GuoqingWang1/IGPO",
};

export const PIPELINE = [
  { idx: "01", title: "Roll out", body: "Several climbs on the same trail" },
  { idx: "02", title: "Score", body: "Elevation gain + summit grade" },
  { idx: "03", title: "Compare", body: "Who gained more inside the party?" },
  { idx: "04", title: "Update", body: "Nudge the hiker—ignore weather text" },
];

export const STACK = [
  ["Engine", "IGPO · GRPO baseline switch"],
  ["Policy", "Qwen2.5-Instruct 0.5B–3B + LoRA"],
  ["Retrieval", "Offline corpus · optional noise"],
  ["Eval", "Held-out F1 / EM / collapse / mean |IG|"],
  ["Runtime", "Single GPU · one-click Colab"],
];
