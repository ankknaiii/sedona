import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { computeGroupAdvantages } from "../lib/advantage";
import SignalRing from "./SignalRing";

const PRESETS = {
  collapse: {
    label: "Easy collapse",
    gamma: 0.95,
    rollouts: [
      { infoGains: [0.02, 0.01], outcome: 1 },
      { infoGains: [0.08, 0.12], outcome: 1 },
      { infoGains: [0.03, 0.04], outcome: 1 },
      { infoGains: [0.15, 0.09], outcome: 1 },
    ],
  },
  mixed: {
    label: "Mixed quality",
    gamma: 0.95,
    rollouts: [
      { infoGains: [0.2, -0.05], outcome: 0.4 },
      { infoGains: [0.05, 0.25], outcome: 1 },
      { infoGains: [-0.1, 0.02], outcome: 0 },
      { infoGains: [0.12, 0.18], outcome: 0.8 },
    ],
  },
  hard: {
    label: "Hard all-wrong",
    gamma: 0.95,
    rollouts: [
      { infoGains: [0.1, -0.02], outcome: 0 },
      { infoGains: [-0.05, 0.01], outcome: 0 },
      { infoGains: [0.18, 0.06], outcome: 0 },
      { infoGains: [0.0, -0.08], outcome: 0 },
    ],
  },
};

function format(n) {
  if (Math.abs(n) < 1e-9) return "0.00";
  return (n >= 0 ? "+" : "") + n.toFixed(2);
}

export default function SignalLab({ play = () => {} }) {
  const [preset, setPreset] = useState("collapse");
  const [gamma, setGamma] = useState(0.95);
  const [normMode, setNormMode] = useState("separate");
  const [outcomeOnly, setOutcomeOnly] = useState(false);
  const [rollouts, setRollouts] = useState(PRESETS.collapse.rollouts);

  const results = useMemo(
    () =>
      computeGroupAdvantages(rollouts, {
        gamma,
        normMode,
        outcomeOnly,
      }),
    [rollouts, gamma, normMode, outcomeOnly],
  );

  const allCollapsed = results.every((r) => r.collapse);
  const health = allCollapsed ? 0.08 : 0.76;
  const maxAbs = Math.max(
    0.01,
    ...results.flatMap((r) => r.advantages.map((a) => Math.abs(a))),
  );

  function applyPreset(key) {
    const p = PRESETS[key];
    setPreset(key);
    setGamma(p.gamma);
    setOutcomeOnly(false);
    setRollouts(p.rollouts.map((r) => ({ ...r, infoGains: [...r.infoGains] })));
    play("tick");
  }

  function updateGain(ri, gi, value) {
    setPreset("custom");
    setRollouts((prev) =>
      prev.map((r, i) =>
        i !== ri
          ? r
          : {
              ...r,
              infoGains: r.infoGains.map((g, j) =>
                j === gi ? Number(value) : g,
              ),
            },
      ),
    );
  }

  function updateOutcome(ri, value) {
    setPreset("custom");
    setRollouts((prev) =>
      prev.map((r, i) => (i !== ri ? r : { ...r, outcome: Number(value) })),
    );
  }

  return (
    <section id="lab">
      <div className="section-inner">
        <div className="section-head">
          <p className="kicker">Summit lab · strategy sandbox</p>
          <h2>Tune the party. Wake the campfire.</h2>
          <p className="lede">
            Edit process help and final grades. Copper = learning. Dusty quiet =
            silent batch. Sounds chirp only when you touch a control.
          </p>
        </div>

        <div className="lab-shell">
          <div className="lab-glance-row">
            <SignalRing
              state={allCollapsed ? "silent" : "learning"}
              value={health}
              label={allCollapsed ? "Silent" : "Learning"}
              caption="live batch"
              size={150}
            />
            <div>
              <motion.div
                className={`lab-status ${allCollapsed ? "is-collapse" : "is-alive"}`}
                key={`${outcomeOnly}-${allCollapsed}`}
                initial={{ opacity: 0.5, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {allCollapsed
                  ? "Silent batch — no policy gradient from this group."
                  : "Signal alive — rollouts stay distinguishable after normalization."}
              </motion.div>
              <p className="lab-hint" style={{ marginTop: "0.75rem" }}>
                Tip: load Easy collapse → Outcome only (quiet) → Sedona (campfire wakes).
              </p>
            </div>
          </div>

          <div className="lab-controls">
            <div className="lab-row">
              <span className="lab-label">Preset</span>
              <div className="chip-row">
                {Object.entries(PRESETS).map(([key, p]) => (
                  <button
                    key={key}
                    type="button"
                    className="chip"
                    aria-pressed={preset === key}
                    onClick={() => applyPreset(key)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="lab-row">
              <span className="lab-label">Signal</span>
              <div className="mode-toggle">
                <button
                  type="button"
                  aria-pressed={outcomeOnly}
                  onClick={() => {
                    setOutcomeOnly(true);
                    play("silent");
                  }}
                >
                  Outcome only
                </button>
                <button
                  type="button"
                  aria-pressed={!outcomeOnly}
                  onClick={() => {
                    setOutcomeOnly(false);
                    play("alive");
                  }}
                >
                  Sedona
                </button>
              </div>
            </div>

            <div className="lab-row">
              <span className="lab-label">Norm</span>
              <div className="mode-toggle">
                <button
                  type="button"
                  aria-pressed={normMode === "separate"}
                  onClick={() => {
                    setNormMode("separate");
                    play("tick");
                  }}
                  disabled={outcomeOnly}
                >
                  Separate
                </button>
                <button
                  type="button"
                  aria-pressed={normMode === "joint"}
                  onClick={() => {
                    setNormMode("joint");
                    play("tick");
                  }}
                  disabled={outcomeOnly}
                >
                  Joint
                </button>
              </div>
            </div>

            <div className="lab-row lab-slider-row">
              <div className="lab-slider-head">
                <span className="lab-label">Gamma γ</span>
                <span className="lab-value">{gamma.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={gamma}
                disabled={outcomeOnly}
                onChange={(e) => {
                  setGamma(Number(e.target.value));
                  play("pop");
                }}
              />
              <p className="lab-hint">
                Lower γ trusts recent steps more. At 1.0, future credit is not
                discounted.
              </p>
            </div>
          </div>

          <div className="lab-board">
            {rollouts.map((rollout, ri) => {
              const result = results[ri];
              return (
                <article className="lab-card" key={`r-${ri}`}>
                  <header>
                    <span>Rollout {ri + 1}</span>
                    <strong>Ã₁ {format(result.advantages[0] ?? 0)}</strong>
                  </header>

                  {!outcomeOnly &&
                    rollout.infoGains.map((g, gi) => (
                      <label className="lab-field" key={`ig-${ri}-${gi}`}>
                        <span>Help t{gi + 1}</span>
                        <input
                          type="number"
                          step="0.01"
                          value={g}
                          onChange={(e) =>
                            updateGain(ri, gi, e.target.value)
                          }
                          onBlur={() => play("tick")}
                        />
                      </label>
                    ))}

                  <label className="lab-field">
                    <span>Final F1</span>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={rollout.outcome}
                      onChange={(e) => updateOutcome(ri, e.target.value)}
                      onBlur={() => play("tick")}
                    />
                  </label>

                  <div className="lab-adv">
                    {result.advantages.map((a, ai) => {
                      const width = (Math.abs(a) / maxAbs) * 100;
                      const label = outcomeOnly
                        ? "A"
                        : ai < rollout.infoGains.length
                          ? `Ã${ai + 1}`
                          : "ÃT";
                      return (
                        <div className="lab-adv-row" key={`a-${ri}-${ai}`}>
                          <span>{label}</span>
                          <div className="bar">
                            <span
                              className={a < 0 ? "neg-fill" : undefined}
                              style={{
                                width: `${Math.max(width, a === 0 ? 2 : 6)}%`,
                              }}
                            />
                          </div>
                          <span>{format(a)}</span>
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
