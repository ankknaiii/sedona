import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  METRIC_DEFS,
  STORAGE_KEY,
  TOKEN_RULES,
  TOOLKIT,
  ZONES,
  scoreArchitecture,
  simulateMetrics,
} from "../data/trainerKit";
import { LINKS } from "../data/product";
import FurnitureArt from "./FurnitureArt";
import CozyRoom3D from "./cozy/CozyRoom3D";

const FLOW_SUMMARY = [
  "Data → offline QA + corpus",
  "Rollout → LoRA policy, actions, search, masked tool text",
  "Reward → information gain + F1/format",
  "Advantage → separate z-norm + γ-discount",
  "Optimization → PPO/GRPO clip epochs + KL",
  "Eval → scorer metrics + badcase iterate",
];

const CAT_LINES = [
  "mrrp. clues cost tokens. i nap on the receipt.",
  "pick from the shelf → tap a lit floor pad. trail logic.",
  "wrong alcove makes the cube blush. right alcove keeps it warm.",
  "petting me won’t update the policy. it might update your mood.",
  "tokens fuel every rollout here—same scarce stuff as in training.",
];

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function TokenWallet({ tokens }) {
  return (
    <div className="token-wallet">
      <span className="token-gem" aria-hidden="true" />
      <div>
        <em>Tokens</em>
        <strong>{tokens}</strong>
      </div>
    </div>
  );
}

function MetricBars({ metrics }) {
  const horizontal = METRIC_DEFS.filter((m) => m.orient === "h");
  const vertical = METRIC_DEFS.filter((m) => m.orient === "v");
  return (
    <div className="metric-sys cozy-panel">
      <div className="metric-sys-head">
        <p className="kicker">Training meters</p>
        <h3>Live signals from the cabin you built</h3>
      </div>
      <div className="metric-h">
        {horizontal.map((def) => {
          const raw = metrics[def.key] ?? 0;
          const pct = Math.max(0, Math.min(100, (raw / def.max) * 100));
          return (
            <div key={def.key} className="metric-h-row">
              <span>{def.label}</span>
              <div className="bar">
                <span style={{ width: `${pct}%` }} />
              </div>
              <strong>{Number(raw).toFixed(2)}</strong>
            </div>
          );
        })}
      </div>
      <div className="metric-v">
        {vertical.map((def) => {
          const raw = metrics[def.key] ?? 0;
          let pct;
          if (def.center != null) {
            pct = Math.max(
              0,
              Math.min(100, 50 + ((raw - def.center) / def.max) * 50),
            );
          } else if (def.invert) {
            pct = Math.max(0, Math.min(100, (1 - raw / def.max) * 100));
          } else {
            pct = Math.max(0, Math.min(100, (raw / def.max) * 100));
          }
          return (
            <div key={def.key} className="metric-v-col">
              <div className="metric-v-track">
                <span style={{ height: `${pct}%` }} />
              </div>
              <em>{def.label}</em>
              <strong>{Number(raw).toFixed(2)}</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClueFloat({ item, onClose, play, justPaid }) {
  const zone = ZONES.find((z) => z.id === item.zone);
  return (
    <motion.div
      className="clue-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="clue-float cozy-clue"
        initial={{ y: 16, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 10, scale: 0.98 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="clue-float-ornament" />
        <header className="clue-float-head">
          <div className="clue-float-thumb">
            <FurnitureArt shape={item.shape} accent={item.accent} />
          </div>
          <div>
            <p className="clue-tag">{item.clueTag}</p>
            <h3>{item.furniture}</h3>
          </div>
          <button
            type="button"
            className="clue-x"
            onClick={() => {
              onClose();
              play("silent");
            }}
          >
            ×
          </button>
        </header>
        <p className="clue-body">“{item.clue}”</p>
        <p className="clue-whisper">{item.whisper}</p>
        <footer className="clue-foot">
          <span>
            Hint · belongs in {zone?.title?.replace(/^\d+\s·\s/, "")}
          </span>
          <em>
            {justPaid
              ? `−${TOKEN_RULES.clueCost} tokens · ${item.name}`
              : `${item.name}`}
          </em>
        </footer>
      </motion.div>
    </motion.div>
  );
}

export default function TrainerCabin({ play = () => {} }) {
  const saved = load();
  const [placements, setPlacements] = useState(() => saved?.placements || {});
  const [tokens, setTokens] = useState(
    () => saved?.tokens ?? TOKEN_RULES.start,
  );
  const [unlockedClues, setUnlockedClues] = useState(
    () => new Set(saved?.unlockedClues || []),
  );
  const [paidZones, setPaidZones] = useState(
    () => new Set(saved?.paidZones || []),
  );
  const [buyingId, setBuyingId] = useState(null);
  const [clueId, setClueId] = useState(null);
  const [clueJustPaid, setClueJustPaid] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [showHelp, setShowHelp] = useState(() => !saved?.seenHelp);
  const [toast, setToast] = useState(null);
  const [catLine, setCatLine] = useState("");
  const [notice, setNotice] = useState(
    "Shelf → floor pad to place · tap an object for its clue",
  );

  const movingId = buyingId?.startsWith("move:") ? buyingId.slice(5) : null;
  const buying =
    TOOLKIT.find((t) => t.id === (movingId || buyingId)) ?? null;
  const isMoving = Boolean(movingId);
  const opened = TOOLKIT.find((t) => t.id === clueId) ?? null;
  const metrics = useMemo(() => simulateMetrics(placements), [placements]);
  const score = useMemo(() => scoreArchitecture(placements), [placements]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        placements,
        tokens,
        unlockedClues: [...unlockedClues],
        paidZones: [...paidZones],
        seenHelp: true,
      }),
    );
  }, [placements, tokens, unlockedClues, paidZones]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 1500);
    return () => clearTimeout(t);
  }, [toast]);

  function flash(delta, label) {
    setToast({ delta, label });
  }

  function spend(amount) {
    if (tokens < amount) {
      setNotice("Not enough tokens. Run a rollout once the cabin is further along—or reset.");
      play("silent");
      return false;
    }
    setTokens((n) => n - amount);
    return true;
  }

  function earn(amount) {
    if (amount > 0) setTokens((n) => n + amount);
  }

  function startBuy(id) {
    const tool = TOOLKIT.find((t) => t.id === id);
    if (!tool) return;
    if (placements[id]) {
      setNotice(`${tool.furniture} is already placed—tap it for a clue.`);
      setBuyingId(null);
      return;
    }
    if (tokens < tool.tokenCost) {
      setNotice(`Need ${tool.tokenCost} tokens to buy ${tool.furniture}.`);
      play("silent");
      return;
    }
    setBuyingId(id);
    setNotice(
      `Selected ${tool.furniture} (−${tool.tokenCost} tokens). Tap a lit floor pad to place it.`,
    );
    play("select");
  }

  function placeInZone(zoneId) {
    if (!buyingId || !buying) return;
    if (!spend(buying.tokenCost)) return;

    const zone = ZONES.find((z) => z.id === zoneId);
    const x = zone ? zone.x + zone.w / 2 : 50;
    const y = zone ? zone.y + zone.h / 2 : 50;
    const next = {
      ...placements,
      [buyingId]: { id: buyingId, x, y, zoneId },
    };
    setPlacements(next);
    flash(-buying.tokenCost, buying.furniture);

    const correct = buying.zone === zoneId;
    if (correct) {
      let bonus = TOKEN_RULES.correctBonus;
      const zoneTools = TOOLKIT.filter((t) => t.zone === zoneId);
      const zoneDone = zoneTools.every(
        (t) => next[t.id] && next[t.id].zoneId === zoneId,
      );
      if (zoneDone && !paidZones.has(zoneId)) {
        bonus += TOKEN_RULES.zoneBonus;
        setPaidZones((prev) => new Set([...prev, zoneId]));
        flash(bonus, "zone complete");
      } else {
        flash(TOKEN_RULES.correctBonus, "correct zone");
      }
      earn(bonus);
      setNotice(`Nice! ${buying.furniture} feels at home in ${zone?.title}.`);
      play("alive");
    } else {
      setNotice(
        `${buying.furniture} looks awkward here… try the ${buying.zone} alcove. Tap it again to move for free.`,
      );
      play("pop");
    }
    setBuyingId(null);
  }

  function moveToZone(id, zoneId) {
    const tool = TOOLKIT.find((t) => t.id === id);
    if (!tool || !placements[id]) return;
    const zone = ZONES.find((z) => z.id === zoneId);
    const next = {
      ...placements,
      [id]: {
        id,
        x: zone ? zone.x + zone.w / 2 : 50,
        y: zone ? zone.y + zone.h / 2 : 50,
        zoneId,
      },
    };
    setPlacements(next);
    if (tool.zone === zoneId) {
      earn(TOKEN_RULES.correctBonus);
      flash(TOKEN_RULES.correctBonus, "correct zone");
      play("alive");
    } else play("pop");
  }

  function readClue(id) {
    const tool = TOOLKIT.find((t) => t.id === id);
    if (!tool) return;
    const already = unlockedClues.has(id);
    let justPaid = false;
    if (!already) {
      if (!spend(TOKEN_RULES.clueCost)) return;
      justPaid = true;
      setUnlockedClues((prev) => new Set([...prev, id]));
      flash(-TOKEN_RULES.clueCost, "clue unlocked");
    }
    setClueJustPaid(justPaid);
    setClueId(id);
    play("select");
  }

  function onItemClick(id) {
    if (buyingId) {
      // if buying, ignore item click
      return;
    }
    readClue(id);
  }

  function onZonePick(zoneId) {
    if (buyingId) {
      placeInZone(zoneId);
      return;
    }
    // if a misplaced item is focused via clue—skip
    setNotice("Select something from the shelf first, then tap a floor pad.");
  }

  function petCat() {
    const line = CAT_LINES[Math.floor(Math.random() * CAT_LINES.length)];
    setCatLine(line);
    if (Math.random() < 0.35) {
      earn(5);
      flash(5, "found tokens");
    }
    play("tick");
  }

  function runRollout() {
    if (!spend(TOKEN_RULES.rolloutCost)) return;
    const ret = Math.round(TOKEN_RULES.rolloutReturnMax * score.coverage);
    earn(ret);
    flash(ret - TOKEN_RULES.rolloutCost, "rollout settle");
    setNotice(
      `Rollout spent ${TOKEN_RULES.rolloutCost} tokens and returned ${ret}. Coverage ${Math.round(score.coverage * 100)}%.`,
    );
    play(ret >= TOKEN_RULES.rolloutCost ? "unlock" : "pop");
  }

  function reset() {
    setPlacements({});
    setTokens(TOKEN_RULES.start);
    setUnlockedClues(new Set());
    setPaidZones(new Set());
    setBuyingId(null);
    setClueId(null);
    setShowHelp(true);
    setNotice("Cabin cleared. Tokens restored.");
    play("silent");
  }

  return (
    <div className="trainer-app cozy-app">
      <header className="cabin3d-top">
        <div>
          <p className="eyebrow">Elevation gain for search agents</p>
          <h1>Sedona</h1>
        </div>
        <div className="cabin3d-actions">
          <TokenWallet tokens={tokens} />
          <button type="button" className="btn btn-line" onClick={() => setShowHelp(true)}>
            Guide
          </button>
          <button type="button" className="btn btn-line" onClick={reset}>
            Reset
          </button>
          <button type="button" className="btn btn-soft" onClick={runRollout}>
            Run rollout (−{TOKEN_RULES.rolloutCost})
          </button>
          <button
            type="button"
            className="btn btn-solid"
            onClick={() => {
              setShowScore(true);
              play("unlock");
            }}
          >
            Final score
          </button>
        </div>
      </header>

      <div className="how-strip cozy-panel">
        <strong>Place</strong>
        <span>Select from the shelf, then tap a lit floor pad (spends tokens).</span>
        <strong>Clue</strong>
        <span>
          Tap a placed object, or use Clue on its shelf card (−{TOKEN_RULES.clueCost} the first time).
        </span>
      </div>
      <p className="token-notice">{notice}</p>
      {catLine && <p className="cat-bubble">🐱 {catLine}</p>}

      <div className="cozy-layout">
        <aside className="toolkit shelf cozy-shop">
          <div className="toolkit-head">
            <p className="kicker">Shelf</p>
            <h3>Cabin pieces</h3>
            <p>
              {buying
                ? isMoving
                  ? `Moving ${buying.furniture} — tap a new floor pad.`
                  : `${buying.furniture} (−${buying.tokenCost} tokens) — tap a lit floor pad.`
                : "Select to place. Open a clue when you want the story."}
            </p>
          </div>
          <div className="shelf-grid">
            {TOOLKIT.map((tool) => {
              const placed = Boolean(placements[tool.id]);
              const canAfford = tokens >= (tool.tokenCost ?? 35);
              return (
                <div
                  key={tool.id}
                  className={`furn-tile cozy-tile ${buyingId === tool.id ? "is-selected" : ""} ${placed ? "is-placed" : ""} ${!placed && !canAfford ? "is-locked" : ""}`}
                >
                  <button
                    type="button"
                    className="furn-tile-main"
                    onClick={() => {
                      if (placed) {
                        readClue(tool.id);
                        return;
                      }
                      if (buyingId === tool.id) {
                        readClue(tool.id);
                        return;
                      }
                      startBuy(tool.id);
                    }}
                  >
                    <FurnitureArt shape={tool.shape} accent={tool.accent} />
                    <span>{tool.furniture}</span>
                    {!placed && (
                      <i className="token-price">
                        <b />
                        {tool.tokenCost}
                      </i>
                    )}
                  </button>
                  <div className="shop-actions">
                    {!placed ? (
                      <button
                        type="button"
                        className="shop-buy"
                        disabled={!canAfford}
                        onClick={() => startBuy(tool.id)}
                      >
                        Place
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="shop-buy"
                        onClick={() => {
                          setBuyingId(`move:${tool.id}`);
                          setNotice(
                            `Tap a floor pad to move ${tool.furniture}.`,
                          );
                          play("tick");
                        }}
                      >
                        Move
                      </button>
                    )}
                    <button
                      type="button"
                      className="shop-clue"
                      onClick={() => readClue(tool.id)}
                    >
                      Clue
                      {!unlockedClues.has(tool.id)
                        ? ` · ${TOKEN_RULES.clueCost}`
                        : ""}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <div className="trainer-main">
          <div className="cozy-stage cozy-panel">
            <CozyRoom3D
              placements={placements}
              selectedId={clueId}
              buyingId={movingId || buyingId}
              onZonePick={(zoneId) => {
                if (movingId) {
                  moveToZone(movingId, zoneId);
                  setBuyingId(null);
                  setNotice(`Moved ${buying?.furniture || "item"}.`);
                  return;
                }
                onZonePick(zoneId);
              }}
              onItemClick={onItemClick}
              onPetCat={petCat}
            />
            <AnimatePresence>
              {toast && (
                <motion.div
                  className={`token-toast ${toast.delta >= 0 ? "gain" : "spend"}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {toast.delta >= 0 ? "+" : ""}
                  {toast.delta} tokens · {toast.label}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <MetricBars metrics={metrics} />
        </div>

        <aside className="lesson-panel trainer-side cozy-panel">
          <p className="kicker">Trail notes</p>
          <h2>{buying ? buying.furniture : "Agent cabin"}</h2>
          <p className="lesson-body">
            {buying
              ? `${buying.tokenCost} tokens to place. Best home: ${buying.zone}.`
              : "The cabin is the multi-turn sandbox. Each piece maps to an IGPO module; tokens are the budget every rollout burns."}
          </p>
          <div className="how-box">
            <h3>Progress</h3>
            <p>
              {score.placedCount}/{score.totalParts} placed · coverage{" "}
              {Math.round(score.coverage * 100)}% · misplaced {score.misplaced}
            </p>
          </div>
          <div className="flow-check">
            <p className="kicker">Architecture</p>
            {score.checklist.map((c) => (
              <div key={c.zone} className={`flow-row ${c.ok ? "ok" : ""}`}>
                <span>{c.title}</span>
                <strong>
                  {c.correct}/{c.need}
                </strong>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {opened && (
          <ClueFloat
            item={opened}
            justPaid={clueJustPaid}
            onClose={() => setClueId(null)}
            play={play}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            className="score-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="score-card cozy-help"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <p className="kicker">Sedona guide</p>
              <h2>Build the trainer cabin</h2>
              <ol className="help-steps">
                <li>
                  <strong>Place</strong> — Select a shelf piece, then tap a lit
                  floor pad. Tokens are charged on place.
                </li>
                <li>
                  <strong>Clue</strong> — Tap a placed object (or Clue on its
                  card). First read costs {TOKEN_RULES.clueCost} tokens.
                </li>
                <li>
                  <strong>Cat</strong> — The cabin cat wanders; tap for a tip.
                </li>
                <li>
                  <strong>Rollout</strong> — Spend tokens to simulate a training
                  step; fuller architecture returns more.
                </li>
              </ol>
              <button
                type="button"
                className="btn btn-solid"
                onClick={() => setShowHelp(false)}
              >
                Enter cabin
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScore && (
          <motion.div
            className="score-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="score-card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <p className="kicker">Final score</p>
              <h2>{score.finalScore}</h2>
              <p>
                Coverage {Math.round(score.coverage * 100)}% · {tokens} tokens
                remaining. Same modules as{" "}
                <a href={LINKS.github} target="_blank" rel="noreferrer">
                  ankknaiii/igpo-agentic-search
                </a>
                .
              </p>
              <ul>
                {FLOW_SUMMARY.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <div className="hero-actions">
                <button
                  type="button"
                  className="btn btn-solid"
                  onClick={() => setShowScore(false)}
                >
                  Back to Sedona
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
