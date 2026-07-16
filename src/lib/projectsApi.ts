// Shared shape for the Project entity as returned by the public API
// (server/src/projects) — used by both the grid/card list view and the
// individual case study page, since the backend returns the full row in
// both cases.
export interface ProjectMetric {
  value: string;
  label: string;
  labelAr?: string | null;
}

export interface ApiProject {
  id: string;
  slug: string;
  title: string;
  titleAr: string | null;
  company: string;
  tagline: string;
  taglineAr: string | null;
  role: string;
  roleAr: string | null;
  category: string;
  year: string;
  coverGradientFrom: string;
  coverGradientTo: string;
  thumbnailUrl: string | null;
  coverImageUrl: string | null;
  galleryUrls: string[];
  challenge: string;
  challengeAr: string | null;
  solution: string;
  solutionAr: string | null;
  metrics: ProjectMetric[];
  techStack: string[];
  tags: string[];
  hasCaseStudy: boolean;
  metaTitle: string | null;
  metaTitleAr: string | null;
  metaDescription: string | null;
  metaDescriptionAr: string | null;
}
