import { create } from "zustand";
import { readStoredValue, writeStoredValue } from "@/lib/storage";
import type { CurrentUser } from "@/features/auth/repository";
import { careerPathById } from "@/data/careers/mock-careers";
import type { CareerPath } from "@/types/career";
import type { LearnerOnboarding } from "@/types/domain";
import type { LearnerProgress } from "@/features/progress/repository";

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
  syncLearningProgress: (career: CareerPath, progress: LearnerProgress) => void;
  syncAchievements: (achievementIds: string[], xp: number) => void;
  logout: () => void;
};

const storageKey = "pathforge-auth";

function createUser(name: string, email: string): CurrentUser {
  const normalizedEmail = email.trim().toLowerCase();
  return {
    id: normalizedEmail,
    name: name.trim(),
    email: normalizedEmail,
    selectedCareer: null,
    experienceLevel: null,
    weeklyAvailability: null,
    careerGoal: null,
    createdAt: new Date().toISOString(),
    progress: 0,
    completedSkills: [],
    inProgressSkills: [],
    completedProjects: [],
    bookmarkedResources: [],
    achievements: [],
    learningStreak: 0,
    xp: 0,
    currentSkill: null,
  };
}

function normalizeUser(user: CurrentUser | null): CurrentUser | null {
  if (!user) return null;
  return {
    ...createUser(user.name, user.email),
    ...user,
    selectedCareer: user.selectedCareer ?? user.onboarding?.careerId ?? null,
    experienceLevel: user.experienceLevel ?? user.onboarding?.experienceLevel ?? null,
    weeklyAvailability: user.weeklyAvailability ?? user.onboarding?.weeklyCommitment ?? null,
    careerGoal: user.careerGoal ?? user.onboarding?.learningGoal ?? null,
    progress: user.progress ?? 0,
    completedSkills: user.completedSkills ?? [],
    inProgressSkills: user.inProgressSkills ?? [],
    completedProjects: user.completedProjects ?? [],
    bookmarkedResources: user.bookmarkedResources ?? [],
    achievements: user.achievements ?? [],
    learningStreak: user.learningStreak ?? 0,
    xp: user.xp ?? 0,
    currentSkill: user.currentSkill ?? null,
  };
}

function sameIds(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  account: null,
  hasHydrated: false,
  hasLoggedOut: false,
  hasJustRegistered: false,
  hydrate: () => {
    const saved = readStoredValue<AuthSnapshot>(storageKey, { currentUser: null, account: null });
    const currentUser = normalizeUser(saved.currentUser);
    const accountUser = normalizeUser(saved.account?.user ?? null);
    const account = saved.account && accountUser ? { ...saved.account, user: accountUser } : null;
    const snapshot = { currentUser, account };
    writeStoredValue(storageKey, snapshot);
    set({ ...snapshot, hasHydrated: true, hasLoggedOut: false, hasJustRegistered: false });
  },
  clearLogoutIntent: () => set({ hasLoggedOut: false }),
  clearRegistrationIntent: () => set({ hasJustRegistered: false }),
  register: (name, email, password) => {
    const user = createUser(name, email);
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
    const firstSkill = careerPathById.get(onboarding.careerId)?.skills[0] ?? null;
    const updatedUser: CurrentUser = {
      ...currentUser,
      onboarding,
      selectedCareer: onboarding.careerId,
      experienceLevel: onboarding.experienceLevel,
      weeklyAvailability: onboarding.weeklyCommitment,
      careerGoal: onboarding.learningGoal,
      currentSkill: firstSkill?.id ?? null,
      inProgressSkills: firstSkill ? [firstSkill.id] : [],
    };
    const account = get().account ? { ...get().account!, user: updatedUser } : null;
    const snapshot = { currentUser: updatedUser, account };
    writeStoredValue(storageKey, snapshot);
    set(snapshot);
    return true;
  },
  syncLearningProgress: (career, progress) => {
    const currentUser = get().currentUser;
    if (!currentUser || currentUser.selectedCareer !== career.id) return;
    const completedSkills = career.skills
      .filter((skill) => progress.completedSkillIds.includes(skill.id))
      .map((skill) => skill.id);
    const currentSkill = career.skills.find((skill) =>
      !completedSkills.includes(skill.id)
      && skill.prerequisites.every((id) => completedSkills.includes(id)),
    ) ?? null;
    const completedProjects = career.recommendedProjects
      .filter((project) => progress.completedProjectIds.includes(project.id))
      .map((project) => project.id);
    const completionPercentage = career.skills.length ? Math.round(completedSkills.length / career.skills.length * 100) : 0;
    const xp = Math.max(currentUser.xp, progress.xp);
    if (
      currentUser.progress === completionPercentage
      && sameIds(currentUser.completedSkills, completedSkills)
      && sameIds(currentUser.inProgressSkills, currentSkill ? [currentSkill.id] : [])
      && sameIds(currentUser.completedProjects, completedProjects)
      && currentUser.currentSkill === (currentSkill?.id ?? null)
      && currentUser.xp === xp
    ) return;
    const updatedUser: CurrentUser = {
      ...currentUser,
      progress: completionPercentage,
      completedSkills,
      inProgressSkills: currentSkill ? [currentSkill.id] : [],
      completedProjects,
      currentSkill: currentSkill?.id ?? null,
      xp,
    };
    const account = get().account ? { ...get().account!, user: updatedUser } : null;
    const snapshot = { currentUser: updatedUser, account };
    writeStoredValue(storageKey, snapshot);
    set(snapshot);
  },
  syncAchievements: (achievementIds, xp) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;
    const achievements = [...new Set([...currentUser.achievements, ...achievementIds])];
    const updatedXp = Math.max(currentUser.xp, xp);
    if (sameIds(currentUser.achievements, achievements) && currentUser.xp === updatedXp) return;
    const updatedUser = { ...currentUser, achievements, xp: updatedXp };
    const account = get().account ? { ...get().account!, user: updatedUser } : null;
    const snapshot = { currentUser: updatedUser, account };
    writeStoredValue(storageKey, snapshot);
    set(snapshot);
  },
  logout: () => {
    const snapshot = { currentUser: null, account: get().account };
    writeStoredValue(storageKey, snapshot);
    set({ ...snapshot, hasLoggedOut: true, hasJustRegistered: false });
  },
}));