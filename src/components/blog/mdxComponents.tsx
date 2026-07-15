import type { ComponentPropsWithoutRef } from "react";

export const mdxComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-14 mb-4 font-display text-2xl font-semibold text-ink" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-10 mb-3 font-display text-xl font-semibold text-ink" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-6 text-lg leading-relaxed text-[var(--color-ink-secondary)]" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-accent-soft)]"
      {...props}
    />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-6 flex flex-col gap-3 ps-1" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="flex gap-3 ps-5 text-lg leading-relaxed text-[var(--color-ink-secondary)] [&>*:first-child]:-ms-5">
      <span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-ink/30" />
      <span {...props} />
    </li>
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-ink" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-8 border-l-2 border-[var(--color-accent)] ps-6 text-lg italic text-ink/80"
      {...props}
    />
  ),
};
