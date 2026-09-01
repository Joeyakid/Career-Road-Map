import { create } from "zustand";

type AppState = {
  activeCareerId: string | null;
  isNavigationOpen: boolean;
  setActiveCareerId: (careerId: string) => void;
  setNavigationOpen: (isOpen: boolean) => void;
};

/** UI-only global state. Server data should live in feature repositories when an API is introduced. */
export const useAppStore = create<AppState>((set) => ({
  activeCareerId: "product-design",
  isNavigationOpen: false,
  setActiveCareerId: (activeCareerId) => set({ activeCareerId }),
  setNavigationOpen: (isNavigationOpen) => set({ isNavigationOpen }),
}));
