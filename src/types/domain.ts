export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type LearningStatus = "locked" | "unlocked" | "active" | "completed";
export type Accent = "blue" | "teal" | "violet" | "orange" | "indigo" | "green";

export type ExperienceLevel = "Complete Beginner" | "Beginner" | "Intermediate" | "Advanced";
export type WeeklyCommitment = "1–3 hours" | "4–7 hours" | "8–14 hours" | "15+ hours";
export type LearningGoal =
  | "Get my first tech job"
  | "Build a portfolio"
  | "Change careers"
  | "Improve my existing skills"
  | "Prepare for freelance work"
  | "Learn for personal development";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  selectedCareer: string | null;
  experienceLevel: ExperienceLevel | null;
  weeklyAvailability: WeeklyCommitment | null;
  careerGoal: LearningGoal | null;
  createdAt: string;
  progress: number;
  completedSkills: string[];
  inProgressSkills: string[];
  completedProjects: string[];
  bookmarkedResources: string[];
  achievements: string[];
  learningStreak: number;
  xp: number;
  currentSkill: string | null;
};

export type LearnerOnboarding = {
  careerId: string;
  experienceLevel: ExperienceLevel;
  weeklyCommitment: WeeklyCommitment;
  learningGoal: LearningGoal;
};

export type ResourceLink = {
  id: string;
  title: string;
  url: string;
  kind: "article" | "course" | "video" | "template";
};
