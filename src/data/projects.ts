export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  slug: string;
  company: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  category: string;
  cover: {
    gradientFrom: string;
    gradientTo: string;
  };
  metrics: ProjectMetric[];
  challenge: string;
  solution: string;
  techStack: string[];
  tags: string[];
  hasCaseStudy: boolean;
}

export const projects: Project[] = [
  {
    id: "tamm-seller-dashboard",
    slug: "tamm-seller-dashboard",
    company: "tamm",
    title: "Seller Dashboard",
    tagline: "The command center for Saudi Arabia's local e-commerce sellers.",
    year: "2024 - 2026",
    role: "Lead Product Designer",
    category: "SaaS · E-commerce",
    cover: { gradientFrom: "#432666", gradientTo: "#1a0f2e" },
    metrics: [
      { label: "Design system components", value: "80+" },
      { label: "Seller workflows redesigned", value: "12" },
      { label: "Onboarding steps reduced", value: "12 → 5" },
    ],
    challenge:
      "Local sellers were switching between disconnected tools to manage orders, inventory, storefront templates, and promotions, with no single source of truth and a UI that didn't reflect how Saudi merchants actually work day to day.",
    solution:
      "Designed a unified Seller Dashboard from first principles: a modular workspace built on a new design system, with a Template Editor that gives sellers real storefront control without engineering support, and AI-assisted flows that surface the next best action instead of burying it in menus.",
    techStack: ["Figma", "Design Tokens", "React (implementation)", "AI-assisted UX"],
    tags: ["saas", "ecommerce"],
    hasCaseStudy: true,
  },
  {
    id: "salla-business",
    slug: "salla-business",
    company: "Salla",
    title: "Salla Business Platform",
    tagline: "Design systems and UX processes for a national e-commerce platform.",
    year: "2021 - 2024",
    role: "Product Designer (UX/UI)",
    category: "SaaS · E-commerce",
    cover: { gradientFrom: "#2e1f4a", gradientTo: "#12101c" },
    metrics: [
      { label: "Tenure", value: "3 years" },
      { label: "Design system adoption", value: "Platform-wide" },
      { label: "Research-informed launches", value: "Multiple" },
    ],
    challenge:
      "As Salla Business scaled, design patterns had drifted across teams, every new feature reinvented UI conventions, slowing delivery and eroding consistency for merchants relying on the platform daily.",
    solution:
      "Established a comprehensive design system aligned to brand guidelines, paired with a repeatable UX process from research through implementation, closing the loop between usability testing and what actually shipped.",
    techStack: ["Figma", "Design System", "Usability Testing", "Prototyping"],
    tags: ["saas", "ecommerce"],
    hasCaseStudy: true,
  },
  {
    id: "romeo-egyswiss",
    slug: "romeo-egyswiss",
    company: "Freelance",
    title: "Romeo & Egyswiss",
    tagline: "Consumer e-commerce and F&B experiences built from stakeholder research to shipped UI.",
    year: "2020 - 2021",
    role: "Product Designer",
    category: "E-commerce · F&B",
    cover: { gradientFrom: "#1f1f26", gradientTo: "#0d0d11" },
    metrics: [
      { label: "Products shipped", value: "3" },
      { label: "Full flows delivered", value: "Wireframe → Prototype" },
    ],
    challenge:
      "Early-stage brands needed credible digital storefronts fast, without the luxury of an in-house design or research team to validate direction.",
    solution:
      "Ran lightweight stakeholder research to define real problems, then moved quickly from wireframes to high-fidelity prototypes, staying embedded through engineering QA to protect the design intent.",
    techStack: ["Figma", "Prototyping", "Design QA"],
    tags: ["ecommerce", "fnb"],
    hasCaseStudy: true,
  },
];
