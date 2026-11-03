"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useAppStore } from "@/store/use-app-store";

const isProtectedPath = (pathname: string) => ["/dashboard", "/onboarding", "/projects", "/achievements", "/settings", "/roadmap"].some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
const isAuthPath = (pathname: string) => pathname === "/login" || pathname === "/register";

export default function AuthGate({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const hasLoggedOut = useAuthStore((state) => state.hasLoggedOut);
  const hasJustRegistered = useAuthStore((state) => state.hasJustRegistered);

  useEffect(() => {
    useAuthStore.getState().hydrate();
    useAppStore.getState().hydrateCareer();
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (hasLoggedOut && pathname === "/") {
      useAuthStore.getState().clearLogoutIntent();
      return;
    }
    if (hasJustRegistered && pathname !== "/register") useAuthStore.getState().clearRegistrationIntent();
    if (isAuthPath(pathname) && currentUser && !(pathname === "/register" && hasJustRegistered)) router.replace("/dashboard");
    else if (pathname === "/onboarding" && currentUser?.onboarding) router.replace("/dashboard");
    else if (isProtectedPath(pathname) && !currentUser) router.replace(hasLoggedOut ? "/" : "/login");
  }, [currentUser, hasHydrated, hasJustRegistered, hasLoggedOut, pathname, router]);

  if (!hasHydrated && (isProtectedPath(pathname) || isAuthPath(pathname))) return null;
  if (hasHydrated && ((isAuthPath(pathname) && currentUser && !(pathname === "/register" && hasJustRegistered)) || (isProtectedPath(pathname) && !currentUser))) return null;
  return children;
}