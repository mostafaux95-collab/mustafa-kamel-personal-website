import { useRef } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Magnetic from "@/components/ui/Magnetic";
import { getPostBySlug } from "@/lib/blogPosts";
import { mdxComponents } from "@/components/blog/mdxComponents";

export default function BlogPost() {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;
  const articleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start start", "end end"],
  });

  if (!post) return <Navigate to="/blog" replace />;

  const { Component } = post;

  return (
    <>
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-[var(--color-accent)]"
      />
      <Nav />
      <main className="pt-40 pb-32">
        <Container className="max-w-3xl!">
          <FadeIn>
            <Magnetic cursor="link">
              <Link
                to="/blog"
                className="mb-10 inline-flex items-center gap-2 font-display text-sm font-medium text-ink/70 hover:text-ink"
              >
                <ArrowLeft size={16} />
                All writing
              </Link>
            </Magnetic>
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              {post.title}
            </h1>
            {post.tags && (
              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-ink/10 bg-ink/[0.02] px-3 py-1 text-xs font-medium text-ink/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </FadeIn>

          <div ref={articleRef} className="mt-16">
            <FadeIn>
              <Component components={mdxComponents} />
            </FadeIn>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
