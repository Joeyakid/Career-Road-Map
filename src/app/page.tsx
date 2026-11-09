"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronRight, Code2, Compass, GraduationCap, Layers3, Menu, Play, Quote, Rocket, Sparkles, X } from "lucide-react";
import { useState, type MouseEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import CareerCard from "@/components/careers/career-card";
import { careerPathById, careerPaths } from "@/data/careers/mock-careers";
import { useAppStore } from "@/store/use-app-store";
import { useAuthStore } from "@/store/use-auth-store";

const features: [LucideIcon, string, string][] = [
  [Compass, "Find your direction", "Explore high-growth careers and discover the path that fits your strengths."],
  [Layers3, "Learn with a plan", "Follow expert-designed roadmaps that turn ambitious goals into clear next steps."],
  [Rocket, "Build proof of skill", "Create portfolio-ready projects that show employers what you can do."],
  [Sparkles, "See your momentum", "Stay motivated with clear progress, streaks, milestones, and achievements."],
];

const careers: [string, string][] = [["frontend-development", "Software Engineering"], ["ui-ux-design", "Product Design"], ["data-science", "Data & AI"]];

const faqs = [
  ["Is PathForge free to use?", "Yes. You can explore careers and begin your first roadmap for free. PathForge Pro adds advanced projects, deeper insights, and personalised support."],
  ["Do I need prior experience in tech?", "No. Every roadmap starts with the essentials and helps you build up practical skill at your own pace."],
  ["How are the roadmaps created?", "Our learning paths are shaped by working practitioners, hiring signals, and the practical skills needed to do the job."],
  ["Can I switch career paths later?", "Absolutely. Your progress stays with you, and you can explore or begin another career track whenever you are ready."],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const activeCareerId = useAppStore((state) => state.activeCareerId);
  const isAuthenticated = Boolean(currentUser);
  const selectedRoadmapHref = careerPathById.has(activeCareerId ?? "") ? `/roadmap/${activeCareerId}` : "/careers";
  const roadmapHref = isAuthenticated ? selectedRoadmapHref : "/careers";

  function handleLandingNavigation(event: MouseEvent<HTMLElement>) {
    const anchor = (event.target as HTMLElement).closest("a");
    if (!anchor) return;
    const label = anchor.textContent?.replace(/\s+/g, " ").trim().toLowerCase() ?? "";
    let destination: string | null = null;
    if (label === "log in" || anchor.getAttribute("href") === "#login") destination = "/login";
    else if (label.includes("start learning") || label === "get started") destination = "/register";
    else if (label === "career paths" || label.includes("explore careers") || label.includes("explore all careers")) destination = "/careers";
    else if (label.includes("explore path")) {
      const title = anchor.closest(".career-card")?.querySelector("h3")?.textContent?.trim();
      const careerId = careers.find(([, careerTitle]) => careerTitle === title)?.[0];
      destination = careerId ? `/careers/${careerId}` : "/careers";
    } else if (label === "roadmaps") destination = roadmapHref;
    else if (label.includes("find your roadmap")) destination = selectedRoadmapHref;
    else if (label === "faq") {
      event.preventDefault();
      document.querySelector(".faq")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (destination) {
      event.preventDefault();
      router.push(destination);
    }
  }

  return <main className="landing" onClick={handleLandingNavigation}>
    <header className="site-header"><a className="logo" href="#top"><span><GraduationCap size={19}/></span>PathForge</a><nav className={menuOpen ? "nav-open" : ""}><a href="#features">How it works</a><a href="/careers">Career paths</a><a href={roadmapHref}>Roadmaps</a><a href="#stories">Stories</a><a className="mobile-login" href="/login">Log in</a></nav><div className="header-actions"><a className="login" href="/login">Log in</a><a className="header-cta" href="/register">Start learning <ArrowRight size={16}/></a></div><button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X/> : <Menu/>}</button></header>
    <section className="hero" id="top"><div className="aurora aurora-one"/><div className="aurora aurora-two"/><div className="dot-field"/><motion.div className="hero-copy" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.55}}><span className="eyebrow"><Sparkles size={14}/> THE CAREER OPERATING SYSTEM</span><h1>Build Your Tech Career <em>With Confidence</em></h1><p>Choose a career path, follow a structured roadmap, complete projects, and track your progress from beginner to professional.</p><div className="hero-actions" id="start"><a className="primary-cta" href="#careers">Start Learning <ArrowRight size={18}/></a><a className="secondary-cta" href="#careers"><Play size={15} fill="currentColor"/> Explore careers</a></div><div className="hero-proof"><div className="avatar-group"><i>J</i><i>M</i><i>S</i><i>+</i></div><span><b>Join 25,000+ learners</b><small>building the future, one skill at a time</small></span></div></motion.div><motion.div className="hero-visual" initial={{opacity:0,scale:.92,y:24}} animate={{opacity:1,scale:1,y:0}} transition={{duration:.65,delay:.13}}><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="floating-note note-one"><CheckCircle2 size={16}/><span><b>Milestone reached!</b><small>7-day learning streak</small></span></div><div className="floating-note note-two"><span className="tiny-avatar">AM</span><span><b>New project unlocked</b><small>Build a portfolio website</small></span></div><div className="roadmap-window"><div className="window-top"><span/><span/><span/><b>My learning path</b><MoreDots/></div><div className="window-body"><div className="window-title"><span className="course-icon"><Code2 size={18}/></span><div><small>CAREER PATH</small><b>Frontend Developer</b></div><span className="progress-label">64%</span></div><div className="progress-bar"><i/></div>{["Web foundations", "JavaScript essentials", "React in practice", "Build your portfolio"].map((item,index)=><div className={`path-row ${index < 2 ? "finished" : index === 2 ? "active" : ""}`} key={item}><span>{index < 2 ? <CheckCircle2 size={15}/> : index + 1}</span><b>{item}</b><small>{index < 2 ? "Complete" : index === 2 ? "In progress" : "Up next"}</small></div>)}</div></div><div className="floating-spark"><Sparkles size={21}/></div></motion.div></section>
    <section className="trusted"><p>TRUSTED BY LEARNERS ON THEIR WAY TO TEAMS AT</p><div><b>Vercel</b><b>stripe</b><b>Microsoft</b><b>Spotify</b><b>airbnb</b></div></section>
    <section className="section features" id="features"><div className="section-intro"><span className="eyebrow">A CLEARER WAY FORWARD</span><h2>Everything you need to <em>move forward</em></h2><p>PathForge gives you structure, momentum, and the confidence to turn a career goal into a real-world skill set.</p></div><div className="feature-grid">{features.map(([Icon,title,text],index)=><motion.article className="feature-card" key={title as string} whileHover={{y:-6}} transition={{type:"spring",stiffness:300}}><span className={`feature-icon icon-${index}`}><Icon size={22}/></span><h3>{title}</h3><p>{text}</p><a href="#careers">Learn more <ChevronRight size={15}/></a></motion.article>)}</div></section>
    <section className="section careers" id="careers"><div className="section-heading"><div><span className="eyebrow">EXPLORE WHAT&apos;S POSSIBLE</span><h2>A path for every <em>ambition</em></h2></div><a className="text-link" href="/careers">Explore all careers <ArrowRight size={16}/></a></div><div className="career-grid">{careers.map(([careerId,title])=>{const career=careerPaths.find(item=>item.id===careerId)!;return <CareerCard career={career} title={title} variant="landing" key={careerId}/>;})}</div></section>
    <section className="section roadmaps" id="roadmaps"><div className="roadmap-copy-section"><span className="eyebrow">DESIGNED FOR REAL PROGRESS</span><h2>From curious beginner to <em>confident builder</em></h2><p>Know exactly what to learn next. Each roadmap breaks a big career goal into practical skills, focused lessons, and portfolio projects.</p><ul>{["Expert-curated skill sequences", "Practical projects at every stage", "Progress that keeps you moving"].map(x=><li key={x}><CheckCircle2 size={18}/>{x}</li>)}</ul><a className="primary-cta small" href="#start">Find your roadmap <ArrowRight size={17}/></a></div><div className="roadmap-preview"><div className="preview-head"><span><Layers3 size={18}/> Product Designer Roadmap</span><b>38% complete</b></div>{[["1","Design principles","Done"],["2","UX research fundamentals","Done"],["3","Figma essentials","Current"],["4","Design a mobile experience","Next"]].map(([number,label,status])=><div className={`preview-row ${status.toLowerCase()}`} key={label}><span>{status === "Done" ? <CheckCircle2 size={16}/> : number}</span><div><b>{label}</b><small>{status === "Done" ? "Completed" : status === "Current" ? "2 lessons remaining" : "Unlocks next"}</small></div>{status === "Current" && <button>Continue <ArrowRight size={14}/></button>}</div>)}<div className="preview-foot"><span>12 skills mastered</span><span>3 projects completed</span></div></div></section>
    <section className="section stories" id="stories"><div className="section-intro centered"><span className="eyebrow">BUILT WITH LEARNERS</span><h2>Real people. <em>Real momentum.</em></h2></div><div className="testimonial-grid"><Testimonial quote="PathForge gave me the clarity I was missing. I went from feeling overwhelmed to landing my first junior developer role in six months." name="Maya Chen" role="Junior Frontend Developer" initials="MC"/><Testimonial quote="The projects made the difference. I had something tangible to show in interviews — not just courses listed on my CV." name="James Wilson" role="Product Designer at Nova" initials="JW"/><Testimonial quote="It feels like having a mentor who always knows what I should work on next. My confidence has completely changed." name="Tomi Adeyemi" role="Data Analyst" initials="TA"/></div></section>
    <section className="why-section"><div><span className="eyebrow">WHY PATHFORGE</span><h2>Ambition deserves a <em>better system.</em></h2></div><div className="why-points"><p><b>Built for the real journey</b><span>More than content — a focused system for building a career you&apos;re proud of.</span></p><p><b>Structure without rigidity</b><span>Move with purpose, at a pace that works for your life.</span></p><p><b>Progress you can feel</b><span>Small wins compound into the confidence to take your next big step.</span></p></div></section>
    <section className="section faq"><div className="section-intro"><span className="eyebrow">QUESTIONS, ANSWERED</span><h2>Everything you need to <em>know</em></h2></div><div className="faq-list">{faqs.map(([question,answer], index)=><article className="faq-item" key={question}><button onClick={()=>setOpenFaq(openFaq===index?null:index)} aria-expanded={openFaq===index}><span>{question}</span><span className="faq-symbol">{openFaq===index ? "−" : "+"}</span></button>{openFaq===index && <motion.p initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}}>{answer}</motion.p>}</article>)}</div></section>
    <section className="final-cta"><div className="cta-glow"/><span className="eyebrow">YOUR FUTURE STARTS HERE</span><h2>Ready to build a career you <em>believe in?</em></h2><p>Join thousands of learners turning their potential into progress.</p><a className="primary-cta light" href="#start">Start learning for free <ArrowRight size={18}/></a><small>No credit card required · Start in minutes</small></section>
    <footer><a className="logo" href="#top"><span><GraduationCap size={19}/></span>PathForge</a><p>Build the skills. Create the proof. Shape your future.</p><div><a href="#features">How it works</a><a href="#careers">Careers</a><a href="#roadmaps">Roadmaps</a><a href="#faq">FAQ</a></div><small>© 2026 PathForge. Made for your next chapter.</small></footer>
  </main>;
}

function MoreDots() { return <span className="more-dots">•••</span>; }
function Testimonial({quote,name,role,initials}:{quote:string;name:string;role:string;initials:string}){return <article className="testimonial"><Quote size={22}/><p>“{quote}”</p><div><span className="story-avatar">{initials}</span><span><b>{name}</b><small>{role}</small></span><span className="stars">★★★★★</span></div></article>}
