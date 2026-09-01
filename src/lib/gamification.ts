export type AchievementId = "beginner-developer" | "roadmap-explorer" | "project-builder";

export type GamificationState = {
  xp: number;
  completedSkills: string[];
  completedRoadmapStages: number;
  completedProjects: string[];
  unlockedAchievements: AchievementId[];
};

export const achievements: { id: AchievementId; title: string; description: string; requirement: string; xp: number; tone: "blue" | "teal" | "violet" }[] = [
  { id: "beginner-developer", title: "Beginner Developer", description: "Complete your first 3 skills.", requirement: "3 skills completed", xp: 150, tone: "blue" },
  { id: "roadmap-explorer", title: "Roadmap Explorer", description: "Complete your first roadmap stage.", requirement: "1 roadmap stage", xp: 200, tone: "teal" },
  { id: "project-builder", title: "Project Builder", description: "Complete your first project.", requirement: "1 project completed", xp: 300, tone: "violet" },
];

const storageKey = "pathforge-gamification";
const initial: GamificationState = { xp: 240, completedSkills: ["design-fundamentals", "ux-research"], completedRoadmapStages: 0, completedProjects: [], unlockedAchievements: [] };

function evaluate(state: GamificationState): AchievementId[] {
  return achievements.filter(({ id }) => id === "beginner-developer" ? state.completedSkills.length >= 3 : id === "roadmap-explorer" ? state.completedRoadmapStages >= 1 : state.completedProjects.length >= 1).map(({ id }) => id);
}

export function getGamificationState(): GamificationState {
  if (typeof window === "undefined") return initial;
  try { return { ...initial, ...JSON.parse(localStorage.getItem(storageKey) || "{}") }; } catch { return initial; }
}

export function updateGamification(mutator: (state: GamificationState) => GamificationState) {
  const draft = mutator(getGamificationState());
  const previous = new Set(draft.unlockedAchievements);
  const unlockedAchievements = evaluate(draft);
  const newlyUnlocked = unlockedAchievements.filter((id) => !previous.has(id));
  const xpEarned = newlyUnlocked.reduce((sum, id) => sum + achievements.find((item) => item.id === id)!.xp, 0);
  const state = { ...draft, xp: draft.xp + xpEarned, unlockedAchievements };
  localStorage.setItem(storageKey, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("pathforge-gamification-updated", { detail: { state, newlyUnlocked } }));
  return { state, newlyUnlocked };
}

export const recordSkillCompletion = (id: string) => updateGamification((state) => ({ ...state, completedSkills: state.completedSkills.includes(id) ? state.completedSkills : [...state.completedSkills, id], completedRoadmapStages: Math.max(state.completedRoadmapStages, 1) }));
export const recordProjectCompletion = (id: string) => updateGamification((state) => ({ ...state, completedProjects: state.completedProjects.includes(id) ? state.completedProjects : [...state.completedProjects, id] }));

export function syncKnownProgress() {
  const figmaComplete = localStorage.getItem("pathforge-skill-figma-essentials") === "complete";
  if (!figmaComplete) return { state: getGamificationState(), newlyUnlocked: [] as AchievementId[] };
  return recordSkillCompletion("figma-essentials");
}
