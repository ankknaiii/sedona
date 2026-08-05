import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function FurnitureMesh({
  item,
  position,
  selected = false,
  ghost = false,
  onClick,
}) {
  const ref = useRef();
  const opacity = ghost ? 0.45 : 1;

  useFrame((state) => {
    if (!ref.current) return;
    if (selected || ghost) {
      ref.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.03;
    } else {
      ref.current.position.y = position[1];
    }
  });

  const mesh = useMemo(() => {
    const c = item.color;
    const e = item.emissive || "#000000";
    switch (item.shape) {
      case "lantern":
        return (
          <group>
            <mesh position={[0, 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.16, 0.45, 12]} />
              <meshStandardMaterial color={c} emissive={e} transparent opacity={opacity} />
            </mesh>
            <mesh position={[0, 0.62, 0]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial color="#3a332e" transparent opacity={opacity} />
            </mesh>
          </group>
        );
      case "hearth":
        return (
          <group>
            <mesh position={[0, 0.25, 0]} castShadow>
              <boxGeometry args={[0.9, 0.5, 0.55]} />
              <meshStandardMaterial color={c} emissive={e} emissiveIntensity={ghost ? 0.2 : 0.55} transparent opacity={opacity} />
            </mesh>
            <mesh position={[0, 0.55, 0]}>
              <boxGeometry args={[0.7, 0.15, 0.35]} />
              <meshStandardMaterial color="#5a3d30" transparent opacity={opacity} />
            </mesh>
          </group>
        );
      case "bench":
        return (
          <group>
            <mesh position={[0, 0.22, 0]} castShadow>
              <boxGeometry args={[0.9, 0.12, 0.35]} />
              <meshStandardMaterial color={c} transparent opacity={opacity} />
            </mesh>
            <mesh position={[-0.35, 0.1, 0]}>
              <boxGeometry args={[0.08, 0.2, 0.3]} />
              <meshStandardMaterial color="#5a3d30" transparent opacity={opacity} />
            </mesh>
            <mesh position={[0.35, 0.1, 0]}>
              <boxGeometry args={[0.08, 0.2, 0.3]} />
              <meshStandardMaterial color="#5a3d30" transparent opacity={opacity} />
            </mesh>
          </group>
        );
      case "rug":
        return (
          <mesh rotation={[-Math.PI / 2, 0, 0.3]} position={[0, 0.02, 0]} receiveShadow>
            <circleGeometry args={[0.7, 24]} />
            <meshStandardMaterial color={c} transparent opacity={opacity} />
          </mesh>
        );
      case "gauge":
        return (
          <mesh castShadow>
            <torusGeometry args={[0.28, 0.08, 12, 24]} />
            <meshStandardMaterial color={c} emissive={e} emissiveIntensity={0.35} transparent opacity={opacity} />
          </mesh>
        );
      case "chest":
        return (
          <mesh position={[0, 0.22, 0]} castShadow>
            <boxGeometry args={[0.7, 0.4, 0.45]} />
            <meshStandardMaterial color={c} transparent opacity={opacity} />
          </mesh>
        );
      case "chairs":
        return (
          <group>
            {[[-0.35, 0], [0.35, 0], [0, 0.35]].map(([x, z], i) => (
              <mesh key={i} position={[x, 0.2, z]} castShadow>
                <boxGeometry args={[0.28, 0.35, 0.28]} />
                <meshStandardMaterial color={c} transparent opacity={opacity} />
              </mesh>
            ))}
          </group>
        );
      case "map":
        return (
          <mesh castShadow>
            <planeGeometry args={[0.7, 0.5]} />
            <meshStandardMaterial color={c} transparent opacity={opacity} side={2} />
          </mesh>
        );
      case "scope":
        return (
          <group>
            <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.12, 0.55, 16]} />
              <meshStandardMaterial color={c} emissive={e} emissiveIntensity={0.25} transparent opacity={opacity} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.15, 0.18, 0.12, 12]} />
              <meshStandardMaterial color="#4a3a30" transparent opacity={opacity} />
            </mesh>
          </group>
        );
      default:
        return (
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshStandardMaterial color={c} transparent opacity={opacity} />
          </mesh>
        );
    }
  }, [item, opacity, ghost]);

  return (
    <group
      ref={ref}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      {mesh}
      {selected && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.45, 32]} />
          <meshBasicMaterial color="#c08a5a" transparent opacity={0.65} />
        </mesh>
      )}
    </group>
  );
}
