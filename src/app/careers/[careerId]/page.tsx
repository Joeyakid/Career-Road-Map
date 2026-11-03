import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, Layers3, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { careerPathById } from "@/data/careers/mock-careers";
import { CareerIcon } from "@/components/careers/career-icons";
import StartCareerButton from "@/components/careers/start-career-button";

export default async function CareerDetailPage({ params }: { params: Promise<{ careerId: string }> }) {
  const { careerId } = await params;
  const career = careerPathById.get(careerId);
  if (!career) notFound();
  return <main className="career-detail-page">
    <header className="career-detail-header"><Link href="/" className="explorer-logo"><span><Sparkles size={18}/></span>PathForge</Link><nav><Link href="/careers"><ArrowLeft size={15}/> All careers</Link><Link href="/login">Log in</Link></nav></header>
    <section className="career-detail-hero"><div className="career-detail-copy"><span className="explorer-kicker">CAREER PATH / {career.difficulty.toUpperCase()}</span><h1>{career.title}</h1><p>{career.fullDescription}</p><div className="career-detail-stats"><span><Clock3 size={16}/>{career.estimatedDuration}</span><span><Layers3 size={16}/>{career.skills.length} skills</span><span><BookOpen size={16}/>{career.recommendedProjects.length} projects</span></div><StartCareerButton careerId={career.id}/></div><div className="career-detail-art"><span><CareerIcon careerId={career.id} size={34}/></span><i/><i/><i/></div></section>
    <div className="career-detail-body">
      <section className="career-detail-section"><div className="detail-section-heading"><span>01</span><div><h2>Roadmap preview</h2><p>A practical sequence from foundations to career-ready work.</p></div></div><div className="detail-stage-list">{career.roadmapStages.map((stage, index) => <article key={stage.id}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{stage.title}</h3><p>{stage.summary}</p><small>{stage.duration}</small></div><ArrowRight size={17}/></article>)}</div></section>
      <section className="career-detail-section"><div className="detail-section-heading"><span>02</span><div><h2>Required skills</h2><p>{career.skills.length} skills form the foundation of this path.</p></div></div><div className="detail-skill-grid">{career.skills.map((skill, index) => <article key={skill.id}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{skill.name}</h3><p>{skill.description}</p><small>{skill.difficulty} · {skill.estimatedDuration}</small></div></article>)}</div></section>
      <section className="career-detail-section"><div className="detail-section-heading"><span>03</span><div><h2>Career milestones</h2><p>What you will be able to do as your skills grow.</p></div></div><div className="detail-milestones">{career.roadmapStages.flatMap((stage) => stage.outcomes).map((outcome) => <p key={outcome}><CheckCircle2 size={17}/>{outcome}</p>)}</div></section>
      <section className="career-detail-section"><div className="detail-section-heading"><span>04</span><div><h2>Recommended projects</h2><p>Apply your new skills to tangible portfolio work.</p></div></div><div className="detail-project-grid">{career.recommendedProjects.map((project) => <article key={project.id}><span>{project.difficulty}</span><h3>{project.title}</h3><p>{project.description}</p><small>{project.estimatedDuration}</small></article>)}</div></section>
      <section className="career-detail-section"><div className="detail-section-heading"><span>05</span><div><h2>Learning resources</h2><p>Useful references selected for this path.</p></div></div><div className="detail-resource-list">{career.learningResources.map((resource) => <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer"><span><BookOpen size={17}/></span><div><b>{resource.title}</b><small>{resource.description}</small></div><ArrowRight size={16}/></a>)}</div></section>
      <section className="career-outlook"><span>CAREER OUTLOOK</span><p>{career.careerOutlook}</p><Link href={`/roadmap/${career.id}`}>Open this roadmap <ArrowRight size={16}/></Link></section>
    </div>
  </main>;
}