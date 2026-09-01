import type { Difficulty } from "@/types/domain";

export type CareerResource = {
  id: string;
  title: string;
  url: string;
  kind: "article" | "course" | "video" | "documentation" | "tool" | "book";
  description: string;
};

export type CareerSkill = {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  estimatedDuration: string;
  prerequisites: string[];
  topics: string[];
  resources: CareerResource[];
  projects: string[];
};

export type CareerProject = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  requiredSkills: string[];
  estimatedDuration: string;
  learningOutcomes: string[];
};

export type CareerRoadmapStage = {
  id: string;
  title: string;
  summary: string;
  duration: string;
  outcomes: string[];
};

export type CareerPath = {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  difficulty: Difficulty;
  estimatedDuration: string;
  careerOutlook: string;
  skills: CareerSkill[];
  roadmapStages: CareerRoadmapStage[];
  recommendedProjects: CareerProject[];
  learningResources: CareerResource[];
};

export type CareerSummary = {
  id: string;
  title: string;
  difficulty: Difficulty;
  estimatedDuration: string;
  shortDescription: string;
};

export interface CareerRepository {
  list(): Promise<CareerSummary[]>;
  getById(id: string): Promise<CareerPath | null>;
  getAll(): Promise<CareerPath[]>;
}
