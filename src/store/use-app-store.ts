import { create } from "zustand";
import { readStoredValue, writeStoredValue } from "@/lib/storage";

type AppState = {
  activeCareerId: string | null;
  isNavigationOpen: boolean;
  hasHydratedCareer: boolean;
  setActiveCareerId: (careerId: string) => void;
  setNavigationOpen: (isOpen: boolean) => void;
  hydrateCareer: () => void;
};

/** UI-only global state. Server data should live in feature repositories when an API is introduced. */
export const useAppStore = create<AppState>((set) => ({
  activeCareerId: null,
  isNavigationOpen: false,
  hasHydratedCareer: false,
  setActiveCareerId: (activeCareerId) => {
    writeStoredValue("pathforge-active-career", activeCareerId);
    set({ activeCareerId });
  },
  setNavigationOpen: (isNavigationOpen) => set({ isNavigationOpen }),
  hydrateCareer: () => set({
    activeCareerId: readStoredValue<string | null>("pathforge-active-career", null),
    hasHydratedCareer: true,
  }),
}));
