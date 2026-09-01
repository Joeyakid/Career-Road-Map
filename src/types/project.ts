import type { Accent, Difficulty } from "@/types/domain";

export type SkillId = "html" | "css" | "javascript" | "react" | "figma" | "ux-research" | "design-systems";

export type Project = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedTime: string;
  skills: SkillId[];
  outcomes: string[];
  category: "Frontend" | "JavaScript" | "React" | "Product Design";
  accent: Extract<Accent, "blue" | "teal" | "violet" | "orange">;
};
