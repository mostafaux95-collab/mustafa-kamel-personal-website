export interface CaseStudyChapter {
  id: string;
  label: string;
  title: string;
  body: string[];
}

export interface CaseStudyData {
  slug: string;
  company: string;
  title: string;
  role: string;
  timeline: string;
  team: string;
  coverFrom: string;
  coverTo: string;
  overview: string;
  chapters: CaseStudyChapter[];
  gallery: { title: string; from: string; to: string }[];
  impact: { label: string; value: string }[];
  reflection: string;
}

export const caseStudies: Record<string, CaseStudyData> = {
  "tamm-seller-dashboard": {
    slug: "tamm-seller-dashboard",
    company: "tamm",
    title: "Seller Dashboard",
    role: "Lead Product Designer",
    timeline: "Oct 2024 - Present",
    team: "1 PM · 2 designers · 6 engineers",
    coverFrom: "#432666",
    coverTo: "#1a0f2e",
    overview:
      "tamm is building the storefront layer for Saudi Arabia's local e-commerce sellers. As Lead Product Designer, I owned the Seller Dashboard, the daily workspace sellers use to manage orders, inventory, storefront templates, and promotions, from the first wireframe through the design system that now powers it.",
    chapters: [
      {
        id: "problem",
        label: "01",
        title: "The Problem",
        body: [
          "Sellers onboarding onto tamm were dropping off before they ever published a live storefront. Support tickets kept pointing at the same root cause: the dashboard was a collection of disconnected tools bolted together as the platform grew, not a single coherent workspace.",
          "Store setup, template editing, order management, and promotions each lived in a different mental model. A seller migrating from Instagram or WhatsApp commerce had no clear path from 'I have products' to 'I have a live store.'",
        ],
      },
      {
        id: "research",
        label: "02",
        title: "Research",
        body: [
          "I sat in on seller support calls and pulled onboarding funnel data to find exactly where sellers stalled, overwhelmingly at the storefront template step, where there was no live preview and no way to undo a change with confidence.",
          "Competitive analysis across regional and global storefront builders showed the same pattern winning everywhere: instant visual feedback beats configuration forms. That became the north star for the redesign.",
        ],
      },
      {
        id: "iterations",
        label: "03",
        title: "Iterations",
        body: [
          "Early explorations tried to preserve the existing form-based editor with better labels, usability testing killed that direction fast; sellers still couldn't connect a settings panel to what shoppers would actually see.",
          "The direction that stuck flipped the model entirely: a live, editable storefront preview as the primary canvas, with settings as a secondary layer on top of it. That single change became the foundation for the Template Editor.",
        ],
      },
      {
        id: "system",
        label: "04",
        title: "Design System",
        body: [
          "Rebuilding the dashboard on ad hoc components wasn't sustainable with a growing surface area, Seller Dashboard, Store Templates, Tamm Admin, and the Template Editor all needed to share one visual and interaction language.",
          "I built the Tamm Design System in parallel with the dashboard work: tokens for color, spacing, and type; a shared component library; and documented interaction states so engineering could implement without guessing.",
        ],
      },
    ],
    gallery: [
      { title: "Seller Dashboard · Overview", from: "#432666", to: "#1a0f2e" },
      { title: "Template Editor · Live Preview", from: "#5a3a86", to: "#241640" },
      { title: "Order Management", from: "#3a2a5c", to: "#161022" },
      { title: "Design System · Components", from: "#F58963", to: "#7a3d28" },
    ],
    impact: [
      { label: "Onboarding steps", value: "12 → 5" },
      { label: "Design system components shipped", value: "80+" },
      { label: "Seller workflows redesigned", value: "12" },
    ],
    reflection:
      "The biggest lesson from this project wasn't visual, it was structural. Sellers didn't need a prettier settings panel; they needed the dashboard to mirror how they already thought about their store. Once the live preview became the canvas instead of an afterthought, everything else, the design system, the AI-assisted flows, the admin tools, had a foundation to build on.",
  },
  "salla-business": {
    slug: "salla-business",
    company: "Salla",
    title: "Salla Business Platform",
    role: "Product Designer (UX/UI)",
    timeline: "Sep 2021 - Sep 2024",
    team: "Rotating pod · PMs, engineering, customer success",
    coverFrom: "#2e1f4a",
    coverTo: "#12101c",
    overview:
      "Salla is one of the largest e-commerce platforms in the region. Over three years I owned UX for Salla Business, the merchant-facing surface, from research through implementation, and built the design system that held the growing product together.",
    chapters: [
      {
        id: "problem",
        label: "01",
        title: "The Problem",
        body: [
          "Salla Business was growing fast, and every team was shipping features on its own visual conventions. Buttons, spacing, and even core patterns like empty states looked different depending on which squad built the screen, and merchants noticed.",
          "There was no shared UX process either, research happened inconsistently, so usability problems were often found by support tickets instead of testing.",
        ],
      },
      {
        id: "research",
        label: "02",
        title: "Research",
        body: [
          "I introduced a standing usability testing cadence tied to the roadmap instead of one-off studies, so every major surface got tested before and after ship.",
          "Interviews with merchants across different business sizes (from single-product stores to multi-branch retailers) surfaced a recurring theme: power users wanted density and shortcuts, while new merchants needed guardrails. The design system had to serve both without forking the product.",
        ],
      },
      {
        id: "system",
        label: "03",
        title: "Design System",
        body: [
          "I led the effort to establish a comprehensive design system aligned to Salla's brand guidelines, tokens, components, and documented UI patterns that any squad could adopt without reinventing them.",
          "Rather than mandate adoption top-down, I worked embedded with squads shipping high-visibility features first, so the system proved itself on real launches before asking every team to migrate.",
        ],
      },
      {
        id: "process",
        label: "04",
        title: "Process",
        body: [
          "I worked closely with PMs and engineering from conception through implementation on every feature I owned, including collaborating with business development on the design side of product launches and promotions.",
          "Design QA became a standing part of every release, closing the loop between what was designed, tested, and actually shipped.",
        ],
      },
    ],
    gallery: [
      { title: "Salla Business · Dashboard", from: "#2e1f4a", to: "#12101c" },
      { title: "Design System · Patterns", from: "#432666", to: "#1a0f2e" },
      { title: "Merchant Onboarding", from: "#3a2a5c", to: "#161022" },
      { title: "Promotions & Launches", from: "#5a3a86", to: "#241640" },
    ],
    impact: [
      { label: "Tenure", value: "3 years" },
      { label: "Design system adoption", value: "Platform-wide" },
      { label: "Research-informed launches", value: "Multiple" },
    ],
    reflection:
      "Design systems don't fail on craft, they fail on adoption. Proving the system on real, high-visibility launches before asking other squads to migrate turned out to matter more than any component's visual polish, trust in the system had to be earned feature by feature.",
  },
  "romeo-egyswiss": {
    slug: "romeo-egyswiss",
    company: "Freelance",
    title: "Romeo & Egyswiss",
    role: "Product Designer",
    timeline: "Dec 2020 - May 2021",
    team: "Solo designer · direct with founders & engineers",
    coverFrom: "#1f1f26",
    coverTo: "#0d0d11",
    overview:
      "Early in my career I worked directly with founders on two consumer products, Romeo, a fashion e-commerce storefront, and Egyswiss, an F&B brand, taking each from stakeholder conversations to a shipped, engineer-QA'd interface.",
    chapters: [
      {
        id: "problem",
        label: "01",
        title: "The Problem",
        body: [
          "Both brands needed a credible digital storefront fast, without an in-house design or research team to validate direction, every decision had to be defensible with lightweight evidence, not a full research program.",
          "Romeo's challenge was translating an in-person retail experience (browsing racks, trying combinations) into an online flow that still felt considered. Egyswiss needed a menu-and-ordering experience that felt as premium as the food itself.",
        ],
      },
      {
        id: "research",
        label: "02",
        title: "Research",
        body: [
          "With no budget for formal research, I ran structured stakeholder interviews to extract what a full research team would normally surface, who the customer was, what almost stopped them from buying, and what 'premium' meant to each founder concretely, not just as a word.",
          "For Romeo, that meant studying how shoppers actually browsed physical racks, by outfit, not by category, and mirroring that logic in the site's navigation.",
        ],
      },
      {
        id: "delivery",
        label: "03",
        title: "From Wireframe to Shipped",
        body: [
          "I moved quickly from low-fidelity wireframes to high-fidelity prototypes for both products, keeping founders in the loop at each stage rather than presenting a single final reveal.",
          "I stayed embedded through engineering implementation, providing design QA so the shipped product matched intent, catching spacing, state, and edge-case drift before customers saw it.",
        ],
      },
    ],
    gallery: [
      { title: "Romeo · Storefront", from: "#1f1f26", to: "#0d0d11" },
      { title: "Romeo · Product Detail", from: "#2a2a33", to: "#0d0d11" },
      { title: "Egyswiss · Menu & Ordering", from: "#3d2a1f", to: "#160f0a" },
    ],
    impact: [
      { label: "Products shipped", value: "3" },
      { label: "Full flows delivered", value: "Wireframe → Prototype" },
      { label: "Design QA passes", value: "Every release" },
    ],
    reflection:
      "Without a research team, the discipline has to move earlier, into how you structure stakeholder conversations. Treating founder interviews as real research inputs, not just sign-off meetings, made up for the lack of a formal research budget on both products.",
  },
};
