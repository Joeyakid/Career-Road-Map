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
