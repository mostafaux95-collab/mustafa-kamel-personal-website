import type { ReactNode } from "react";
import clsx from "clsx";

export default function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "mx-auto w-full max-w-(--container-portfolio) px-6 sm:px-10 lg:px-16",
        className,
      )}
    >
      {children}
    </div>
  );
}
