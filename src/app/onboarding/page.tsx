"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap } from "lucide-react";
import { careerPaths } from "@/data/careers/mock-careers";
import { CareerIcon } from "@/components/careers/career-icons";
import { initializeGamification } from "@/lib/gamification";
import { writeStoredValue } from "@/lib/storage";
import { useAppStore } from "@/store/use-app-store";
import { useAuthStore } from "@/store/use-auth-store";
import type { ExperienceLevel, LearningGoal, WeeklyCommitment } from "@/types/domain";

const experienceLevels: ExperienceLevel[] = ["Complete Beginner", "Beginner", "Intermediate", "Advanced"];
const weeklyCommitments: WeeklyCommitment[] = ["1–3 hours", "4–7 hours", "8–14 hours", "15+ hours"];
const learningGoals: LearningGoal[] = [
  "Get my first tech job",
  "Build a portfolio",
  "Change careers",
  "Improve my existing skills",
  "Prepare for freelance work",
  "Learn for personal development",
];
const stepTitles = ["Career goal", "Experience", "Availability", "Learning goal", "Summary"];

export default function OnboardingPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.currentUser);
  const saveOnboarding = useAuthStore((state) => state.saveOnboarding);
  const syncLearningProgress = useAuthStore((state) => state.syncLearningProgress);
  const setActiveCareerId = useAppStore((state) => state.setActiveCareerId);
  const [step, setStep] = useState(1);
  const [careerId, setCareerId] = useState<string | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
  const [weeklyCommitment, setWeeklyCommitment] = useState<WeeklyCommitment | null>(null);
  const [learningGoal, setLearningGoal] = useState<LearningGoal | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const selectedCareer = careerPaths.find((career) => career.id === careerId);
  const canContinue = step === 1 ? Boolean(careerId)
    : step === 2 ? Boolean(experienceLevel)
      : step === 3 ? Boolean(weeklyCommitment)
        : step === 4 ? Boolean(learningGoal)
          : true;

  function startJourney() {
    if (!user || !careerId || !experienceLevel || !weeklyCommitment || !learningGoal) return;
    setIsSaving(true);
    setError("");
    try {
      writeStoredValue(`pathforge-progress-${careerId}`, {
        completedSkillIds: [],
        completedProjectIds: [],
        xp: 0,
      });
      initializeGamification();
      setActiveCareerId(careerId);
      const saved = saveOnboarding({ careerId, experienceLevel, weeklyCommitment, learningGoal });
      if (!saved) throw new Error("Your account could not be found.");
      const career = careerPaths.find((item) => item.id === careerId);
      if (career) syncLearningProgress(career, { completedSkillIds: [], completedProjectIds: [], xp: 0 });
      router.replace("/dashboard");
    } catch {
      setError("We couldn’t save your learning plan. Check your browser storage and try again.");
      setIsSaving(false);
    }
  }

  return <main className="onboarding-page">
    <header>
      <Link className="auth-brand" href="/"><span><GraduationCap size={19}/></span>PathForge</Link>
      <span>STEP {step} OF 5 · {stepTitles[step - 1].toUpperCase()}</span>
    </header>
    <div className="onboarding-progress" role="progressbar" aria-label="Onboarding progress" aria-valuemin={1} aria-valuemax={5} aria-valuenow={step}><span style={{ width: `${step * 20}%` }}/></div>
    <section className="onboarding-content" aria-labelledby="onboarding-title">
      <span className="auth-kicker">YOUR PATH, YOUR PACE</span>
      {step === 1 && <>
        <h1 id="onboarding-title">What do you want to become?</h1>
        <p>Choose a direction. We&apos;ll shape your roadmap around the work you want to do.</p>
        <div className="onboarding-careers" role="group" aria-label="Choose a career path">{careerPaths.map((career) => {
          const isSelected = career.id === careerId;
          return <button className={isSelected ? "selected" : ""} type="button" key={career.id} aria-pressed={isSelected} onClick={() => setCareerId(career.id)}>
            <span className="onboarding-career-icon"><CareerIcon careerId={career.id} size={20}/></span>
            <span className="onboarding-career-copy"><b>{career.title}</b><small>{career.shortDescription}</small></span>
            <span className="onboarding-career-meta"><small>{career.difficulty}</small><small>{career.estimatedDuration}</small></span>
            <CheckCircle2 className="onboarding-career-check" size={19}/>
          </button>;
        })}</div>
      </>}
      {step === 2 && <>
        <h1 id="onboarding-title">What&apos;s your current experience level?</h1>
        <p>This helps us set a useful starting point for your career roadmap.</p>
        <ChoiceGrid options={experienceLevels} selected={experienceLevel} onSelect={setExperienceLevel}/>
      </>}
      {step === 3 && <>
        <h1 id="onboarding-title">How much time can you dedicate each week?</h1>
        <p>Choose a pace that feels sustainable alongside the rest of your life.</p>
        <ChoiceGrid options={weeklyCommitments} selected={weeklyCommitment} onSelect={setWeeklyCommitment}/>
      </>}
      {step === 4 && <>
        <h1 id="onboarding-title">What is your main goal?</h1>
        <p>We&apos;ll keep this goal in view as you build skills and projects.</p>
        <ChoiceGrid options={learningGoals} selected={learningGoal} onSelect={setLearningGoal}/>
      </>}
      {step === 5 && selectedCareer && experienceLevel && weeklyCommitment && learningGoal && <>
        <h1 id="onboarding-title">Your journey starts with a clear plan.</h1>
        <p>Here&apos;s the learning setup we&apos;ll use for your PathForge workspace.</p>
        <dl className="onboarding-summary">
          <div><dt>Career</dt><dd>{selectedCareer.title}</dd><button type="button" onClick={() => setStep(1)}>Edit</button></div>
          <div><dt>Experience</dt><dd>{experienceLevel}</dd><button type="button" onClick={() => setStep(2)}>Edit</button></div>
          <div><dt>Weekly commitment</dt><dd>{weeklyCommitment}</dd><button type="button" onClick={() => setStep(3)}>Edit</button></div>
          <div><dt>Goal</dt><dd>{learningGoal}</dd><button type="button" onClick={() => setStep(4)}>Edit</button></div>
        </dl>
      </>}
      {error && <p className="onboarding-error" role="alert">{error}</p>}
      <div className="onboarding-actions">
        {step > 1 && <button className="onboarding-back" type="button" onClick={() => setStep(step - 1)}><ArrowLeft size={16}/>Back</button>}
        {step < 5
          ? <button className="onboarding-next" type="button" disabled={!canContinue} onClick={() => setStep(step + 1)}>Continue<ArrowRight size={16}/></button>
          : <button className="onboarding-next" type="button" disabled={isSaving || !canContinue} onClick={startJourney}>{isSaving ? "Saving your plan…" : "Start My Journey"}<ArrowRight size={16}/></button>}
      </div>
    </section>
  </main>;
}

function ChoiceGrid<T extends string>({ options, selected, onSelect }: { options: readonly T[]; selected: T | null; onSelect: (option: T) => void }) {
  return <div className="onboarding-options" role="group">
    {options.map((option) => <button className={selected === option ? "selected" : ""} type="button" key={option} aria-pressed={selected === option} onClick={() => onSelect(option)}>{option}<CheckCircle2 size={18}/></button>)}
  </div>;
}