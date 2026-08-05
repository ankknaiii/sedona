import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CATALOG,
  ROOMS,
  SLOTS,
  STORAGE_KEY,
} from "../data/tinyHome";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { placements: {}, seen: [] };
    return JSON.parse(raw);
  } catch {
    return { placements: {}, seen: [] };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function Glyph({ type }) {
  return <div className={`glyph ${type}`} aria-hidden="true" />;
}

export default function TinyHomeGallery({ play = () => {} }) {
  const [state, setState] = useState(loadState);
  const [roomId, setRoomId] = useState("cabin");
  const [selectedId, setSelectedId] = useState(null);
  const [focusItemId, setFocusItemId] = useState(null);
  const [deliveryOpen, setDeliveryOpen] = useState(true);

  const placedCount = Object.keys(state.placements).length;

  const room = ROOMS.find((r) => r.id === roomId) ?? ROOMS[0];

  const delivery = useMemo(() => {
    return CATALOG.filter((item) => {
      const roomMeta = ROOMS.find((r) => r.id === item.room);
      const roomUnlocked = placedCount >= (roomMeta?.unlockAt ?? 0);
      const already = Object.values(state.placements).includes(item.id);
      return roomUnlocked && !already;
    });
  }, [placedCount, state.placements]);

  const roomPlaced = useMemo(() => {
    const ids = CATALOG.filter((c) => c.room === roomId).map((c) => c.id);
    return Object.values(state.placements).filter((id) => ids.includes(id))
      .length;
  }, [state.placements, roomId]);

  const focusItem = CATALOG.find((c) => c.id === focusItemId) ?? null;
  const selected = CATALOG.find((c) => c.id === selectedId) ?? null;

  useEffect(() => {
    saveState(state);
  }, [state]);

  function selectDelivery(id) {
    setSelectedId(id);
    setFocusItemId(id);
    play("select");
  }

  function placeOnSlot(slotId) {
    if (!selectedId) {
      play("silent");
      return;
    }
    const occupiedBy = state.placements[slotId];
    if (occupiedBy && occupiedBy !== selectedId) {
      play("pop");
    }
    // remove item from any previous slot
    const next = { ...state.placements };
    for (const [s, itemId] of Object.entries(next)) {
      if (itemId === selectedId) delete next[s];
    }
    next[slotId] = selectedId;
    const seen = state.seen.includes(selectedId)
      ? state.seen
      : [...state.seen, selectedId];
    setState({ placements: next, seen });
    setFocusItemId(selectedId);
    setSelectedId(null);
    play("unlock");
  }

  function clearHome() {
    setState({ placements: {}, seen: [] });
    setSelectedId(null);
    setFocusItemId(null);
    setRoomId("cabin");
    play("silent");
  }

  function itemInSlot(slotId) {
    const id = state.placements[slotId];
    return CATALOG.find((c) => c.id === id) ?? null;
  }

  const complete =
    placedCount >= CATALOG.length
      ? "golden"
      : roomPlaced >= room.required
        ? "room"
        : "progress";

  return (
    <div className="gallery-app">
      <header className="gallery-top">
        <div>
          <p className="eyebrow">Sedona · Design your tiny home</p>
          <h1>Decorate the cabin. Learn the trail.</h1>
        </div>
        <div className="gallery-top-actions">
          <button type="button" className="btn btn-line" onClick={clearHome}>
            Reset home
          </button>
          <span className="btn btn-soft" style={{ cursor: "default" }}>
            {placedCount}/{CATALOG.length} placed
          </span>
        </div>
      </header>

      <p className="gallery-lede">
        Like a daily gallery delivery: open the crate, place furnishings into your
        Sedona tiny home, and each piece teaches one IGPO idea—silent batches,
        elevation gain, masked weather, party compare, verify before scale.
      </p>

      <div className="room-tabs" role="tablist">
        {ROOMS.map((r) => {
          const locked = placedCount < r.unlockAt;
          return (
            <button
              key={r.id}
              type="button"
              role="tab"
              disabled={locked}
              aria-selected={roomId === r.id}
              className={roomId === r.id ? "is-on" : ""}
              onClick={() => {
                if (locked) return play("silent");
                setRoomId(r.id);
                play("step");
              }}
            >
              {locked ? "Locked · " : ""}
              {r.title}
            </button>
          );
        })}
      </div>

      <div className="gallery-stage">
        <div className="room-canvas">
          <img
            src="/figures/sedona-tiny-home-empty.png"
            alt="Empty Sedona tiny home interior oil painting"
            className="room-bg"
          />
          <div className="oil-grain" />

          {SLOTS.map((slot) => {
            const item = itemInSlot(slot.id);
            return (
              <button
                key={slot.id}
                type="button"
                className={`slot ${selectedId ? "is-hot" : ""} ${item ? "is-filled" : ""}`}
                style={{
                  left: `${slot.x}%`,
                  top: `${slot.y}%`,
                  width: `${slot.w}%`,
                  height: `${slot.h}%`,
                }}
                onClick={() => {
                  if (item && !selectedId) {
                    setFocusItemId(item.id);
                    play("tick");
                    return;
                  }
                  placeOnSlot(slot.id);
                }}
                aria-label={
                  item
                    ? `${item.name} on ${slot.label}`
                    : `Place on ${slot.label}`
                }
              >
                {item ? (
                  <motion.div
                    className="placed"
                    layoutId={item.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Glyph type={item.glyph} />
                    <span>{item.name}</span>
                  </motion.div>
                ) : (
                  <span className="slot-hint">{slot.label}</span>
                )}
              </button>
            );
          })}

          <div className={`room-banner sem-${complete === "golden" ? "learning" : complete === "room" ? "learning" : "silent"}`}>
            <strong>{room.title}</strong>
            <span>
              {room.goal} · {roomPlaced}/{room.required} in this room
            </span>
          </div>
        </div>

        <aside className="lesson-panel">
          <AnimatePresence mode="wait">
            {focusItem ? (
              <motion.div
                key={focusItem.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <p className="kicker">Lesson card</p>
                <h2>{focusItem.name}</h2>
                <p className="concept-pill">{focusItem.concept}</p>
                <p className="lesson-body">{focusItem.lesson}</p>
                <div className="how-box">
                  <h3>How it works</h3>
                  <p>{focusItem.how}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="kicker">Curator tip</p>
                <h2>Start with today’s delivery</h2>
                <p className="lesson-body">
                  Pick a piece from the crate below, then click a glowing slot in
                  the room. Read the lesson that appears—decorating is the tutorial.
                </p>
                <div className="how-box">
                  <h3>Progress</h3>
                  <p>
                    Cabin unlocks Loft at 3 pieces · Study at 6 · Golden home at{" "}
                    {CATALOG.length}.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {complete === "golden" && (
            <div className="golden-note">
              Golden home unlocked—you’ve furnished the full IGPO trail in one
              tiny house.
            </div>
          )}
        </aside>
      </div>

      <div className={`delivery-dock ${deliveryOpen ? "is-open" : ""}`}>
        <button
          type="button"
          className="dock-toggle"
          onClick={() => {
            setDeliveryOpen((v) => !v);
            play("pop");
          }}
        >
          {deliveryOpen ? "Hide delivery" : "Open delivery crate"} ·{" "}
          {delivery.length} waiting
        </button>

        {deliveryOpen && (
          <div className="delivery-tray">
            {delivery.length === 0 ? (
              <p className="tray-empty">
                {placedCount >= CATALOG.length
                  ? "Crate empty—your Sedona home is fully curated."
                  : "Place more pieces to unlock the next room’s delivery."}
              </p>
            ) : (
              delivery.map((item) => (
                <motion.button
                  key={item.id}
                  type="button"
                  className={`delivery-card ${selectedId === item.id ? "is-selected" : ""}`}
                  onClick={() => selectDelivery(item.id)}
                  whileHover={{ y: -6, rotate: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Glyph type={item.glyph} />
                  <strong>{item.name}</strong>
                  <span>{item.concept}</span>
                </motion.button>
              ))
            )}
          </div>
        )}

        {selected && (
          <p className="placing-hint">
            Placing <em>{selected.name}</em> — click a glowing slot in the room.
          </p>
        )}
      </div>
    </div>
  );
}
