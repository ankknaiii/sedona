import { useState } from "react";
import SedonaArrive from "./components/SedonaArrive";
import SignalLab from "./components/SignalLab";
import TrainerCabin from "./components/TrainerCabin";
import { LINKS, PRODUCT } from "./data/product";
import { useSound } from "./hooks/useSound";

const MODES = [
  { id: "home", label: "Sedona" },
  { id: "lab", label: "Summit Lab" },
];

function Nav({ mode, setMode, soundOn, onToggleSound, onReplayArrive }) {
  return (
    <header className="nav cozy-nav">
      <button type="button" className="brand brand-btn" onClick={onReplayArrive}>
        {PRODUCT.name}
      </button>
      <nav className="nav-mid mode-nav" aria-label="Modes">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={mode === m.id ? "is-on" : ""}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </nav>
      <div className="nav-actions">
        <button
          type="button"
          className="sound-btn"
          aria-pressed={soundOn}
          onClick={onToggleSound}
          title="Interaction sounds"
        >
          SFX {soundOn ? "on" : "off"}
        </button>
        <a
          className="btn btn-soft"
          href={LINKS.github}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}

export default function App() {
  const { on, toggle, play } = useSound();
  const [mode, setMode] = useState("arrive");

  return (
    <>
      {mode !== "arrive" && (
        <Nav
          mode={mode}
          setMode={(m) => {
            setMode(m);
            play("pop");
          }}
          soundOn={on}
          onToggleSound={toggle}
          onReplayArrive={() => {
            setMode("arrive");
            play("tick");
          }}
        />
      )}
      <main>
        {mode === "arrive" && (
          <SedonaArrive play={play} onEnter={() => setMode("home")} />
        )}
        {mode === "home" && <TrainerCabin play={play} />}
        {mode === "lab" && (
          <div className="mode-wrap">
            <SignalLab play={play} />
          </div>
        )}
      </main>
      {mode !== "arrive" && (
        <footer className="site-footer">
          <span>Sedona · elevation gain for search agents</span>
          <a href={LINKS.colab} target="_blank" rel="noreferrer">
            Colab →
          </a>
        </footer>
      )}
    </>
  );
}
