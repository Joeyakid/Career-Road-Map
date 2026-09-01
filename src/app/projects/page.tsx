"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, CheckCircle2, Clock3, Code2, Filter, Lightbulb, Lock, Rocket, Sparkles, Target, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Project, SkillId, projects, recommendProjects, skills } from "@/data/project-recommendations";

const storageKey = "pathforge-completed-project-skills";
const defaultSkills: SkillId[] = ["html", "css", "javascript"];

export default function ProjectsPage() {
  const [completedSkills, setCompletedSkills] = useState<SkillId[]>(defaultSkills);
  const [ready, setReady] = useState(false);
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => { const saved = localStorage.getItem(storageKey); if (saved) setCompletedSkills(JSON.parse(saved)); setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem(storageKey, JSON.stringify(completedSkills)); }, [completedSkills, ready]);
  const recommendations = useMemo(() => recommendProjects(completedSkills).filter(({ project }) => category === "All" || project.category === category), [completedSkills, category]);
  const readyCount = recommendations.filter(({ ready: projectReady }) => projectReady).length;
  const toggleSkill = (skill: SkillId) => setCompletedSkills(items => items.includes(skill) ? items.filter(item => item !== skill) : [...items, skill]);

  return <main className="projects-page">
    <header className="projects-header"><a href="/" className="projects-brand"><span><Sparkles size={18}/></span>PathForge</a><div className="projects-crumb"><a href="/dashboard">Dashboard</a><span>/</span><b>Projects</b></div><a href="/roadmaps" className="projects-link">View roadmap <ArrowRight size={15}/></a></header>
    <section className="projects-hero"><div><span className="projects-kicker"><Rocket size={14}/> LEARN BY BUILDING</span><h1>Projects picked for <em>your next step.</em></h1><p>Based on the skills you&apos;ve completed, these projects are ready to turn learning into practical proof.</p></div><div className="projects-hero-mark"><span><Code2 size={34}/></span><i/><i/><i/></div></section>
    <section className="projects-workspace"><aside className="skills-panel"><div><span className="side-title">YOUR COMPLETED SKILLS</span><h2>What you know so far</h2><p>Update this list to see recommendations adapt instantly.</p></div><div className="completed-skill-list">{skills.map((skill) => <button onClick={() => toggleSkill(skill.id)} className={completedSkills.includes(skill.id) ? "checked" : ""} key={skill.id}><span>{completedSkills.includes(skill.id) && <Check size={14}/>}</span>{skill.label}</button>)}</div><div className="skill-panel-tip"><Lightbulb size={15}/><p><b>Recommendation logic</b><small>Projects are ranked by the percentage of required skills you&apos;ve completed.</small></p></div></aside>
      <div className="recommendations"><div className="recommendation-head"><div><span className="projects-kicker">YOUR RECOMMENDATIONS</span><h2>{readyCount} projects ready to build</h2></div><div className="project-filter"><Filter size={15}/><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter projects by category"><option>All</option>{[...new Set(projects.map(project => project.category))].map(item => <option key={item}>{item}</option>)}</select></div></div><div className="recommendation-note"><CheckCircle2 size={16}/><span><b>Your strongest next move:</b> Start with a project where you already meet every requirement.</span></div><div className="project-card-grid">{recommendations.map(({ project, matched, match, ready: projectReady }, index) => <motion.article layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }} whileHover={{ y: -5 }} className={`recommendation-card ${project.accent}`} key={project.id}><div className="project-card-top"><span className="project-symbol"><Rocket size={20}/></span><span className={projectReady ? "ready-badge" : "locked-badge"}>{projectReady ? <CheckCircle2 size={13}/> : <Lock size={12}/>} {projectReady ? "Ready to build" : `${Math.round(match * 100)}% matched`}</span></div><span className="project-category">{project.category}</span><h3>{project.title}</h3><p>{project.description}</p><div className="project-details"><span><Target size={13}/>{project.difficulty}</span><span><Clock3 size={13}/>{project.estimatedTime}</span></div><div className="required-skills"><b>SKILLS REQUIRED</b><div>{project.skills.map(skillId => { const item = skills.find(skill => skill.id === skillId)!; return <span className={completedSkills.includes(skillId) ? "has-skill" : "missing-skill"} key={skillId}>{completedSkills.includes(skillId) ? <Check size={11}/> : <Lock size={10}/>} {item.label}</span>; })}</div></div><button onClick={() => setSelected(project)}>{projectReady ? "View project plan" : "See requirements"}<ArrowRight size={15}/></button></motion.article>)}</div></div>
    </section><section className="outcome-strip"><span><Target size={20}/></span><div><b>Projects are the bridge between learning and opportunity.</b><p>Each recommendation is designed to help you practice meaningful skills and create evidence for your portfolio.</p></div></section>
    {selected && <ProjectDialog project={selected} completedSkills={completedSkills} onClose={() => setSelected(null)} />}
  </main>;
}

function ProjectDialog({ project, completedSkills, onClose }: { project: Project; completedSkills: SkillId[]; onClose: () => void }) {
  const isReady = project.skills.every(skill => completedSkills.includes(skill));
  return <div className="project-modal-layer" role="dialog" aria-modal="true" aria-label={`${project.title} project plan`}><button className="project-modal-backdrop" aria-label="Close project plan" onClick={onClose}/><motion.section className="project-modal" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}><button className="modal-close" onClick={onClose} aria-label="Close project plan"><X size={18}/></button><span className={`project-symbol modal-symbol ${project.accent}`}><Rocket size={22}/></span><span className="project-category">{project.category}</span><h2>{project.title}</h2><p>{project.description}</p><div className="modal-meta"><span>{project.difficulty}</span><span><Clock3 size={14}/>{project.estimatedTime}</span></div><section><h3>Learning outcomes</h3>{project.outcomes.map(outcome => <p className="outcome" key={outcome}><CheckCircle2 size={15}/>{outcome}</p>)}</section><section><h3>Required skills</h3><div className="modal-skills">{project.skills.map(id => <span className={completedSkills.includes(id) ? "has-skill" : "missing-skill"} key={id}>{completedSkills.includes(id) ? <Check size={11}/> : <Lock size={10}/>} {skills.find(skill => skill.id === id)?.label}</span>)}</div></section><button className={isReady ? "modal-cta" : "modal-locked"}>{isReady ? <>Start this project <ArrowRight size={16}/></> : <><Lock size={15}/> Complete required skills first</>}</button></motion.section></div>;
}
