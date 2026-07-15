import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Group } from "three";

export type ShapeVariant = "octa" | "icosa" | "torus" | "knot";

const mouse = { x: 0, y: 0 };

function Shape({ variant }: { variant: ShapeVariant }) {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const scroll = typeof window !== "undefined" ? window.scrollY : 0;
    const targetX = mouse.y * 0.3 + scroll * 0.0005;
    const targetY = mouse.x * 0.45 + state.clock.elapsedTime * 0.08;
    g.rotation.x += (targetX - g.rotation.x) * 0.06;
    g.rotation.y += (targetY - g.rotation.y) * 0.06 + delta * 0.02;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.3} rotationIntensity={0.5} floatIntensity={1}>
        <mesh>
          {variant === "octa" && <octahedronGeometry args={[1.6, 0]} />}
          {variant === "icosa" && <icosahedronGeometry args={[1.6, 1]} />}
          {variant === "torus" && <torusGeometry args={[1.25, 0.45, 16, 64]} />}
          {variant === "knot" && <torusKnotGeometry args={[1.05, 0.32, 120, 16]} />}
          <meshBasicMaterial color="#6a3f9c" wireframe transparent opacity={0.35} />
        </mesh>
        <mesh scale={0.45} rotation={[0.5, 0.8, 0]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#F58963" wireframe transparent opacity={0.22} />
        </mesh>
      </Float>
    </group>
  );
}

export default function PageShape({ variant }: { variant: ShapeVariant }) {
  useEffect(() => {
    function onMove(e: MouseEvent) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5], fov: 45 }}
      className="pointer-events-none!"
    >
      <Shape variant={variant} />
    </Canvas>
  );
}
