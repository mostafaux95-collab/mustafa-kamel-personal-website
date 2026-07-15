import { lazy, Suspense } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const FloatingWireframe = lazy(() => import("@/components/three/FloatingWireframe"));

export default function HeroScene() {
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute end-0 top-1/2 hidden h-[560px] w-[560px] -translate-y-1/2 opacity-70 lg:block"
    >
      <Suspense fallback={null}>
        <FloatingWireframe />
      </Suspense>
    </div>
  );
}
