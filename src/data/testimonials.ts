export interface Testimonial {
  id: string;
  quote: string;
  role: string;
  company: string;
  accent: string;
}

// Placeholder slots - no quotes have been collected yet, so these are
// intentionally generic rather than attributed to a specific person.
// Swap `quote` and `role`/`company` for real feedback as it comes in.
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Add a quote from a PM or founder you've worked closely with - what changed about the product once you were involved?",
    role: "Add role",
    company: "tamm",
    accent: "#432666",
  },
  {
    id: "t2",
    quote:
      "Add a quote from an engineer or design peer - what was it like collaborating with you day to day?",
    role: "Add role",
    company: "Salla",
    accent: "#6a3f9c",
  },
  {
    id: "t3",
    quote:
      "Add a quote from a client or stakeholder - what result mattered most to them?",
    role: "Add role",
    company: "Freelance client",
    accent: "#F58963",
  },
];
