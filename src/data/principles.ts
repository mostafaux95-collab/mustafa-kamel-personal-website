export interface Principle {
  id: string;
  title: string;
  detail: string;
}

export const principles: Principle[] = [
  {
    id: "clarity",
    title: "Clarity over complexity",
    detail:
      "If a user needs a tooltip to understand a core flow, the design failed before the copy was written. I'd rather cut a feature than obscure one.",
  },
  {
    id: "systems",
    title: "Systems before screens",
    detail:
      "Every screen I design is a consequence of a system decision made earlier, tokens, components, states. Screens without systems don't scale past the first release.",
  },
  {
    id: "data",
    title: "Data informs intuition, it doesn't replace it",
    detail:
      "Research and usability testing tell me where I'm wrong. They rarely tell me what's right. That's still a design judgment call, and I own it.",
  },
  {
    id: "business",
    title: "Design for the business, not just the user",
    detail:
      "A beautiful flow that doesn't move a business metric is a portfolio piece, not a product. I design with margins, retention, and roadmap in the room.",
  },
  {
    id: "pixel",
    title: "Every pixel has a purpose",
    detail:
      "Decoration without function is noise. If I can't explain why a shadow, radius, or spacing value exists, it gets removed before it ships.",
  },
];
