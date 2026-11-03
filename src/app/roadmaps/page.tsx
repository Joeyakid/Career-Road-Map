"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { careerPathById } from "@/data/careers/mock-careers";
import { useAppStore } from "@/store/use-app-store";

export default function RoadmapsRedirectPage() {
  const router = useRouter();
  const careerId = useAppStore((state) => state.activeCareerId);
  const hasHydratedCareer = useAppStore((state) => state.hasHydratedCareer);

  useEffect(() => {
    if (!hasHydratedCareer) return;
    router.replace(careerPathById.has(careerId ?? "") ? `/roadmap/${careerId}` : "/careers");
  }, [careerId, hasHydratedCareer, router]);

  return <main className="app-state" aria-live="polite"><h1>Opening your roadmap</h1><p>Loading your selected career path.</p></main>;
}
