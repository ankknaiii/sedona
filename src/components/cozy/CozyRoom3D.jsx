import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { TOOLKIT, ZONES } from "../../data/trainerKit";

function PlankFloor() {
  const planks = useMemo(() => {
    const list = [];
    for (let i = -3; i <= 3; i += 1) {
      list.push(
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, i * 0.72]}
          receiveShadow
        >
          <planeGeometry args={[5.6, 0.68]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#c4a07a" : "#b8926c"}
            roughness={0.95}
          />
        </mesh>,
      );
    }
    return list;
  }, []);
  return <group>{planks}</group>;
}

function CozyShell() {
  return (
    <group>
      <PlankFloor />
      {/* walls — chunky MC/AC blocks */}
      <mesh position={[0, 1.4, -2.7]} castShadow receiveShadow>
        <boxGeometry args={[5.6, 2.8, 0.28]} />
        <meshStandardMaterial color="#efe0cf" roughness={0.9} />
      </mesh>
      <mesh position={[-2.85, 1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.28, 2.8, 5.6]} />
        <meshStandardMaterial color="#f3e7d8" roughness={0.9} />
      </mesh>
      <mesh position={[2.85, 1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.28, 2.8, 5.6]} />
        <meshStandardMaterial color="#f3e7d8" roughness={0.9} />
      </mesh>
      {/* window */}
      <mesh position={[0, 1.55, -2.54]}>
        <boxGeometry args={[1.8, 1.2, 0.12]} />
        <meshStandardMaterial color="#6f4f40" />
      </mesh>
      <mesh position={[0, 1.55, -2.46]}>
        <planeGeometry args={[1.45, 0.9]} />
        <meshStandardMaterial
          color="#f0b27a"
          emissive="#e39b5c"
          emissiveIntensity={0.45}
        />
      </mesh>
      {/* rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0.4]}>
        <circleGeometry args={[1.15, 24]} />
        <meshStandardMaterial color="#d9a078" roughness={1} />
      </mesh>
      {/* ceiling beam */}
      <mesh position={[0, 2.7, 0]}>
        <boxGeometry args={[5.4, 0.18, 0.28]} />
        <meshStandardMaterial color="#8b6248" />
      </mesh>
    </group>
  );
}

function ZonePad({ zone, active, onPick }) {
  const x = ((zone.x + zone.w / 2) / 100 - 0.5) * 4.6;
  const z = ((zone.y + zone.h / 2) / 100 - 0.5) * 4.6;
  return (
    <group position={[x, 0.04, z]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onPick?.(zone.id);
        }}
      >
        <planeGeometry args={[(zone.w / 100) * 4.2, (zone.h / 100) * 4.2]} />
        <meshStandardMaterial
          color={active ? "#c08a5a" : "#fffaf5"}
          transparent
          opacity={active ? 0.45 : 0.22}
        />
      </mesh>
    </group>
  );
}

function VoxelItem({ tool, placement, selected, onClick }) {
  const x = (placement.x / 100 - 0.5) * 4.6;
  const z = (placement.y / 100 - 0.5) * 4.6;
  const ok = placement.zoneId === tool.zone;
  return (
    <group
      position={[x, 0.35, z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(tool.id);
      }}
    >
      <mesh castShadow>
        <boxGeometry args={[0.55, 0.55, 0.55]} />
        <meshStandardMaterial
          color={tool.accent}
          emissive={selected ? tool.accent : "#000000"}
          emissiveIntensity={selected ? 0.25 : 0}
          roughness={0.7}
        />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.28, 0.18, 0.28]} />
        <meshStandardMaterial color={ok ? "#ffe0b8" : "#b55b4a"} />
      </mesh>
      <Text
        position={[0, 0.75, 0]}
        fontSize={0.16}
        color="#2a211c"
        anchorX="center"
        outlineWidth={0.01}
        outlineColor="#fffaf5"
      >
        {tool.furniture.split(" ").slice(-1)[0]}
      </Text>
    </group>
  );
}

function CabinCat({ onPet }) {
  const ref = useRef();
  const tail = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!ref.current) return;
    ref.current.position.x = Math.sin(t * 0.55) * 1.35;
    ref.current.position.z = 0.6 + Math.cos(t * 0.42) * 1.1;
    ref.current.position.y = 0.22 + Math.abs(Math.sin(t * 3)) * 0.03;
    const dx = Math.cos(t * 0.55) * 1.35;
    const dz = -Math.sin(t * 0.42) * 1.1;
    ref.current.rotation.y = Math.atan2(dx, dz);
    if (tail.current) tail.current.rotation.z = Math.sin(t * 4) * 0.35;
  });

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onPet?.();
      }}
    >
      {/* body */}
      <mesh castShadow position={[0, 0.12, 0]}>
        <boxGeometry args={[0.42, 0.28, 0.28]} />
        <meshStandardMaterial color="#e7d3b5" roughness={0.8} />
      </mesh>
      {/* head */}
      <mesh castShadow position={[0, 0.32, 0.18]}>
        <boxGeometry args={[0.26, 0.24, 0.24]} />
        <meshStandardMaterial color="#efe0cf" />
      </mesh>
      {/* ears */}
      <mesh position={[-0.08, 0.48, 0.18]}>
        <coneGeometry args={[0.06, 0.12, 3]} />
        <meshStandardMaterial color="#e7d3b5" />
      </mesh>
      <mesh position={[0.08, 0.48, 0.18]}>
        <coneGeometry args={[0.06, 0.12, 3]} />
        <meshStandardMaterial color="#e7d3b5" />
      </mesh>
      {/* eyes */}
      <mesh position={[-0.06, 0.34, 0.3]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#2a211c" />
      </mesh>
      <mesh position={[0.06, 0.34, 0.3]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#2a211c" />
      </mesh>
      {/* tail */}
      <mesh ref={tail} position={[0, 0.22, -0.28]} rotation={[0.4, 0, 0.2]}>
        <boxGeometry args={[0.06, 0.06, 0.34]} />
        <meshStandardMaterial color="#d8b48a" />
      </mesh>
    </group>
  );
}

function Scene({
  placements,
  selectedId,
  buyingId,
  onZonePick,
  onItemClick,
  onPetCat,
}) {
  return (
    <>
      <color attach="background" args={["#f4e4d2"]} />
      <ambientLight intensity={0.7} />
      <directionalLight
        castShadow
        position={[4, 7, 3]}
        intensity={1.2}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, 1.6, -2.2]} intensity={0.55} color="#ffc090" />
      <CozyShell />
      {ZONES.map((z) => (
        <ZonePad
          key={z.id}
          zone={z}
          active={buyingId != null}
          onPick={onZonePick}
        />
      ))}
      {Object.values(placements).map((p) => {
        const tool = TOOLKIT.find((t) => t.id === p.id);
        if (!tool) return null;
        return (
          <VoxelItem
            key={p.id}
            tool={tool}
            placement={p}
            selected={selectedId === p.id}
            onClick={onItemClick}
          />
        );
      })}
      <CabinCat onPet={onPetCat} />
      <OrbitControls
        makeDefault
        enablePan={false}
        minPolarAngle={0.35}
        maxPolarAngle={1.35}
        minDistance={3.2}
        maxDistance={8}
        target={[0, 0.6, 0]}
      />
    </>
  );
}

export default function CozyRoom3D({
  placements,
  selectedId,
  buyingId,
  onZonePick,
  onItemClick,
  onPetCat,
}) {
  return (
    <div className="cozy-canvas">
      <Canvas shadows camera={{ position: [3.8, 3.2, 4.6], fov: 42 }}>
        <Suspense fallback={null}>
          <Scene
            placements={placements}
            selectedId={selectedId}
            buyingId={buyingId}
            onZonePick={onZonePick}
            onItemClick={onItemClick}
            onPetCat={onPetCat}
          />
        </Suspense>
      </Canvas>
      <div className="cozy-canvas-hint">
        {buyingId
          ? "Tap a lit floor pad to place"
          : "Drag to look · tap an object for its clue"}
      </div>
    </div>
  );
}
