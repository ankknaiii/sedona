import { useEffect, useRef, useState } from "react";
import { OrbitControls, PointerLockControls, Sky, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ANCHORS, CATALOG } from "../../data/tinyHome";
import FurnitureMesh from "./FurnitureMesh";

function RoomShell() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#c4a484" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.3]} receiveShadow>
        <circleGeometry args={[1.6, 48]} />
        <meshStandardMaterial color="#efe6dc" roughness={1} />
      </mesh>
      <mesh position={[0, 1.5, -2.6]} receiveShadow>
        <boxGeometry args={[6, 3, 0.12]} />
        <meshStandardMaterial color="#f3ebe3" roughness={0.85} />
      </mesh>
      <mesh position={[-2.95, 1.5, 0]} receiveShadow>
        <boxGeometry args={[0.12, 3, 6]} />
        <meshStandardMaterial color="#efe6dc" roughness={0.85} />
      </mesh>
      <mesh position={[2.95, 1.5, 0]} receiveShadow>
        <boxGeometry args={[0.12, 3, 6]} />
        <meshStandardMaterial color="#efe6dc" roughness={0.85} />
      </mesh>
      <mesh position={[0, 3.05, 0]}>
        <boxGeometry args={[6.2, 0.1, 6.2]} />
        <meshStandardMaterial color="#e7d9cb" />
      </mesh>
      <mesh position={[0, 1.55, -2.5]}>
        <boxGeometry args={[2.4, 1.6, 0.08]} />
        <meshStandardMaterial color="#6f4f40" />
      </mesh>
      <mesh position={[0, 1.55, -2.48]}>
        <planeGeometry args={[2.05, 1.25]} />
        <meshStandardMaterial
          color="#b88968"
          emissive="#a47864"
          emissiveIntensity={0.25}
        />
      </mesh>
    </group>
  );
}

function WalkController({ active }) {
  const { camera } = useThree();
  const keys = useRef({});

  useEffect(() => {
    const down = (e) => {
      keys.current[e.code] = true;
    };
    const up = (e) => {
      keys.current[e.code] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, dt) => {
    if (!active) return;
    const speed = 2.6;
    const direction = new THREE.Vector3();
    const front = new THREE.Vector3();
    camera.getWorldDirection(front);
    front.y = 0;
    front.normalize();
    const right = new THREE.Vector3()
      .crossVectors(front, new THREE.Vector3(0, 1, 0))
      .normalize();

    if (keys.current.KeyW || keys.current.ArrowUp) direction.add(front);
    if (keys.current.KeyS || keys.current.ArrowDown) direction.sub(front);
    if (keys.current.KeyA || keys.current.ArrowLeft) direction.sub(right);
    if (keys.current.KeyD || keys.current.ArrowRight) direction.add(right);

    if (direction.lengthSq() > 0) {
      direction.normalize().multiplyScalar(speed * dt);
      camera.position.add(direction);
      camera.position.x = THREE.MathUtils.clamp(camera.position.x, -2.4, 2.4);
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, -2.1, 2.3);
      camera.position.y = 1.55;
    }
  });

  return null;
}

function WalkRig({ onLockChange }) {
  const controls = useRef();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const ctrl = controls.current;
    if (!ctrl) return undefined;
    const onLock = () => {
      setActive(true);
      onLockChange?.(true);
    };
    const onUnlock = () => {
      setActive(false);
      onLockChange?.(false);
    };
    ctrl.addEventListener("lock", onLock);
    ctrl.addEventListener("unlock", onUnlock);
    return () => {
      ctrl.removeEventListener("lock", onLock);
      ctrl.removeEventListener("unlock", onUnlock);
    };
  }, [onLockChange]);

  return (
    <>
      <PointerLockControls ref={controls} makeDefault />
      <WalkController active={active} />
    </>
  );
}

export default function CabinScene({
  mode,
  placements,
  selectedId,
  hoverAnchor,
  setHoverAnchor,
  onPlace,
  onSelectPlaced,
  onLockChange,
}) {
  const selected = CATALOG.find((c) => c.id === selectedId) ?? null;

  return (
    <>
      <color attach="background" args={["#d9c2a8"]} />
      <fog attach="fog" args={["#d9c2a8", 8, 18]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        castShadow
        intensity={1.15}
        position={[4, 8, 2]}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-1.4, 1.2, -1.4]} intensity={0.55} color="#ffb070" />
      <Sky sunPosition={[4, 2, 8]} turbidity={8} rayleigh={1.2} />

      <RoomShell />

      {ANCHORS.map((anchor) => {
        const hot = selectedId && hoverAnchor === anchor.id;
        return (
          <group key={anchor.id} position={anchor.position}>
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              onPointerOver={(e) => {
                e.stopPropagation();
                if (selectedId) setHoverAnchor(anchor.id);
              }}
              onPointerOut={() => {
                if (hoverAnchor === anchor.id) setHoverAnchor(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (selectedId) onPlace(anchor.id);
              }}
            >
              <circleGeometry args={[0.4, 24]} />
              <meshStandardMaterial
                color={hot ? "#c08a5a" : "#a47864"}
                transparent
                opacity={selectedId ? (hot ? 0.55 : 0.25) : 0.1}
              />
            </mesh>
            {selectedId && (
              <Text
                position={[0, 0.14, 0]}
                fontSize={0.1}
                color="#2a211c"
                anchorX="center"
                anchorY="middle"
              >
                {anchor.label}
              </Text>
            )}
          </group>
        );
      })}

      {Object.entries(placements).map(([anchorId, itemId]) => {
        const anchor = ANCHORS.find((a) => a.id === anchorId);
        const item = CATALOG.find((c) => c.id === itemId);
        if (!anchor || !item) return null;
        return (
          <FurnitureMesh
            key={anchorId}
            item={item}
            position={anchor.position}
            onClick={() => onSelectPlaced(itemId)}
          />
        );
      })}

      {selected && hoverAnchor && (
        <FurnitureMesh
          item={selected}
          position={
            ANCHORS.find((a) => a.id === hoverAnchor)?.position || [0, 0.02, 0]
          }
          ghost
        />
      )}

      {mode === "walk" ? (
        <WalkRig onLockChange={onLockChange} />
      ) : (
        <OrbitControls
          makeDefault
          enablePan
          maxPolarAngle={Math.PI / 2.05}
          minDistance={2}
          maxDistance={8}
          target={[0, 1, 0]}
        />
      )}
    </>
  );
}
