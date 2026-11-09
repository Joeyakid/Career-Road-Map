import type { LearnerOnboarding, UserProfile } from "@/types/domain";

export type CurrentUser = UserProfile & { onboarding?: LearnerOnboarding };

export interface AuthRepository {
  getCurrentUser(): Promise<CurrentUser | null>;
  signOut(): Promise<void>;
}
