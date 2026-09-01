import type { Project, SkillId } from "@/types/project";

export type ProjectRecommendation = {
  project: Project;
  matchedSkillIds: SkillId[];
  isReady: boolean;
  matchPercentage: number;
};

export function getProjectRecommendations(projects: Project[], completedSkills: SkillId[]): ProjectRecommendation[] {
  return projects
    .map((project) => {
      const matchedSkillIds = project.skills.filter((skill) => completedSkills.includes(skill));
      return {
        project,
        matchedSkillIds,
        isReady: matchedSkillIds.length === project.skills.length,
        matchPercentage: Math.round((matchedSkillIds.length / project.skills.length) * 100),
      };
    })
    .sort((a, b) => Number(b.isReady) - Number(a.isReady) || b.matchPercentage - a.matchPercentage || a.project.skills.length - b.project.skills.length);
}
