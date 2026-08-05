import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AUDIENCES, JOURNEY } from "../data/product";

export default function SedonaJourney({ play = () => {}, onOpenLab }) {
  const [activeId, setActiveId] = useState(JOURNEY[0].id);
  const [cleared, setCleared] = useState(() => new Set([JOURNEY[0].id]));
  const [lens, setLens] = useState("everyone");
  const active = JOURNEY.find((j) => j.id === activeId) ?? JOURNEY[0];

  const body =
    lens === "design"
      ? active.design
      : lens === "enterprise"
        ? active.enterprise
        : active.plain;

  function selectWaypoint(point, index) {
    const unlocked =
      index === 0 || cleared.has(JOURNEY[index - 1].id) || cleared.has(point.id);
    if (!unlocked) {
      play("silent");
      return;
    }
    setActiveId(point.id);
    setCleared((prev) => new Set(prev).add(point.id));
    play(index === JOURNEY.length - 1 ? "unlock" : "select");
  }

  function advance() {
    const i = JOURNEY.findIndex((j) => j.id === activeId);
    const next = JOURNEY[Math.min(i + 1, JOURNEY.length - 1)];
    selectWaypoint(next, Math.min(i + 1, JOURNEY.length - 1));
    if (next.id === "summit" && onOpenLab) {
      // stay on board; CTA in card opens lab
    }
  }

  return (
    <section id="journey" className="journey-section">
      <div className="section-inner">
        <div className="section-head">
          <p className="kicker">Oil board · strategy journey</p>
          <h2>Play the switchbacks. Unlock elevation.</h2>
          <p className="lede">
            An oil-painted Sedona trail. Each waypoint is a campaign card—clear the
            path from silent batches to process credit, then into the summit lab.
          </p>
        </div>

        <div className="audience-tabs" role="tablist" aria-label="Reading lens">
          {AUDIENCES.map((a) => (
            <button
              key={a.id}
              type="button"
              role="tab"
              aria-selected={lens === a.id}
              onClick={() => {
                setLens(a.id);
                play("pop");
              }}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="board-shell">
          <div className="board-map" aria-label="Sedona aerial journey board">
            <img
              src="/figures/sedona-oil-journey.png"
              alt="Oil painting of Sedona canyon trail with switchbacks toward the summit"
            />
            <div className="oil-grain" aria-hidden="true" />
            <svg className="board-path" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.path
                d="M14 72 C 22 60, 28 52, 32 48 S 44 40, 52 36 S 64 30, 70 28 S 80 22, 86 18"
                fill="none"
                stroke="rgba(255,250,245,0.85)"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: Math.max(0.15, cleared.size / JOURNEY.length) }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            </svg>

            {JOURNEY.map((point, index) => {
              const unlocked =
                index === 0 ||
                cleared.has(JOURNEY[index - 1].id) ||
                cleared.has(point.id);
              const isActive = point.id === activeId;
              const isCleared = cleared.has(point.id);
              return (
                <motion.button
                  key={point.id}
                  type="button"
                  className={`waypoint ${isActive ? "is-active" : ""} ${isCleared ? "is-cleared" : ""} ${unlocked ? "" : "is-locked"}`}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  onClick={() => selectWaypoint(point, index)}
                  whileHover={unlocked ? { scale: 1.08, y: -2 } : {}}
                  whileTap={unlocked ? { scale: 0.96 } : {}}
                  aria-label={`${point.title}. ${unlocked ? "Select" : "Locked"}`}
                >
                  <span className="waypoint-idx">{point.idx}</span>
                  <span className="waypoint-name">{point.title}</span>
                </motion.button>
              );
            })}
          </div>

          <div className="hand">
            <AnimatePresence mode="wait">
              <motion.article
                key={active.id + lens}
                className="strategy-card"
                initial={{ opacity: 0, y: 18, rotate: -1.2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -12, rotate: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.12}
                whileHover={{ y: -6 }}
                whileDrag={{ scale: 1.02, rotate: -0.6 }}
              >
                <header>
                  <span>[{active.idx}]</span>
                  <span className="card-tag">{active.subtitle}</span>
                </header>
                <h3>{active.title}</h3>
                <p>{body}</p>
                <div className="card-actions">
                  <button type="button" className="btn btn-soft" onClick={advance}>
                    Continue trail
                  </button>
                  {active.id === "summit" ? (
                    <button
                      type="button"
                      className="btn btn-line"
                      onClick={() => {
                        play("unlock");
                        onOpenLab?.();
                      }}
                    >
                      Enter summit lab
                    </button>
                  ) : (
                    <a className="btn btn-line" href={`#${active.id === "ridge" ? "architecture" : "demo"}`}>
                      Peek deeper
                    </a>
                  )}
                </div>
              </motion.article>
            </AnimatePresence>

            <div className="hand-strip">
              {JOURNEY.map((point, index) => {
                const unlocked =
                  index === 0 ||
                  cleared.has(JOURNEY[index - 1].id) ||
                  cleared.has(point.id);
                return (
                  <motion.button
                    key={`mini-${point.id}`}
                    type="button"
                    className={`mini-card ${point.id === activeId ? "is-active" : ""} ${cleared.has(point.id) ? "is-cleared" : ""}`}
                    disabled={!unlocked}
                    onClick={() => selectWaypoint(point, index)}
                    whileHover={unlocked ? { y: -8, rotate: -2 } : {}}
                    transition={{ type: "spring", stiffness: 380, damping: 18 }}
                  >
                    <span>{point.idx}</span>
                    <strong>{point.title}</strong>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
