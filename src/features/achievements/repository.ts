export type AchievementProgress = { achievementId: string; unlockedAt?: string; progress: number };

export interface AchievementRepository {
  listForCurrentUser(): Promise<AchievementProgress[]>;
}
