import type { ComponentType } from "react";

interface Frontmatter {
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  tags?: string[];
}

interface MdxModule {
  frontmatter: Frontmatter;
  default: ComponentType<{ components?: Record<string, ComponentType> }>;
}

const modules = import.meta.glob<MdxModule>("/src/content/blog/*.mdx", { eager: true });

export interface BlogPost extends Frontmatter {
  slug: string;
  Component: MdxModule["default"];
}

export const blogPosts: BlogPost[] = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = path.split("/").pop()!.replace(/\.mdx$/, "");
    return { slug, ...mod.frontmatter, Component: mod.default };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
