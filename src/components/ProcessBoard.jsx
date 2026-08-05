import { motion } from "framer-motion";
import { CATALOG } from "../data/tinyHome";
import { DEMO_CLIMB, processUnlocked } from "../data/processTrail";

export default function ProcessBoard({
  placements,
  play = () => {},
  onFocusItem,
}) {
  const steps = processUnlocked(placements, CATALOG);
  const unlockedCount = steps.filter((s) => s.unlocked).length;
  const ready = unlockedCount >= 4;

  return (
    <section className="process-board">
      <header className="process-board-head">
        <div>
          <p className="kicker">IGPO process layer</p>
          <h2>Where the process things live</h2>
        </div>
        <span className="process-count">
          {unlockedCount}/{steps.length} process nodes unlocked
        </span>
      </header>

      <p className="process-intro">
        Furniture alone is not IGPO. IGPO is this chain:{" "}
        <strong>think → tool → (masked) response → information gain → answer → group
        advantage</strong>
        . Place the matching piece to light each node, then watch a demo climb
        score process rewards turn by turn.
      </p>

      <div className="process-nodes">
        {steps.map((step, i) => (
          <motion.button
            key={step.id}
            type="button"
            className={`process-node kind-${step.kind} ${step.unlocked ? "is-on" : "is-off"}`}
            whileHover={step.unlocked ? { y: -3 } : {}}
            onClick={() => {
              if (!step.unlocked) {
                play("silent");
                return;
              }
              play("tick");
              onFocusItem?.(step.unlockItem);
            }}
          >
            <span className="node-idx">0{i + 1}</span>
            <strong>{step.label}</strong>
            <code>{step.title}</code>
            <p>{step.blurb}</p>
            <em>
              {step.unlocked
                ? `Lit by ${step.itemName}`
                : `Place ${step.itemName} to unlock`}
            </em>
          </motion.button>
        ))}
      </div>

      <div className={`climb-panel ${ready ? "is-ready" : ""}`}>
        <div className="climb-head">
          <h3>Process climb (demo trajectory)</h3>
          <span>{ready ? "Live" : "Locked — unlock ≥4 process nodes"}</span>
        </div>
        <p className="climb-q">{DEMO_CLIMB.question}</p>
        <div className="climb-turns">
          {DEMO_CLIMB.turns.map((turn) => (
            <article
              key={turn.id}
              className={`climb-turn ${ready ? "" : "is-dim"}`}
            >
              <header>
                <span>{turn.role}</span>
                <strong className={turn.ig != null && turn.ig >= 0 ? "pos" : ""}>
                  {turn.ig != null
                    ? `IG ${turn.ig >= 0 ? "+" : ""}${turn.ig.toFixed(2)}`
                    : turn.f1 != null
                      ? `F1 ${turn.f1.toFixed(1)}`
                      : "—"}
                </strong>
              </header>
              <p>{turn.text}</p>
              <div className="belief-mini">
                <span>P(GT)</span>
                <div className="bar">
                  <span
                    style={{
                      width: `${(ready ? turn.beliefAfter : 0) * 100}%`,
                    }}
                  />
                </div>
                <span>
                  {ready
                    ? `${turn.beliefBefore.toFixed(2)} → ${turn.beliefAfter.toFixed(2)}`
                    : "···"}
                </span>
              </div>
              <small>{turn.tag}</small>
            </article>
          ))}
        </div>
        {ready && (
          <p className="climb-sum">
            Process rewards: +0.04 then +0.39 (middle steps credited). Outcome
            reward: F1=1.0 on the final assistant answer—not on tool weather.
          </p>
        )}
      </div>
    </section>
  );
}
