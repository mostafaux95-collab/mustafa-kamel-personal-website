import { useState } from "react";
import { motion } from "framer-motion";

export default function SpringToggle() {
  const [on, setOn] = useState(false);

  return (
    <button
      onClick={() => setOn((v) => !v)}
      data-cursor="view"
      aria-pressed={on}
      className="flex h-10 w-20 items-center rounded-full p-1 transition-colors"
      style={{ backgroundColor: on ? "var(--color-accent)" : "rgba(255,255,255,0.1)" }}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className="h-8 w-8 rounded-full bg-ink shadow-md"
        style={{ marginLeft: on ? "calc(100% - 2rem)" : 0 }}
      />
    </button>
  );
}
