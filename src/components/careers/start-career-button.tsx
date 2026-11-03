"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";

export default function StartCareerButton({ careerId }: { careerId: string }) {
  const router = useRouter();
  const setActiveCareerId = useAppStore((state) => state.setActiveCareerId);
  return <button className="career-start-button" onClick={() => { setActiveCareerId(careerId); router.push(`/roadmap/${careerId}`); }}>Start This Career Path <ArrowRight size={17}/></button>;
}