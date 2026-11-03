import { create } from "zustand";
import { readStoredValue, writeStoredValue } from "@/lib/storage";
import type { CurrentUser } from "@/features/auth/repository";
import type { LearnerOnboarding } from "@/types/domain";

type SavedAccount = { user: CurrentUser; email: string; password: string };
type AuthSnapshot = { currentUser: CurrentUser | null; account: SavedAccount | null };
type AuthState = AuthSnapshot & {
  hasHydrated: boolean;
  hasLoggedOut: boolean;
  hasJustRegistered: boolean;
  hydrate: () => void;
  clearLogoutIntent: () => void;
  clearRegistrationIntent: () => void;
  register: (name: string, email: string, password: string) => void;
  login: (email: string, password: string) => boolean;
  saveOnboarding: (onboarding: LearnerOnboarding) => boolean;
  logout: () => void;
};

const storageKey = "pathforge-auth";

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  account: null,
  hasHydrated: false,
  hasLoggedOut: false,
  hasJustRegistered: false,
  hydrate: () => set({ ...readStoredValue<AuthSnapshot>(storageKey, { currentUser: null, account: null }), hasHydrated: true, hasLoggedOut: false, hasJustRegistered: false }),
  clearLogoutIntent: () => set({ hasLoggedOut: false }),
  clearRegistrationIntent: () => set({ hasJustRegistered: false }),
  register: (name, email, password) => {
    const user = { id: email.toLowerCase(), name: name.trim(), email: email.trim().toLowerCase() };
    const account = { user, email: user.email, password };
    const snapshot = { currentUser: user, account };
    writeStoredValue(storageKey, snapshot);
    set({ ...snapshot, hasLoggedOut: false, hasJustRegistered: true });
  },
  login: (email, password) => {
    const account = get().account;
    if (!account || account.email !== email.trim().toLowerCase() || account.password !== password) return false;
    const snapshot = { currentUser: account.user, account };
    writeStoredValue(storageKey, snapshot);
    set({ ...snapshot, hasLoggedOut: false, hasJustRegistered: false });
    return true;
  },
  saveOnboarding: (onboarding) => {
    const currentUser = get().currentUser;
    if (!currentUser) return false;
    const updatedUser = { ...currentUser, onboarding };
    const account = get().account ? { ...get().account!, user: updatedUser } : null;
    const snapshot = { currentUser: updatedUser, account };
    writeStoredValue(storageKey, snapshot);
    set(snapshot);
    return true;
  },
  logout: () => {
    const snapshot = { currentUser: null, account: get().account };
    writeStoredValue(storageKey, snapshot);
    set({ ...snapshot, hasLoggedOut: true, hasJustRegistered: false });
  },
}));