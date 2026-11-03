"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, Clock3, Lock, Sparkles, Target } from "lucide-react";
import type { CareerPath } from "@/types/career";
import { CareerIcon } from "@/components/careers/career-icons";
import { readStoredValue, writeStoredValue } from "@/lib/storage";
import type { LearnerProgress } from "@/features/progress/repository";

export default function CareerRoadmap({ career }: { career: CareerPath }) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const storageKey = `pathforge-progress-${career.id}`;

  useEffect(() => {
    const saved = readStoredValue<{ completedSkillIds?: string[] }>(storageKey, {});
    const compatibleIds = career.skills.filter((skill) => localStorage.getItem(`pathforge-skill-${skill.id}`) === "complete").map((skill) => skill.id);
    setCompletedIds([...new Set([...(saved.completedSkillIds ?? []), ...compatibleIds])]);
    setReady(true);
  }, [career.skills, storageKey]);

  const skillStates = useMemo(() => {
    const activeSkillId = career.skills.find((skill) => !completedIds.includes(skill.id) && skill.prerequisites.every((id) => completedIds.includes(id)))?.id;
    return career.skills.map((skill) => {
      if (completedIds.includes(skill.id)) return { skill, status: "completed" as const };
      const prerequisitesMet = skill.prerequisites.every((id) => completedIds.includes(id));
      if (!prerequisitesMet) return { skill, status: "locked" as const };
      return { skill, status: skill.id === activeSkillId ? "active" as const : "unlocked" as const };
    });
  }, [career.skills, completedIds]);
  const currentSkill = skillStates.find(({ status }) => status === "active")?.skill;
  const progress = career.skills.length ? Math.round((completedIds.length / career.skills.length) * 100) : 0;

  function completeSkill(skillId: string) {
    const updatedIds = [...new Set([...completedIds, skillId])];
    setCompletedIds(updatedIds);
    const savedProgress = readStoredValue<Partial<LearnerProgress>>(storageKey, {});
    writeStoredValue(storageKey, {
      completedSkillIds: updatedIds,
      completedProjectIds: savedProgress.completedProjectIds ?? [],
      xp: savedProgress.xp ?? 0,
    });
    localStorage.setItem(`pathforge-skill-${skillId}`, "complete");
  }

  return <main className="career-roadmap-page">
    <header className="roadmap-header"><Link href="/" className="roadmap-brand"><span><Sparkles size={18}/></span>PathForge</Link><div className="roadmap-breadcrumb"><Link href="/careers">Careers</Link><span>/</span><b>{career.title}</b></div><Link className="roadmap-back" href={`/careers/${career.id}`}><ArrowLeft size={15}/> Career overview</Link></header>
    <section className="roadmap-detail-intro"><div><span className="roadmap-kicker"><Target size={14}/> YOUR LEARNING PATH</span><h1><CareerIcon careerId={career.id} size={28}/>{career.title} roadmap</h1><p>{career.shortDescription}</p></div><div className="path-progress"><div><span><b>{completedIds.length} of {career.skills.length}</b> skills completed</span><b>{progress}%</b></div><i><em style={{ width: `${progress}%` }}/></i><small>{currentSkill ? `Current focus: ${currentSkill.name}` : "All roadmap skills completed. Keep building with a project."}</small></div></section>
    <section className="career-roadmap-content">
      <div className="career-map-column"><div className="career-map-heading"><div><h2>Roadmap stages</h2><p>Skills unlock as their prerequisites are completed.</p></div><span><i className="completed-dot"/> Completed <i className="active-dot"/> Current <i className="locked-dot"/> Locked</span></div>
        {career.roadmapStages.map((stage, stageIndex) => {
          const start = Math.floor(stageIndex * career.skills.length / career.roadmapStages.length);
          const end = Math.floor((stageIndex + 1) * career.skills.length / career.roadmapStages.length);
          const stageSkills = skillStates.slice(start, end);
          return <section className="career-roadmap-stage" key={stage.id}><div className="career-stage-heading"><span>{String(stageIndex + 1).padStart(2, "0")}</span><div><h3>{stage.title}</h3><p>{stage.summary}</p></div><small>{stage.duration}</small></div><ul>{stageSkills.map(({ skill, status }, index) => <li className={`career-skill-row ${status}`} key={skill.id}><span className="career-skill-status">{status === "completed" ? <Check size={15}/> : status === "locked" ? <Lock size={14}/> : index + start + 1}</span><div><b>{skill.name}</b><p>{skill.description}</p><small><Clock3 size={12}/>{skill.estimatedDuration}<span>{skill.difficulty}</span></small></div><span className="skill-status-label">{status === "active" ? "Current" : status}</span>{status === "active" && <button onClick={() => completeSkill(skill.id)} disabled={!ready}>Mark complete <CheckCircle2 size={15}/></button>}</li>)}</ul><div className="career-stage-outcomes">{stage.outcomes.map((outcome) => <span key={outcome}><CheckCircle2 size={14}/>{outcome}</span>)}</div></section>;
        })}
      </div>
      <aside className="career-roadmap-aside"><section><span className="roadmap-kicker">NEXT RECOMMENDED</span>{currentSkill ? <><h2>{currentSkill.name}</h2><p>{currentSkill.description}</p><span className="roadmap-aside-meta"><Clock3 size={14}/>{currentSkill.estimatedDuration}</span><button onClick={() => completeSkill(currentSkill.id)} disabled={!ready}>Complete skill <ArrowRight size={15}/></button></> : <><h2>Path complete</h2><p>All skills are complete. Apply what you have learned to a portfolio project.</p><Link href={`/careers/${career.id}`}>Explore projects <ArrowRight size={15}/></Link></>}</section><section><span className="roadmap-kicker">CAREER SNAPSHOT</span><p><b>{career.difficulty}</b> difficulty</p><p><b>{career.estimatedDuration}</b> estimated</p><p><b>{career.recommendedProjects.length}</b> recommended projects</p><Link href={`/careers/${career.id}`}>Career details <ArrowRight size={14}/></Link></section><section><span className="roadmap-kicker">LEARNING RESOURCES</span>{career.learningResources.slice(0, 3).map((resource) => <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer"><BookOpen size={14}/>{resource.title}<ArrowRight size={13}/></a>)}</section></aside>
    </section>
  </main>;
}