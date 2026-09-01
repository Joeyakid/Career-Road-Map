export type LearnerProgress = { completedSkillIds: string[]; completedProjectIds: string[]; xp: number };

export interface ProgressRepository {
  getCurrent(): Promise<LearnerProgress>;
  save(progress: LearnerProgress): Promise<void>;
}
