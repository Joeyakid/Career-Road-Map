import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import type { CareerPath } from "@/types/career";
import { CareerIcon } from "@/components/careers/career-icons";

const colors: Record<string, string> = {
  "frontend-development": "blue",
  "backend-development": "teal",
  "full-stack-development": "purple",
  "ui-ux-design": "orange",
  cybersecurity: "red",
  "data-science": "indigo",
  "artificial-intelligence": "pink",
  "cloud-computing": "sky",
  devops: "green",
  "mobile-development": "cyan",
};

export default function CareerCard({ career, variant = "explorer", title }: { career: CareerPath; variant?: "explorer" | "landing"; title?: string }) {
  const className = colors[career.id] ?? "blue";

  if (variant === "landing") {
    return <article className={`career-card ${className}`}>
      <span className="career-icon"><CareerIcon careerId={career.id} size={24}/></span>
      <span className="career-count">{career.skills.length} skills</span>
      <h3>{title ?? career.title}</h3>
      <p>{career.shortDescription}</p>
      <Link href={`/careers/${career.id}`}>Explore path <ArrowRight size={16}/></Link>
    </article>;
  }

  return <article className={`explore-card ${className}`}>
    <div className="explore-card-head"><span className="explore-icon"><CareerIcon careerId={career.id} size={24}/></span><span className="difficulty">{career.difficulty}</span></div>
    <h2>{career.title}</h2>
    <p>{career.shortDescription}</p>
    <div className="career-metrics"><span><Clock3 size={14}/> {career.estimatedDuration}</span><span>{career.skills.length} skills</span></div>
    <Link href={`/careers/${career.id}`}>Explore <ArrowRight size={16}/></Link>
  </article>;
}