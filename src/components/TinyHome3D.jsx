import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CabinScene from "./cabin/CabinScene";
import ProcessBoard from "./ProcessBoard";
import {
  ANCHORS,
  CATALOG,
  ROOMS,
  STORAGE_KEY,
  computePlacementScore,
} from "../data/tinyHome";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { placements: {}, elevation: 0, log: [] };
    return JSON.parse(raw);
  } catch {
    return { placements: {}, elevation: 0, log: [] };
  }
}

export default function TinyHome3D({ play = () => {} }) {
  const [state, setState] = useState(loadState);
  const [mode, setMode] = useState("orbit"); // orbit | walk
  const [walking, setWalking] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [hoverAnchor, setHoverAnchor] = useState(null);
  const [focusId, setFocusId] = useState(null);
  const [toast, setToast] = useState(null);
  const [crateOpen, setCrateOpen] = useState(true);

  const placedCount = Object.keys(state.placements).length;
  const focus = CATALOG.find((c) => c.id === focusId) ?? null;
  const selected = CATALOG.find((c) => c.id === selectedId) ?? null;

  const delivery = useMemo(() => {
    return CATALOG.filter((item) => {
      const room = ROOMS.find((r) => r.id === item.room);
      const unlocked = placedCount >= (room?.unlockAt ?? 0);
      const used = Object.values(state.placements).includes(item.id);
      return unlocked && !used;
    });
  }, [placedCount, state.placements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  function pushToast(entry) {
    setToast(entry);
  }

  function place(anchorId) {
    if (!selectedId) return;
    const item = CATALOG.find((c) => c.id === selectedId);
    if (!item) return;

    const score = computePlacementScore(item, anchorId);
    const nextPlacements = { ...state.placements };
    for (const [a, id] of Object.entries(nextPlacements)) {
      if (id === selectedId) delete nextPlacements[a];
    }
    nextPlacements[anchorId] = selectedId;

    const elevation = Math.max(
      -1,
      Math.min(2.5, Number((state.elevation + score.delta).toFixed(2))),
    );
    const logItem = {
      id: `${Date.now()}`,
      name: item.name,
      delta: score.delta,
      kind: score.kind,
      preferred: score.preferred,
      concept: item.concept,
    };

    setState({
      placements: nextPlacements,
      elevation,
      log: [logItem, ...(state.log || [])].slice(0, 12),
    });
    setFocusId(selectedId);
    setSelectedId(null);
    setHoverAnchor(null);
    pushToast(logItem);
    play(score.kind === "reward" ? "alive" : "silent");
  }

  function reset() {
    setState({ placements: {}, elevation: 0, log: [] });
    setSelectedId(null);
    setFocusId(null);
    play("silent");
  }

  const elevationPct = Math.max(0, Math.min(100, ((state.elevation + 1) / 3.5) * 100));
  const signalState =
    state.elevation > 0.35 ? "learning" : state.elevation < -0.05 ? "harmful" : "silent";

  return (
    <div className="cabin3d">
      <header className="cabin3d-top">
        <div>
          <p className="eyebrow">Sedona · process cabin</p>
          <h1>Place process pieces. Unlock the IGPO chain.</h1>
        </div>
        <div className="cabin3d-actions">
          <div className="mode-toggle">
            <button
              type="button"
              aria-pressed={mode === "orbit"}
              onClick={() => {
                setMode("orbit");
                setWalking(false);
                play("pop");
              }}
            >
              Look around
            </button>
            <button
              type="button"
              aria-pressed={mode === "walk"}
              onClick={() => {
                setMode("walk");
                play("select");
              }}
            >
              Walk inside
            </button>
          </div>
          <button type="button" className="btn btn-line" onClick={reset}>
            Reset home
          </button>
        </div>
      </header>

      <p className="cabin3d-lede">
        <strong>Process things</strong> are not hidden: they are the six nodes below
        (think → tool → masked response → <em>IG process reward</em> → answer →
        group advantage). Furnish the matching piece to light each node. Elevation
        on the HUD is your running process credit.
      </p>

      <ProcessBoard
        placements={state.placements}
        play={play}
        onFocusItem={(id) => {
          setFocusId(id);
          const stillInCrate = delivery.some((d) => d.id === id);
          if (stillInCrate) setSelectedId(id);
        }}
      />

      <div className="cabin3d-layout">
        <div className="cabin-viewport">
          <Canvas shadows camera={{ position: [2.8, 1.7, 3.2], fov: 55 }}>
            <Suspense fallback={null}>
              <CabinScene
                mode={mode}
                placements={state.placements}
                selectedId={selectedId}
                hoverAnchor={hoverAnchor}
                setHoverAnchor={setHoverAnchor}
                onPlace={place}
                onSelectPlaced={(id) => {
                  setFocusId(id);
                  play("tick");
                }}
                onLockChange={setWalking}
              />
            </Suspense>
          </Canvas>

          {mode === "walk" && !walking && (
            <div className="lock-btn">
              Click the room to enter first-person · WASD to walk · Esc to release
            </div>
          )}
          {mode === "walk" && walking && (
            <div className="lock-btn is-live">Walking · place with mouse when a piece is selected</div>
          )}

          <div className={`elevation-hud sem-${signalState}`}>
            <div className="elevation-meta">
              <span>Elevation (process credit)</span>
              <strong>
                {state.elevation >= 0 ? "+" : ""}
                {state.elevation.toFixed(2)} IG
              </strong>
            </div>
            <div className="elevation-bar">
              <span style={{ width: `${elevationPct}%` }} />
            </div>
            <small>
              {signalState === "learning"
                ? "Signal alive — the batch can still teach."
                : signalState === "harmful"
                  ? "Penalty trail — silent / misplaced steps dominate."
                  : "Quiet camp — place process pieces to wake the gradient."}
            </small>
          </div>

          <AnimatePresence>
            {toast && (
              <motion.div
                className={`float-toast ${toast.kind}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {toast.delta >= 0 ? "Reward" : "Penalty"}{" "}
                {toast.delta >= 0 ? "+" : ""}
                {toast.delta.toFixed(2)} · {toast.name}
                {!toast.preferred ? " · off-trail anchor" : ""}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="cabin-side">
          <div className="lesson-panel">
            {focus ? (
              <>
                <p className="kicker">Field note</p>
                <h2>{focus.name}</h2>
                <p className="concept-pill">{focus.concept}</p>
                {focus.process && (
                  <p className="concept-pill process-tag">process · {focus.process}</p>
                )}
                <p className="lesson-body">{focus.lesson}</p>
                <div className="how-box">
                  <h3>How IGPO uses this</h3>
                  <p>{focus.how}</p>
                </div>
                <div className="how-box">
                  <h3>Game signal</h3>
                  <p>
                    {focus.signal === "penalty"
                      ? `Penalty ${focus.igDelta} on a good anchor (${focus.wrongDelta} if misplaced). Teaches collapse.`
                      : focus.signal === "mixed"
                        ? `Reward ${focus.igDelta} on preferred anchors; ${focus.wrongDelta} if misplaced.`
                        : `Reward +${focus.igDelta} on preferred anchors (+${focus.wrongDelta} if misplaced).`}
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="kicker">How to play</p>
                <h2>Curate the cabin like a gallery</h2>
                <p className="lesson-body">
                  1) Pick a delivery piece. 2) In Look mode, click a glowing
                  anchor—or Walk inside with WASD and place while exploring. 3)
                  Watch Elevation move: that is information gain made tangible.
                </p>
                <div className="how-box">
                  <h3>IGPO in plain English</h3>
                  <p>
                    Do not only grade the summit. Grade whether each search step
                    raised belief in the right answer. Sedona makes those step
                    rewards and silent-batch penalties visible in your home.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="signal-log">
            <p className="kicker">Recent signals</p>
            {(state.log || []).length === 0 && (
              <p className="tray-empty">No placements yet.</p>
            )}
            {(state.log || []).slice(0, 5).map((row) => (
              <div key={row.id} className={`log-row ${row.kind}`}>
                <span>{row.name}</span>
                <strong>
                  {row.delta >= 0 ? "+" : ""}
                  {row.delta.toFixed(2)}
                </strong>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="delivery-dock is-open">
        <button
          type="button"
          className="dock-toggle"
          onClick={() => {
            setCrateOpen((v) => !v);
            play("pop");
          }}
        >
          {crateOpen ? "Hide crate" : "Open delivery crate"} · {delivery.length}{" "}
          waiting · {placedCount}/{CATALOG.length} placed
        </button>
        {crateOpen && (
          <div className="delivery-tray">
            {delivery.length === 0 ? (
              <p className="tray-empty">
                {placedCount >= CATALOG.length
                  ? "Crate empty — your Sedona home holds the full IGPO trail."
                  : "Place more pieces to unlock the next room delivery."}
              </p>
            ) : (
              delivery.map((item) => (
                <motion.button
                  key={item.id}
                  type="button"
                  className={`delivery-card ${selectedId === item.id ? "is-selected" : ""}`}
                  onClick={() => {
                    setSelectedId(item.id);
                    setFocusId(item.id);
                    play("select");
                  }}
                  whileHover={{ y: -6 }}
                >
                  <div
                    className="mini-swatch"
                    style={{
                      background: item.color,
                      boxShadow: `0 0 16px ${item.emissive || "transparent"}`,
                    }}
                  />
                  <strong>{item.name}</strong>
                  <span>
                    {item.signal === "penalty" ? "Penalty" : "Reward"} ·{" "}
                    {item.process || item.concept}
                  </span>
                </motion.button>
              ))
            )}
          </div>
        )}
        {selected && (
          <p className="placing-hint">
            Placing <em>{selected.name}</em> — click a glowing floor/wall anchor
            inside the room.
            {hoverAnchor
              ? ` Hovering ${ANCHORS.find((a) => a.id === hoverAnchor)?.label}.`
              : ""}
          </p>
        )}
      </div>
    </div>
  );
}
