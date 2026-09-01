export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type LearningStatus = "locked" | "unlocked" | "active" | "completed";
export type Accent = "blue" | "teal" | "violet" | "orange" | "indigo" | "green";

export type ResourceLink = {
  id: string;
  title: string;
  url: string;
  kind: "article" | "course" | "video" | "template";
};
