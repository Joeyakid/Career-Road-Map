import { BrainCircuit, Cloud, Code2, Database, Layers3, MonitorSmartphone, Server, ShieldCheck, SlidersHorizontal, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createElement } from "react";

const careerIcons: Record<string, LucideIcon> = {
  "frontend-development": MonitorSmartphone,
  "backend-development": Server,
  "full-stack-development": Code2,
  "ui-ux-design": Layers3,
  cybersecurity: ShieldCheck,
  "data-science": Database,
  "artificial-intelligence": BrainCircuit,
  "cloud-computing": Cloud,
  devops: SlidersHorizontal,
  "mobile-development": Smartphone,
};

export function getCareerIcon(careerId: string): LucideIcon {
  return careerIcons[careerId] ?? Code2;
}

export function CareerIcon({ careerId, size = 20 }: { careerId: string; size?: number }) {
  return createElement(getCareerIcon(careerId), { size });
}