export type CurrentUser = { id: string; name: string; email: string };

export interface AuthRepository {
  getCurrentUser(): Promise<CurrentUser | null>;
  signOut(): Promise<void>;
}
