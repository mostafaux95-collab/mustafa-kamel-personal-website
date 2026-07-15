import { useRef } from "react";
import type { ReactNode } from "react";
import clsx from "clsx";

export default function Magnetic({
  children,
  className,
  cursor,
  strength,
}: {
  children: ReactNode;
  className?: string;
  cursor?: "link" | "view" | "drag";
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={ref}
      data-cursor-magnetic
      data-cursor={cursor ?? "link"}
      data-magnetic-strength={strength}
      className={clsx("inline-block transition-transform duration-300 ease-out", className)}
      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = "";
      }}
    >
      {children}
    </div>
  );
}
