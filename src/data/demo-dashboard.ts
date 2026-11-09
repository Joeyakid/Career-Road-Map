import type { CurrentUser } from "@/features/auth/repository";

export const demoDashboardUser: CurrentUser = {
  id: "demo-learner",
  name: "Jordan Lee",
  email: "jordan@example.com",
  selectedCareer: "frontend-development",
  experienceLevel: "Beginner",
  weeklyAvailability: "8–14 hours",
  careerGoal: "Build a portfolio",
  createdAt: "2026-01-15T10:00:00.000Z",
  progress: 67,
  completedSkills: ["html-css-foundations", "javascript-interactions"],
  inProgressSkills: ["frontend-architecture"],
  completedProjects: ["portfolio-website"],
  bookmarkedResources: [],
  achievements: ["beginner-developer", "roadmap-explorer", "project-builder"],
  learningStreak: 7,
  xp: 850,
  currentSkill: "frontend-architecture",
  onboarding: {
    careerId: "frontend-development",
    experienceLevel: "Beginner",
    weeklyCommitment: "8–14 hours",
    learningGoal: "Build a portfolio",
  },
};
