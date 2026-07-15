import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import { blogPosts } from "@/lib/blogPosts";

export default function Blog() {
  return (
    <>
      <Nav />
      <main className="pt-40 pb-32">
        <Container>
          <FadeIn>
            <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
              Writing
            </span>
            <h1 className="mt-6 max-w-2xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Notes on product design, systems, and AI
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[var(--color-ink-secondary)]">
              Longer-form thinking that doesn't fit in a case study - process, opinions, and
              things I changed my mind about.
            </p>
          </FadeIn>

          <div className="mt-20 divide-y divide-white/[0.08] border-t border-ink/[0.08]">
            {blogPosts.map((post, i) => (
              <FadeIn key={post.slug} delay={i * 0.05}>
                <Link
                  to={`/blog/${post.slug}`}
                  data-cursor="view"
                  className="group grid grid-cols-1 gap-3 py-10 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                >
                  <span className="font-display text-xs uppercase tracking-widest text-[var(--color-ink-muted)] sm:col-span-2">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <div className="sm:col-span-8">
                    <h2 className="font-display text-2xl font-semibold text-ink transition-colors group-hover:text-[var(--color-accent)] sm:text-3xl">
                      {post.title}
                    </h2>
                    <p className="mt-3 max-w-xl text-[var(--color-ink-secondary)]">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:col-span-2 sm:flex-col sm:items-end sm:justify-start sm:gap-2">
                    <span className="text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">
                      {post.readTime}
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="text-ink/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-accent)]"
                    />
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
