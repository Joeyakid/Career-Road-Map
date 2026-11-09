"use client";

import { motion } from "framer-motion";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  ArrowRight, Award, Bell, BookOpen, BriefcaseBusiness, CalendarDays,
  Check, CheckCircle2, ChevronRight, CircleDot, Clock3, Code2, Flame, LayoutDashboard,
  Menu, MoreHorizontal, Play, Settings, Sparkles, Target, TrendingUp, Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { careerPathById } from "@/data/careers/mock-careers";
import { useAppStore } from "@/store/use-app-store";
import { useAuthStore } from "@/store/use-auth-store";
import { readStoredValue } from "@/lib/storage";
import type { LearnerProgress } from "@/features/progress/repository";
import { achievements, getGamificationState } from "@/lib/gamification";
import type { CurrentUser } from "@/features/auth/repository";

const weeklyData = [
  { day: "Mon", minutes: 0 }, { day: "Tue", minutes: 0 }, { day: "Wed", minutes: 0 },
  { day: "Thu", minutes: 0 }, { day: "Fri", minutes: 0 }, { day: "Sat", minutes: 0 }, { day: "Sun", minutes: 0 },
];

const nav = [
  [LayoutDashboard, "Dashboard"], [BriefcaseBusiness, "Careers"], [Target, "Roadmaps"], [Code2, "Projects"], [BookOpen, "Resources"], [Trophy, "Achievements"], [Settings, "Settings"],
] as const;

type DashboardContentProps = {
  demoUser?: CurrentUser;
  isPreview?: boolean;
};

export default function DashboardContent({ demoUser, isPreview = false }: DashboardContentProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [completedCareerSkillIds, setCompletedCareerSkillIds] = useState<string[]>([]);
  const [completedCareerProjectIds, setCompletedCareerProjectIds] = useState<string[]>([]);
  const authenticatedUser = useAuthStore((state) => state.currentUser);
  const currentUser = demoUser ?? authenticatedUser;
  const logout = useAuthStore((state) => state.logout);
  const storedActiveCareerId = useAppStore((state) => state.activeCareerId);
  const syncLearningProgress = useAuthStore((state) => state.syncLearningProgress);
  const syncAchievements = useAuthStore((state) => state.syncAchievements);
  const activeCareerId = currentUser
    ? currentUser.selectedCareer ?? currentUser.onboarding?.careerId ?? null
    : storedActiveCareerId;
  const activeCareer = careerPathById.get(activeCareerId ?? "");
  const careerProgress = activeCareer?.skills.length ? Math.round(completedCareerSkillIds.length / activeCareer.skills.length * 100) : 0;
  const nextCareerSkill = activeCareer?.skills.find((skill) => !completedCareerSkillIds.includes(skill.id) && skill.prerequisites.every((id) => completedCareerSkillIds.includes(id)));
  const currentLearningSkill = activeCareer?.skills.find((skill) =>
    skill.id === currentUser?.currentSkill && !completedCareerSkillIds.includes(skill.id),
  ) ?? activeCareer?.skills.find((skill) => currentUser?.inProgressSkills.includes(skill.id) && !completedCareerSkillIds.includes(skill.id))
    ?? nextCareerSkill;
  const weeklyCommitment = currentUser?.weeklyAvailability ?? "No weekly commitment set";
  const completedSkills = activeCareer?.skills.filter((skill) => completedCareerSkillIds.includes(skill.id)) ?? [];
  const completedProjects = activeCareer?.recommendedProjects.filter((project) => completedCareerProjectIds.includes(project.id)) ?? [];
  const recommendedProject = activeCareer?.recommendedProjects
    .map((project) => ({
      project,
      matchedSkills: project.requiredSkills.filter((skillId) =>
        completedCareerSkillIds.includes(skillId) || skillId === currentLearningSkill?.id,
      ).length,
    }))
    .sort((left, right) => right.matchedSkills - left.matchedSkills || left.project.requiredSkills.length - right.project.requiredSkills.length)[0]?.project;
  const unlockedAchievements = achievements.filter((achievement) => currentUser?.achievements.includes(achievement.id));
  const upcomingMilestones = [
    { title: "First skill mastered", text: nextCareerSkill ? `Complete ${nextCareerSkill.name}` : "Continue building your roadmap skills", meta: `${completedCareerSkillIds.length} skills complete`, color: "#2563eb" },
    { title: "First portfolio project", text: activeCareer?.recommendedProjects[0]?.title ?? "Choose a career to see projects", meta: `${completedCareerProjectIds.length} projects complete`, color: "#14b8a6" },
    { title: "Build a weekly rhythm", text: `Your planned pace: ${weeklyCommitment}`, meta: "Your chosen commitment", color: "#8b5cf6" },
  ];
  const userInitials = currentUser?.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() ?? "PF";
  useEffect(() => {
    if (!activeCareerId || !activeCareer) {
      setCompletedCareerSkillIds([]);
      setCompletedCareerProjectIds([]);
      return;
    }
    if (isPreview && demoUser) {
      setCompletedCareerSkillIds(demoUser.completedSkills);
      setCompletedCareerProjectIds(demoUser.completedProjects);
      return;
    }
    const saved = readStoredValue<Partial<LearnerProgress>>(
      `pathforge-progress-${activeCareerId}`,
      {
        completedSkillIds: currentUser?.completedSkills ?? [],
        completedProjectIds: currentUser?.completedProjects ?? [],
        xp: currentUser?.xp ?? 0,
      },
    );
    const completedSkillIds = Array.isArray(saved.completedSkillIds)
      ? saved.completedSkillIds.filter((id): id is string => typeof id === "string")
      : currentUser?.completedSkills ?? [];
    const completedProjectIds = Array.isArray(saved.completedProjectIds)
      ? saved.completedProjectIds.filter((id): id is string => typeof id === "string")
      : currentUser?.completedProjects ?? [];
    setCompletedCareerSkillIds(completedSkillIds);
    setCompletedCareerProjectIds(completedProjectIds);
    syncLearningProgress(activeCareer, {
      completedSkillIds,
      completedProjectIds,
      xp: typeof saved.xp === "number" ? saved.xp : currentUser?.xp ?? 0,
    });
    const gamificationState = getGamificationState();
    syncAchievements(gamificationState.unlockedAchievements, gamificationState.xp);
  }, [activeCareerId, activeCareer, currentUser, demoUser, isPreview, syncAchievements, syncLearningProgress]);

  function handleLogout() {
    if (isPreview) {
      router.push("/");
      return;
    }
    logout();
    router.replace("/");
  }

  return <main className="product-shell">
    <aside className={`product-sidebar ${menuOpen ? "open" : ""}`} aria-label="Dashboard navigation"><a href="/" className="product-brand"><span><Sparkles size={18}/></span>PathForge</a><div className="sidebar-label">WORKSPACE</div><nav>{nav.map(([Icon,label], index)=><a className={index === 0 ? "selected" : ""} href={label === "Dashboard" ? isPreview ? "/dashboard/preview" : "/dashboard" : label === "Careers" ? "/careers" : label === "Roadmaps" ? activeCareer ? `/roadmap/${activeCareer.id}` : "/careers" : label === "Projects" ? "/projects" : label === "Achievements" ? "/achievements" : label === "Settings" ? "/settings" : "#resources"} key={label}><Icon size={18}/>{label}</a>)}</nav><div className="sidebar-card"><span><Sparkles size={15}/></span><b>Build your edge</b><p>Unlock projects and tailored learning insights.</p><button>Explore Pro <ArrowRight size={14}/></button></div><div className="user-card"><span className="dashboard-avatar">{userInitials}</span><span><b>{currentUser?.name ?? "Learner"}</b><small>{activeCareer?.title ?? "Choose a career"}</small></span><button className="user-logout" onClick={handleLogout}>{isPreview ? "Exit preview" : "Log out"}</button></div></aside>
    {menuOpen && <button className="dash-overlay" onClick={() => setMenuOpen(false)} aria-label="Close navigation"/>}
    <section className="dashboard-main"><header className="dashboard-topbar"><button className="dashboard-menu" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={21}/></button><div><small>WORKSPACE /</small><b> Dashboard</b></div><div className="dashboard-actions"><button aria-label="Notifications"><Bell size={18}/><i/></button><span className="dashboard-avatar mobile-avatar">{userInitials}</span></div></header>
      <div className="dashboard-content">
        {isPreview && <div className="dashboard-preview-banner"><Sparkles size={16}/><span><b>Demo preview</b> — sample learner data, not a signed-in account.</span><a href="/register">Create your own path <ArrowRight size={14}/></a></div>}
        <motion.section className="dashboard-welcome" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}}><div><p className="dash-kicker">YOUR LEARNING WORKSPACE</p><h1>Welcome back, {currentUser?.name ?? "Learner"} <span>✦</span></h1><p>{currentUser?.careerGoal ? `Your goal: ${currentUser.careerGoal.toLowerCase()}. Your ${weeklyCommitment} plan is ready when you are.` : "Choose a career path to build your personal learning plan."}</p><button onClick={() => router.push(activeCareer ? `/roadmap/${activeCareer.id}` : "/careers")}>{activeCareer ? "Continue learning" : "Choose a career"} <ArrowRight size={17}/></button></div><div className="welcome-art"><div className="art-orb"/><span className="art-card first"><CheckCircle2 size={16}/><b>Keep your momentum</b></span><span className="art-card second"><Trophy size={17}/><b>Build your next skill</b></span><div className="art-path"><i/><i/><i/><i/><span><Sparkles size={17}/></span></div></div></motion.section>
        <motion.section className="top-stats" initial="hidden" animate="show" variants={{hidden:{},show:{transition:{staggerChildren:.08}}}}><Stat icon={<TrendingUp size={19}/>} color="blue" label="OVERALL PROGRESS" value={`${careerProgress}%`} detail={activeCareer ? `${completedCareerSkillIds.length} of ${activeCareer.skills.length} skills` : "Choose a career to begin"} extra={<div className="stat-ring" style={{background:`conic-gradient(#2563eb ${careerProgress * 3.6}deg,#e2e8f0 0)`}}><b>{careerProgress}%</b></div>}/><Stat icon={<Flame size={19}/>} color="teal" label="LEARNING STREAK" value={`${currentUser?.learningStreak ?? 0} days`} detail={currentUser?.learningStreak ? "Keep your momentum going" : "Start with your first session"} extra={<div className="streak-mini">● ● ● ● ●</div>}/><Stat icon={<Award size={19}/>} color="purple" label="COMPLETED PROJECTS" value={`${completedCareerProjectIds.length}`} detail={`${activeCareer?.recommendedProjects.length ?? 0} suggested projects`} extra={<div className="skill-stack"><i/><i/><i/></div>}/><Stat icon={<Sparkles size={19}/>} color="blue" label="YOUR XP" value={`${currentUser?.xp ?? 0} XP`} detail="Experience points earned" extra={<div className="skill-stack"><i/><i/><i/></div>}/></motion.section>
        <div className="dashboard-grid">
          <motion.section className="dash-panel current-career" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.14}}><div className="dash-panel-head"><div><p className="dash-kicker">YOUR CAREER PATH</p><h2>{activeCareer?.title ?? "Choose a career path"}</h2></div><button aria-label="Explore careers" onClick={() => router.push("/careers")}><MoreHorizontal size={19}/></button></div><div className="career-banner"><div className="career-shapes"><i/><i/><i/></div><span><Sparkles size={19}/></span><div><small>{activeCareer?.title ?? "CAREER ROADMAP"}</small><b>{activeCareer?.shortDescription ?? "Explore paths to choose your direction"}</b><p>{activeCareer ? `${completedCareerSkillIds.length} of ${activeCareer.skills.length} skills complete` : "Your progress will appear here"}</p></div></div><div className="career-progress"><div><b>{careerProgress}% complete</b><span>Next: {nextCareerSkill?.name ?? (activeCareer ? "Path complete" : "Choose a career")}</span></div><i><em style={{width: `${careerProgress}%`}}/></i><a href={activeCareer ? `/roadmap/${activeCareer.id}` : "/careers"}>{activeCareer ? "View roadmap" : "Explore careers"} <ArrowRight size={15}/></a></div></motion.section>
          <motion.section className="dash-panel next-skill" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.2}}><div className="dash-panel-head"><div><p className="dash-kicker">NEXT STEP</p><h2>{nextCareerSkill ? `Next: ${nextCareerSkill.name}` : activeCareer ? "Roadmap complete" : "Choose a career path"}</h2></div><span className="skill-number">{activeCareer && nextCareerSkill ? String(activeCareer.skills.findIndex((skill) => skill.id === nextCareerSkill.id) + 1).padStart(2, "0") : "--"}</span></div><p>{nextCareerSkill?.description ?? "Your next career-specific skill will appear here."}</p><div><span><Clock3 size={15}/> {nextCareerSkill?.estimatedDuration ?? "No skill selected"}</span><span><BookOpen size={15}/> {nextCareerSkill?.resources.length ?? 0} resources</span><button onClick={() => router.push(activeCareer ? `/roadmap/${activeCareer.id}` : "/careers")}>{activeCareer ? "Open roadmap" : "Explore careers"} <Play size={12} fill="currentColor"/></button></div></motion.section>
        </div>
        <motion.section className="dash-panel learning-milestone" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.23}}><div className="milestone-copy"><span className="milestone-icon"><Target size={19}/></span><div><p className="dash-kicker">CURRENTLY LEARNING</p><h2>{currentLearningSkill?.name ?? (activeCareer ? "Your roadmap is complete" : "Your career path starts here")}</h2><p>{currentLearningSkill?.description ?? "Choose a career path to see your first learning milestone."}</p></div></div><div className="milestone-progress"><div><b>{careerProgress}%</b><span>{completedCareerSkillIds.length} of {activeCareer?.skills.length ?? 0} skills</span></div><i><em style={{width: `${careerProgress}%`}}/></i></div><a href={activeCareer ? `/roadmap/${activeCareer.id}` : "/careers"}>{activeCareer ? "View roadmap" : "Explore careers"}<ArrowRight size={16}/></a></motion.section>
        <div className="dashboard-grid charts-row">
          <motion.section className="dash-panel weekly-chart" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.26}}><div className="dash-panel-head"><div><p className="dash-kicker">YOUR CONSISTENCY</p><h2>Weekly progress</h2></div><select aria-label="Chart range"><option>This week</option><option>Last week</option></select></div><div className="chart-summary"><b>0h 0m</b><span>Study sessions will appear here</span></div><div className="chart-container"><ResponsiveContainer width="100%" height="100%"><AreaChart data={weeklyData} margin={{top:10,right:4,left:-25,bottom:0}}><defs><linearGradient id="dashboardGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2563eb" stopOpacity=".25"/><stop offset="1" stopColor="#2563eb" stopOpacity="0"/></linearGradient></defs><CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:10,fill:"#64748b"}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:"#94a3b8"}}/><Tooltip contentStyle={{borderRadius:10,border:"1px solid #e2e8f0",fontSize:11}}/><Area type="monotone" dataKey="minutes" stroke="#2563eb" strokeWidth={2.5} fill="url(#dashboardGradient)"/></AreaChart></ResponsiveContainer></div></motion.section>
          <motion.section className="dash-panel today-goal" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.31}}><div className="dash-panel-head"><div><p className="dash-kicker">YOUR WEEKLY PLAN</p><h2>Set a steady pace</h2></div><CalendarDays size={18}/></div><div className="goal-progress"><span><b>{weeklyCommitment}</b><small>planned learning time</small></span><div><i style={{width:"0%"}}/></div></div><button className="goal-button" onClick={() => router.push(activeCareer ? `/roadmap/${activeCareer.id}` : "/careers")}>{activeCareer ? "Open your roadmap" : "Choose a career"} <ArrowRight size={16}/></button><p className="goal-tip"><Sparkles size={14}/> Your plan is saved with your learner profile.</p></motion.section>
        </div>
        <div className="dashboard-grid bottom-grid">
          <motion.section className="dash-panel timeline-panel" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.36}}><div className="dash-panel-head"><div><p className="dash-kicker">CAREER PROGRESS</p><h2>Your timeline</h2></div><a href={activeCareer ? `/roadmap/${activeCareer.id}` : "/careers"}>Full roadmap <ArrowRight size={15}/></a></div><div className="timeline">{activeCareer ? activeCareer.roadmapStages.map((stage, index) => { const start = Math.floor(index * activeCareer.skills.length / activeCareer.roadmapStages.length); const end = Math.floor((index + 1) * activeCareer.skills.length / activeCareer.roadmapStages.length); const skills = activeCareer.skills.slice(start, end); const completed = skills.filter((skill) => completedCareerSkillIds.includes(skill.id)).length; const done = skills.length > 0 && completed === skills.length; const active = !done && (completed > 0 || index === 0); const type = done ? "done" : active ? "active" : "upcoming"; const status = done ? "Completed" : active ? completed > 0 ? "In progress" : "Current focus" : "Upcoming"; return <div className="timeline-item" key={stage.id}><span className={type}>{done ? <Check size={13}/> : <CircleDot size={14}/>}</span><div><b>{stage.title}</b><small>{stage.duration}</small></div><em>{status}</em></div>; }) : <Activity icon={<Target size={14}/>} color="blue" title="Choose a career" text="Your roadmap stages will appear here." time="Ready"/>}</div></motion.section>
          <motion.section className="dash-panel activity-panel-dash" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.4}}><div className="dash-panel-head"><div><p className="dash-kicker">RECENT ACTIVITY</p><h2>Your learning log</h2></div></div>{completedSkills.map((skill) => <Activity key={skill.id} icon={<Check size={14}/>} color="blue" title="Skill completed" text={skill.name} time="Completed"/>)}{completedProjects.map((project) => <Activity key={project.id} icon={<Trophy size={14}/>} color="teal" title="Project completed" text={project.title} time="Completed"/>)}{completedSkills.length === 0 && completedProjects.length === 0 && <Activity icon={<Sparkles size={14}/>} color="blue" title="Your journey is ready" text="Complete a skill or project to see activity here." time="Start here"/>}</motion.section>
        </div>
        <motion.section className="dash-panel milestones" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.45}}><div className="dash-panel-head"><div><p className="dash-kicker">UPCOMING MILESTONES</p><h2>Progress, one step at a time</h2></div><a href="/achievements">View achievements <ArrowRight size={15}/></a></div><div>{upcomingMilestones.map(({ title, text, meta, color }) => <article key={title}><span style={{background:color}}><Award size={18}/></span><p><b>{title}</b><small>{text}</small></p><em>{meta}</em><ChevronRight size={18}/></article>)}</div></motion.section>
        <div className="dashboard-grid personalized-row">
          <motion.section className="dash-panel" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.48}}><div className="dash-panel-head"><div><p className="dash-kicker">PROJECT RECOMMENDATION</p><h2>{recommendedProject?.title ?? "Choose a career path"}</h2></div><BriefcaseBusiness size={19}/></div><p>{recommendedProject?.description ?? "A project matched to your roadmap will appear here."}</p><div className="career-progress"><span>{recommendedProject ? `${recommendedProject.difficulty} · ${recommendedProject.estimatedDuration}` : "Your skills guide project suggestions"}</span><a href={activeCareer ? `/careers/${activeCareer.id}` : "/careers"}>{activeCareer ? "Explore project" : "Explore careers"} <ArrowRight size={15}/></a></div></motion.section>
          <motion.section className="dash-panel" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.51}}><div className="dash-panel-head"><div><p className="dash-kicker">ACHIEVEMENTS</p><h2>{unlockedAchievements.length ? "Unlocked for you" : "No achievements yet"}</h2></div><Trophy size={19}/></div>{unlockedAchievements.length ? unlockedAchievements.map((achievement) => <Activity key={achievement.id} icon={<Award size={14}/>} color="teal" title={achievement.title} text={achievement.description} time="Unlocked"/>) : <Activity icon={<Sparkles size={14}/>} color="blue" title="Your first achievement is ahead" text="Complete skills and projects to unlock achievements." time="Start here"/>}<a href="/achievements">View achievements <ArrowRight size={15}/></a></motion.section>
        </div>
      </div>
    </section>
  </main>;
}

function Stat({icon,color,label,value,detail,extra}:{icon:React.ReactNode;color:string;label:string;value:string;detail:string;extra:React.ReactNode}) { return <motion.article variants={{hidden:{opacity:0,y:14},show:{opacity:1,y:0}}} className="dash-stat"><span className={`dash-stat-icon ${color}`}>{icon}</span><div><small>{label}</small><b>{value}</b><p>{detail}</p></div>{extra}</motion.article>; }
function Activity({icon,color,title,text,time}:{icon:React.ReactNode;color:string;title:string;text:string;time:string}) { return <div className="dash-activity"><span className={color}>{icon}</span><p><b>{title}</b><small>{text}</small></p><time>{time}</time></div>; }
