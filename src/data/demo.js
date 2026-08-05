export const LINKS = {
  github: "https://github.com/ankknaiii/igpo-agentic-search",
  colab:
    "https://colab.research.google.com/github/ankknaiii/igpo-agentic-search/blob/main/notebooks/train_igpo_colab.ipynb",
  paper: "https://arxiv.org/abs/2510.14967",
  official: "https://github.com/GuoqingWang1/IGPO",
};

export const PIPELINE = [
  {
    idx: "01",
    title: "Roll out G trajectories",
    body: "Same question, multiple multi-turn search traces: think → tool_call or answer. Tool responses are kept out of the loss.",
  },
  {
    idx: "02",
    title: "Score process + outcome",
    body: "Each search turn earns information gain from the change in teacher-forced P(GT | context). The final turn earns answer F1 (or a format penalty).",
  },
  {
    idx: "03",
    title: "Group-relative advantages",
    body: "Normalize IG and F1 separately inside the group, then discount into turn-level advantages. No critic network.",
  },
  {
    idx: "04",
    title: "Clipped policy update",
    body: "PPO-style clip over multiple epochs on LoRA adapters, using the original sampled token ids so importance ratios stay valid.",
  },
];

export const STACK = [
  ["Objective", "IGPO / GRPO (ICLR 2026 core Eqs. 3–8)"],
  ["Policy", "Qwen2.5-Instruct 0.5B–3B + LoRA"],
  ["Retrieval", "Offline corpus (+ optional noise), no paid search API"],
  ["Eval", "Held-out greedy decode · F1 / EM / collapse / mean |IG|"],
  ["Compute", "Single GPU / Colab T4 verification stack"],
];

/** Stylized walkthrough for the interactive demo (illustrative numbers). */
export const ROLLOUT = {
  question: "Who directed the film whose lead actor was born in 1956 in Kentucky?",
  turns: [
    {
      id: "t0",
      label: "Belief · before search",
      role: "system",
      text: "P(GT | context) estimated under teacher forcing.",
      belief: 0.18,
      ig: null,
    },
    {
      id: "t1",
      label: "Turn 1 · tool_call",
      role: "assistant",
      text: `<think>
Need the actor born in 1956 in Kentucky, then the film and director.
</think>
<tool_call>
{"name":"web_search","arguments":{"query":"actor born 1956 Kentucky"}}
</tool_call>`,
      belief: 0.22,
      ig: 0.04,
    },
    {
      id: "t2",
      label: "Turn 1 · tool_response",
      role: "tool",
      text: `[doc] Johnny Depp — born June 9, 1963, Owensboro, Kentucky.
[doc] George Clooney — born May 6, 1961, Lexington, Kentucky.`,
      belief: 0.22,
      ig: null,
    },
    {
      id: "t3",
      label: "Turn 2 · tool_call",
      role: "assistant",
      text: `<think>
Dates do not match 1956. Refine the query.
</think>
<tool_call>
{"name":"web_search","arguments":{"query":"American actor born 1956 Kentucky film director"}}
</tool_call>`,
      belief: 0.61,
      ig: 0.39,
    },
    {
      id: "t4",
      label: "Turn 2 · tool_response",
      role: "tool",
      text: `[doc] Tom Cruise was born July 3, 1962.
[doc] Related hit: filmography notes for a 1956 Kentucky-born lead…`,
      belief: 0.61,
      ig: null,
    },
    {
      id: "t5",
      label: "Turn 3 · answer",
      role: "assistant",
      text: `<think>
Enough evidence to answer.
</think>
<answer>
Example Director
</answer>`,
      belief: 0.61,
      ig: null,
      outcomeF1: 1.0,
    },
  ],
};

export const GROUP_COMPARE = {
  grpo: {
    title: "Outcome-only GRPO",
    outcomes: [1, 1, 1, 1],
    note: "Easy query · all rollouts correct · group advantage collapses to 0 · no learning signal.",
  },
  igpo: {
    title: "IGPO",
    outcomes: [1, 1, 1, 1],
    igMeans: [0.12, 0.31, 0.05, 0.27],
    note: "Same final outcomes, but turn-level information gain still differs across rollouts · advantages remain informative.",
  },
};
