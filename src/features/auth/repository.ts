import type { LearnerOnboarding } from "@/types/domain";

export type CurrentUser = { id: string; name: string; email: string; onboarding?: LearnerOnboarding };

export interface AuthRepository {
  getCurrentUser(): Promise<CurrentUser | null>;
  signOut(): Promise<void>;
}
