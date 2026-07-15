declare module "*.mdx" {
  import type { ComponentType } from "react";

  export const frontmatter: {
    title: string;
    date: string;
    excerpt: string;
    readTime: string;
    tags?: string[];
  };

  const MDXComponent: ComponentType<{ components?: Record<string, ComponentType> }>;
  export default MDXComponent;
}
