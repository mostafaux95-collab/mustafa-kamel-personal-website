import { motion } from "framer-motion";
import clsx from "clsx";

export default function GradientMesh({ className }: { className?: string }) {
  return (
    <div className={clsx("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="absolute -left-1/4 top-[-10%] h-[60vh] w-[60vh] rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--color-primary-soft), transparent 70%)" }}
        animate={{ x: [0, 60, -20, 0], y: [0, 40, -30, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-10%] top-[10%] h-[50vh] w-[50vh] rounded-full opacity-30 blur-[130px]"
        style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)" }}
        animate={{ x: [0, -50, 30, 0], y: [0, -30, 40, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[20%] bottom-[-20%] h-[55vh] w-[55vh] rounded-full opacity-30 blur-[130px]"
        style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)" }}
        animate={{ x: [0, 40, -40, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />
    </div>
  );
}
