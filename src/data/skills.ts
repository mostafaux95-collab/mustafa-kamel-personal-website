export type SkillCategory =
  | "Design"
  | "Research"
  | "Systems"
  | "AI"
  | "Frontend"
  | "Leadership";

export interface Skill {
  name: string;
  category: SkillCategory;
  detail: string;
}

export const categoryColors: Record<SkillCategory, string> = {
  Design: "#F58963",
  Research: "#6a3f9c",
  Systems: "#432666",
  AI: "#F58963",
  Frontend: "#8a8a94",
  Leadership: "#c9a5e8",
};

export const skills: Skill[] = [
  { name: "Product Strategy", category: "Design", detail: "Framing problems in business terms before touching a screen." },
  { name: "Interaction Design", category: "Design", detail: "Micro-interactions and flows that feel inevitable, not decorated." },
  { name: "Visual Design", category: "Design", detail: "Editorial-grade typography, layout, and hierarchy." },
  { name: "Prototyping", category: "Design", detail: "High-fidelity Figma prototypes that hold up to real usability testing." },
  { name: "User Research", category: "Research", detail: "Stakeholder interviews and usability testing that shape roadmaps." },
  { name: "Usability Testing", category: "Research", detail: "Closing the loop between what's shipped and what's learned." },
  { name: "Competitive Analysis", category: "Research", detail: "Reading the market so decisions aren't made in a vacuum." },
  { name: "Design Systems", category: "Systems", detail: "Token-based systems built to scale across teams, not just files." },
  { name: "Design Tokens", category: "Systems", detail: "Single source of truth for color, type, spacing, and motion." },
  { name: "Component Architecture", category: "Systems", detail: "Structuring components the way engineers will actually consume them." },
  { name: "AI Product Design", category: "AI", detail: "Designing AI-assisted flows for sellers and shoppers on tamm." },
  { name: "AI-assisted UX", category: "AI", detail: "Using AI to surface the next best action instead of another menu." },
  { name: "HTML / CSS", category: "Frontend", detail: "Comfortable enough in the browser to protect design intent in code." },
  { name: "Design-Dev Handoff", category: "Frontend", detail: "Specs and tokens engineers don't have to guess about." },
  { name: "Design Leadership", category: "Leadership", detail: "Fostering a design culture focused on continuous, user-centered iteration." },
  { name: "Cross-functional Collaboration", category: "Leadership", detail: "Aligning design, PM, and engineering around one goal." },
];
