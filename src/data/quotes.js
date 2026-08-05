/**
 * Narrative shelf for Sedona (English UI).
 * Books: Innovator's Dilemma · Only the Paranoid Survive · Positioning · We Are As Gods
 */

export const SHELF = [
  {
    book: "The Innovator's Dilemma",
    author: "Clayton M. Christensen",
    quotes: [
      {
        id: "id-1",
        text: "The very decision-making and resource-allocation processes that are key to the success of established companies are the very processes that reject disruptive technologies.",
        sedona:
          "Pipelines that only optimize final answer scores will reject process-elevation signals—the quiet innovation Sedona ships.",
      },
      {
        id: "id-2",
        text: "Listening carefully to customers and investing aggressively in better products of the sort they say they want can be fatal.",
        sedona:
          "Eval clients keep asking for higher end scores. Sedona serves what they have not yet asked for: whether middle steps still climb.",
      },
    ],
  },
  {
    book: "Only the Paranoid Survive",
    author: "Andrew S. Grove",
    quotes: [
      {
        id: "ops-1",
        text: "A strategic inflection point is a time in the life of a business when its fundamentals are about to change.",
        sedona:
          "When agents shift from one-shot answers to multi-turn search, training fundamentals change. Summit-only grading is no longer enough.",
      },
      {
        id: "ops-2",
        text: "Only the paranoid survive.",
        sedona:
          "Paranoia here means spotting silent batches—all-correct or all-wrong groups with zero gradient—before the GPU bill explodes.",
      },
    ],
  },
  {
    book: "Positioning",
    author: "Al Ries & Jack Trout",
    quotes: [
      {
        id: "pos-1",
        text: "Positioning is not what you do to a product. Positioning is what you do to the mind of the prospect.",
        sedona:
          "Sedona does not fight for “another RL framework.” It owns one mental slot: elevation gain / process credit.",
      },
      {
        id: "pos-2",
        text: "The essence of positioning is sacrifice. You must be willing to give up something in order to establish that unique position.",
        sedona:
          "We sacrifice paper-scale bragging rights for a sharper position: verification-grade, auditable, silent-batch visible.",
      },
    ],
  },
  {
    book: "We Are As Gods",
    author: "Peter H. Diamandis & Steven Kotler",
    note: "Epigraph lineage: Stewart Brand, Whole Earth Catalog (1968).",
    quotes: [
      {
        id: "god-1",
        text: "We are as gods and we might as well get good at it.",
        attribution: "Stewart Brand, 1968",
        sedona:
          "Agents bring god-like tool use. Competence is reading whether each step still approaches the truth.",
      },
      {
        id: "god-2",
        text: "Technology is giving us god-like powers; the question is whether our minds can keep up.",
        attribution: "Popular thematic paraphrase of the book’s core tension",
        sedona:
          "Multi-turn search is the power. Sedona is the cabin instrument panel a non-ML mind can scan.",
      },
    ],
  },
];

export const PULL = [
  {
    source: "Positioning",
    line: "Positioning is what you do to the mind of the prospect.",
    bridge: "Sedona = elevation gain in the mind.",
  },
  {
    source: "Only the Paranoid Survive",
    line: "A strategic inflection point is when fundamentals are about to change.",
    bridge: "Multi-turn tool-use already changed training.",
  },
  {
    source: "The Innovator's Dilemma",
    line: "The processes that make you succeed can reject the next disruption.",
    bridge: "Final-score pipelines reject process signal.",
  },
  {
    source: "We Are As Gods",
    line: "We are as gods and we might as well get good at it.",
    bridge: "Power is the agent; competence is each step’s climb.",
  },
];
