import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Vector3 } from "three";
import type { Group, Points, BufferAttribute } from "three";
import { knotSpin } from "@/lib/heroInteraction";

const mouse = { x: 0, y: 0 };
const mouseClient = { x: -9999, y: -9999 };

function ParticleField({ count = 400 }: { count?: number }) {
  const pointsRef = useRef<Points>(null);
  const { camera, gl } = useThree();
  const probe = useMemo(() => new Vector3(), []);
  const mouseWorld = useMemo(() => new Vector3(), []);

  const home = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Random points in a spherical shell so the knot stays visible inside
      const r = 2.2 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);
  const positions = useMemo(() => home.slice(), [home]);
  const vel = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    const attr = points.geometry.attributes.position as BufferAttribute;
    const arr = attr.array as Float32Array;
    const dt = Math.min(delta, 0.05);

    // Pointer position on the z=0 plane, in this canvas's NDC space
    const rect = gl.domElement.getBoundingClientRect();
    const nx = ((mouseClient.x - rect.left) / rect.width) * 2 - 1;
    const ny = -(((mouseClient.y - rect.top) / rect.height) * 2 - 1);
    probe.set(nx, ny, 0.5).unproject(camera).sub(camera.position).normalize();
    const planeDist = -camera.position.z / probe.z;
    mouseWorld.copy(camera.position).addScaledVector(probe, planeDist);

    const R = 1.5;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      // Repulsion away from the cursor
      const dx = arr[ix] - mouseWorld.x;
      const dy = arr[ix + 1] - mouseWorld.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < R * R) {
        const d = Math.sqrt(d2) || 0.001;
        const f = ((1 - d / R) * 7 * dt) / d;
        vel[ix] += dx * f;
        vel[ix + 1] += dy * f;
      }
      // Spring back home + damping
      vel[ix] += (home[ix] - arr[ix]) * 2.4 * dt;
      vel[ix + 1] += (home[ix + 1] - arr[ix + 1]) * 2.4 * dt;
      vel[ix + 2] += (home[ix + 2] - arr[ix + 2]) * 2.4 * dt;
      vel[ix] *= 0.92;
      vel[ix + 1] *= 0.92;
      vel[ix + 2] *= 0.92;
      arr[ix] += vel[ix];
      arr[ix + 1] += vel[ix + 1];
      arr[ix + 2] += vel[ix + 2];
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#F58963" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

function Knot() {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;

    // Thrown-spin inertia from the drag hotspot
    g.rotation.y += knotSpin.vy;
    g.rotation.x += knotSpin.vx;
    knotSpin.vx = Math.max(-0.3, Math.min(0.3, knotSpin.vx * 0.94));
    knotSpin.vy = Math.max(-0.3, Math.min(0.3, knotSpin.vy * 0.94));

    // Ambient mouse-follow, muted while spinning or dragging
    const spinning = knotSpin.dragging || Math.abs(knotSpin.vx) + Math.abs(knotSpin.vy) > 0.004;
    if (!spinning) {
      const scroll = typeof window !== "undefined" ? window.scrollY : 0;
      const targetX = mouse.y * 0.35 + scroll * 0.0006;
      const targetY = mouse.x * 0.5 + scroll * 0.0009 + state.clock.elapsedTime * 0.06;
      g.rotation.x += (targetX - g.rotation.x) * 0.06;
      g.rotation.y += (targetY - g.rotation.y) * 0.06 + delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.9}>
        <mesh>
          <torusKnotGeometry args={[1.15, 0.34, 150, 20]} />
          <meshBasicMaterial color="#6a3f9c" wireframe transparent opacity={0.3} />
        </mesh>
        <mesh scale={0.55}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#F58963" wireframe transparent opacity={0.18} />
        </mesh>
      </Float>
    </group>
  );
}

export default function FloatingWireframe() {
  useEffect(() => {
    // The canvas is pointer-events-none, so track the mouse at window level
    function onMove(e: MouseEvent) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
      mouseClient.x = e.clientX;
      mouseClient.y = e.clientY;
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      className="pointer-events-none!"
    >
      <Knot />
      <ParticleField />
    </Canvas>
  );
}
