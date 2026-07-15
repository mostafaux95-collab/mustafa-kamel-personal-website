export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
}

export const experience: ExperienceEntry[] = [
  {
    id: "tamm",
    company: "tamm",
    role: "Digital Product Designer",
    period: "Oct 2024 - Feb 2026",
    location: "Cairo, Egypt · Remote",
    summary:
      "Leading design for the Seller Dashboard and the design system powering Saudi Arabia's fastest-growing e-commerce platform for local sellers.",
    highlights: [
      "Led the Seller Dashboard end to end, the primary workspace for Saudi-based e-commerce sellers.",
      "Shipped Store Templates, Tamm Admin, and the Tamm Template Editor, giving sellers real control over their storefronts.",
      "Built and maintains the Tamm Design System from the ground up for consistency at scale.",
      "Shaped AI-driven features for both sellers and shoppers across the platform.",
      "Partners daily with PM and engineering to keep design, UX, and business goals aligned.",
    ],
  },
  {
    id: "salla",
    company: "Salla",
    role: "Digital Product Designer (UX/UI)",
    period: "Sep 2021 - Sep 2024",
    location: "Saudi Arabia · Remote",
    summary:
      "Three years designing Salla Business, translating business requirements into research-backed design systems used across a major e-commerce platform.",
    highlights: [
      "Owned UX from research through implementation, working closely with PMs and engineering.",
      "Ran user research and usability testing that directly informed roadmap decisions.",
      "Built and maintained UI patterns and UX processes for Salla Business.",
      "Established a comprehensive design system aligned to brand guidelines, adopted platform-wide.",
      "Produced wireframes-to-prototype flows supporting product launches and promotions.",
    ],
  },
  {
    id: "freelance",
    company: "Freelance",
    role: "Product Designer",
    period: "Dec 2020 - May 2021",
    location: "Egypt · On-site",
    summary:
      "Early-career sprint building consumer-grade products across fashion e-commerce (Romeo), F&B (Egyswiss), and data platforms (Bayanat).",
    highlights: [
      "Collaborated across teams to ship consumer-grade enterprise products.",
      "Ran stakeholder research to identify real problems before designing.",
      "Delivered full flows, wireframes, mockups, prototypes, for Romeo, Egyswiss, and Bayanat.",
      "Provided design QA support through engineering implementation.",
    ],
  },
];
