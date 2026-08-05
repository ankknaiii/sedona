import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Cloud, Sky } from "@react-three/drei";
import * as THREE from "three";

function Mesa({ position, scale = 1, color = "#b56a45" }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.9, 0]}>
        <boxGeometry args={[2.2, 1.8, 1.6]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      <mesh castShadow position={[0, 1.95, 0]}>
        <boxGeometry args={[1.4, 0.45, 1.1]} />
        <meshStandardMaterial color="#c87b52" roughness={0.9} />
      </mesh>
    </group>
  );
}

function ExteriorCabin() {
  return (
    <group position={[0, 0, -2.2]}>
      <mesh castShadow position={[0, 0.85, 0]}>
        <boxGeometry args={[2.4, 1.7, 2.1]} />
        <meshStandardMaterial color="#d8b48a" roughness={0.85} />
      </mesh>
      <mesh castShadow position={[0, 2.05, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.9, 1.1, 4]} />
        <meshStandardMaterial color="#6f4f40" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.7, 1.06]}>
        <boxGeometry args={[0.55, 0.95, 0.08]} />
        <meshStandardMaterial color="#8b6248" />
      </mesh>
      <mesh position={[0.7, 1.15, 1.05]}>
        <boxGeometry args={[0.45, 0.4, 0.06]} />
        <meshStandardMaterial
          color="#7ec8e3"
          emissive="#4aa3c7"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh position={[0, 0.08, 1.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 16]} />
        <meshStandardMaterial color="#c4a484" />
      </mesh>
    </group>
  );
}

function CameraRig({ phase }) {
  const { camera } = useThree();
  const goals = useMemo(
    () => [
      {
        pos: new THREE.Vector3(7.5, 4.2, 9.5),
        look: new THREE.Vector3(0, 0.8, -1),
      },
      {
        pos: new THREE.Vector3(3.2, 2.2, 5.2),
        look: new THREE.Vector3(0, 1, -1.5),
      },
      {
        pos: new THREE.Vector3(0.15, 1.35, 2.35),
        look: new THREE.Vector3(0, 1.0, -1.2),
      },
    ],
    [],
  );

  useFrame((_, dt) => {
    const goal = goals[Math.min(phase, goals.length - 1)];
    camera.position.lerp(goal.pos, 1 - Math.exp(-1.7 * dt));
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const desired = goal.look.clone().sub(camera.position).normalize();
    dir.lerp(desired, 1 - Math.exp(-2.4 * dt));
    camera.lookAt(camera.position.clone().add(dir));
  });

  return null;
}

function World() {
  return (
    <>
      <color attach="background" args={["#f0d2b0"]} />
      <fog attach="fog" args={["#f0d2b0", 12, 38]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        castShadow
        position={[8, 12, 6]}
        intensity={1.35}
        shadow-mapSize={[1024, 1024]}
      />
      <Sky sunPosition={[8, 6, 4]} turbidity={6} rayleigh={1.2} />
      <Cloud position={[-6, 7, -8]} speed={0.15} opacity={0.35} />
      <Cloud position={[8, 8, -10]} speed={0.1} opacity={0.28} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[40, 48]} />
        <meshStandardMaterial color="#c9956c" roughness={1} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 2]}
        receiveShadow
      >
        <planeGeometry args={[3.2, 10]} />
        <meshStandardMaterial color="#b88968" roughness={1} />
      </mesh>

      <Mesa position={[-6, 0, -4]} scale={1.4} />
      <Mesa position={[-3.5, 0, -7]} scale={1.1} color="#a85a3a" />
      <Mesa position={[5.5, 0, -5]} scale={1.6} color="#c06a40" />
      <Mesa position={[8, 0, -9]} scale={2.1} color="#9a4f32" />
      <Mesa position={[-8, 0, 2]} scale={0.9} />
      <ExteriorCabin />

      <group position={[2.4, 0, 1.2]}>
        <mesh castShadow position={[0, 0.55, 0]}>
          <boxGeometry args={[0.28, 1.1, 0.28]} />
          <meshStandardMaterial color="#6f8f5a" />
        </mesh>
        <mesh castShadow position={[0.28, 0.7, 0]}>
          <boxGeometry args={[0.45, 0.22, 0.22]} />
          <meshStandardMaterial color="#6f8f5a" />
        </mesh>
      </group>
    </>
  );
}

const LINES = [
  {
    kicker: "Sedona",
    title: "Grade every switchback—not only the summit.",
    body: "Like a Sedona trail judged by elevation gain at each turn, IGPO scores search steps by whether they raised belief toward the answer—not only the final reply.",
  },
  {
    kicker: "Sedona",
    title: "Process credit lives in the cabin.",
    body: "Assemble the multi-turn trainer: data, rollout, information-gain reward, advantage, optimize, eval. Silent batches go cold; useful middle steps stay lit.",
  },
  {
    kicker: "Sedona",
    title: "Build the sandbox. Spend tokens wisely.",
    body: "Place modules, open clues, run a rollout. Tokens are the scarce budget—same scarcity training burns on every think / search / answer turn.",
  },
];

export default function SedonaArrive({ onEnter, play = () => {} }) {
  const [phase, setPhase] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setPhase((p) => Math.min(2, p + 1));
    }, 4200);
    return () => clearInterval(timer.current);
  }, []);

  useEffect(() => {
    if (phase >= 2) clearInterval(timer.current);
  }, [phase]);

  const line = LINES[phase];

  return (
    <section className="arrive-screen">
      <div className="arrive-canvas">
        <Canvas shadows camera={{ position: [7.5, 4.2, 9.5], fov: 42 }}>
          <Suspense fallback={null}>
            <World />
            <CameraRig phase={phase} />
          </Suspense>
        </Canvas>
        <div className="arrive-grain" />
      </div>

      <div className="arrive-hud">
        <div className="arrive-copy" key={line.title}>
          <p className="eyebrow">{line.kicker}</p>
          <h1>{line.title}</h1>
          <p>{line.body}</p>
        </div>
        <div className="arrive-actions">
          {phase < 2 ? (
            <button
              type="button"
              className="btn btn-solid cozy-btn"
              onClick={() => {
                setPhase((p) => Math.min(2, p + 1));
                play("pop");
              }}
            >
              Keep walking →
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-solid cozy-btn"
              onClick={() => {
                play("unlock");
                onEnter();
              }}
            >
              Enter Sedona
            </button>
          )}
          <button
            type="button"
            className="btn btn-line cozy-btn-ghost"
            onClick={() => {
              play("tick");
              onEnter();
            }}
          >
            Skip
          </button>
        </div>
        <div className="arrive-dots" aria-hidden="true">
          {LINES.map((_, i) => (
            <span key={i} className={i === phase ? "on" : ""} />
          ))}
        </div>
      </div>
    </section>
  );
}
