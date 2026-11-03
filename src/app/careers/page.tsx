"use client";

import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, Filter, LayoutDashboard, Search, Sparkles, Target, X } from "lucide-react";
import { useMemo, useState } from "react";
import CareerCard from "@/components/careers/career-card";
import { careerPathById, careerPaths } from "@/data/careers/mock-careers";
import { useAppStore } from "@/store/use-app-store";

const areas = ["All careers","Development","Design","Data & AI","Infrastructure"];
const careerAreas: Record<string, string> = {
  "frontend-development": "Development", "backend-development": "Development", "full-stack-development": "Development", "mobile-development": "Development",
  "ui-ux-design": "Design", "data-science": "Data & AI", "artificial-intelligence": "Data & AI",
  cybersecurity: "Infrastructure", "cloud-computing": "Infrastructure", devops: "Infrastructure",
};

export default function CareersPage() {
  const [query,setQuery] = useState(""); const [area,setArea] = useState("All careers"); const [difficulty,setDifficulty] = useState("All levels"); const [filterOpen,setFilterOpen] = useState(false);
  const activeCareerId = useAppStore((state) => state.activeCareerId);
  const roadmapHref = careerPathById.has(activeCareerId ?? "") ? `/roadmap/${activeCareerId}` : "/careers";
  const filtered = useMemo(() => careerPaths.filter(career => (area === "All careers" || careerAreas[career.id] === area) && (difficulty === "All levels" || career.difficulty === difficulty) && `${career.title} ${career.shortDescription} ${career.skills.map(skill => skill.name).join(" ")}`.toLowerCase().includes(query.toLowerCase())),[query,area,difficulty]);
  return <main className="explorer-page"><header className="explorer-header"><a href="/" className="explorer-logo"><span><Sparkles size={18}/></span>PathForge</a><nav><a href="/dashboard"><LayoutDashboard size={16}/> Dashboard</a><a className="active" href="/careers"><BriefcaseBusiness size={16}/> Careers</a><a href={roadmapHref}><Target size={16}/> Roadmaps</a></nav><a href="/dashboard" className="explorer-dashboard">Go to dashboard <ArrowRight size={15}/></a></header>
    <section className="career-hero"><span className="explorer-kicker"><Sparkles size={14}/> FIND YOUR FORGE</span><h1>Explore careers that <em>move you.</em></h1><p>Discover the skills, projects, and roadmap behind the tech career you want to build.</p><div className="career-search"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search careers, skills, or roles" aria-label="Search careers"/>{query && <button onClick={()=>setQuery("")} aria-label="Clear search"><X size={17}/></button>}</div></section>
    <section className="career-content"><div className="career-toolbar"><div className="area-pills">{areas.map(item=><button className={area===item?"active":""} onClick={()=>setArea(item)} key={item}>{item}</button>)}</div><button className="filter-trigger" onClick={()=>setFilterOpen(!filterOpen)}><Filter size={16}/> Filters <span>{difficulty === "All levels" ? "" : "1"}</span></button></div>{filterOpen && <motion.div className="filter-panel" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}><b>Difficulty</b><div>{["All levels","Beginner","Intermediate","Advanced"].map(item=><button className={difficulty===item?"selected":""} onClick={()=>{setDifficulty(item);setFilterOpen(false)}} key={item}>{item}{difficulty===item&&<span>✓</span>}</button>)}</div></motion.div>}
      <div className="career-result-count"><span><b>{filtered.length}</b> careers to explore</span><span>Built around the skills teams are hiring for now.</span></div><motion.div className="career-card-grid" layout>{filtered.map((career,index)=><motion.div layout initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:index*.035}} key={career.id}><CareerCard career={career}/></motion.div>)}</motion.div>{filtered.length===0&&<div className="career-empty"><Search size={25}/><h2>No careers match that search</h2><p>Try another search term or clear your filters.</p><button onClick={()=>{setQuery("");setArea("All careers");setDifficulty("All levels")}}>Reset filters</button></div>}</section>
    <section className="explorer-cta"><div><span className="explorer-kicker">NOT SURE WHERE TO START?</span><h2>Find the path that fits <em>you.</em></h2><p>Answer a few thoughtful questions and get a career direction tailored to your strengths and interests.</p></div><a href="#assessment">Take the career quiz <ArrowRight size={17}/></a></section>
  </main>;
}
