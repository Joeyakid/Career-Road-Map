import { getProjectRecommendations } from "@/features/projects/recommendations";
import type { Project, SkillId } from "@/types/project";

export type { Project, SkillId } from "@/types/project";

export const skills: { id: SkillId; label: string }[] = [
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "javascript", label: "JavaScript" },
  { id: "react", label: "React" },
  { id: "figma", label: "Figma" },
  { id: "ux-research", label: "UX research" },
  { id: "design-systems", label: "Design systems" },
];

export const projects: Project[] = [
  {
    id: "portfolio-website", title: "Portfolio website", category: "Frontend", accent: "blue", difficulty: "Beginner", estimatedTime: "4–6 hours", skills: ["html", "css"],
    description: "Design and build a personal portfolio that presents your work, skills, and next step with confidence.",
    outcomes: ["Structure a multi-section web page", "Create a responsive layout", "Publish a polished personal site"],
  },
  {
    id: "calculator", title: "Smart calculator", category: "JavaScript", accent: "teal", difficulty: "Beginner", estimatedTime: "3–4 hours", skills: ["html", "css", "javascript"],
    description: "Build a reliable calculator with keyboard support, input validation, and a satisfying responsive interface.",
    outcomes: ["Handle user events", "Work with application state", "Write clear conditional logic"],
  },
  {
    id: "weather-app", title: "Weather dashboard", category: "JavaScript", accent: "orange", difficulty: "Intermediate", estimatedTime: "6–8 hours", skills: ["html", "css", "javascript"],
    description: "Create a weather experience that transforms a location search into a clear daily forecast.",
    outcomes: ["Fetch and display API data", "Handle loading and error states", "Build a practical responsive UI"],
  },
  {
    id: "react-dashboard", title: "Analytics dashboard", category: "React", accent: "violet", difficulty: "Intermediate", estimatedTime: "10–14 hours", skills: ["html", "css", "javascript", "react"],
    description: "Build an interactive product dashboard with reusable components, charts, filters, and persistent preferences.",
    outcomes: ["Compose reusable React components", "Model application state", "Present data with meaningful visuals"],
  },
  {
    id: "case-study", title: "Product redesign case study", category: "Product Design", accent: "blue", difficulty: "Intermediate", estimatedTime: "8–12 hours", skills: ["figma", "ux-research"],
    description: "Research, redesign, and clearly communicate the product thinking behind an improved everyday experience.",
    outcomes: ["Frame a user problem", "Design a tested interface", "Tell a compelling project story"],
  },
  {
    id: "component-library", title: "Mini component library", category: "Product Design", accent: "teal", difficulty: "Advanced", estimatedTime: "10–12 hours", skills: ["figma", "design-systems"],
    description: "Create a consistent, documented component library ready for a small product team to use.",
    outcomes: ["Define component variants", "Create reusable design tokens", "Document design decisions"],
  },
];

export function recommendProjects(completed: SkillId[]) {
  return getProjectRecommendations(projects, completed).map(({ project, matchedSkillIds, isReady, matchPercentage }) => ({
    project,
    matched: matchedSkillIds,
    ready: isReady,
    match: matchPercentage / 100,
  }));
}
