"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Check, CheckCircle2, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const login = useAuthStore((state) => state.login);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const isRegister = mode === "register";
  const passwordStrength = getPasswordStrength(password);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (isRegister) {
      if (password !== confirmPassword) {
        setError("Your passwords do not match.");
        return;
      }
      if (!acceptedTerms) {
        setError("Please agree to the terms to create an account.");
        return;
      }
      const savedEmail = useAuthStore.getState().account?.email;
      if (savedEmail === email.trim().toLowerCase()) {
        setError("An account with this email already exists on this device. Please log in.");
        return;
      }
      register(name, email, password);
      router.push("/onboarding");
      return;
    }

    if (!login(email, password)) {
      setError("Those details do not match a saved PathForge account.");
      return;
    }
    router.push("/dashboard");
  }

  return <main className="auth-page auth-shell">
    <aside className="auth-presentation">
      <Link href="/" className="auth-brand"><span><GraduationCap size={19}/></span>PathForge</Link>
      <div className="auth-presentation-copy">
        <span className="auth-kicker"><Sparkles size={13}/> A clearer way forward</span>
        <h2>{isRegister ? <>Build a career path that feels <em>like yours.</em></> : <>Make your next move <em>count.</em></>}</h2>
        <p>Turn your ambition into a focused roadmap, one practical skill and project at a time.</p>
      </div>
      <div className="auth-roadmap-card" aria-label="Example learning roadmap">
        <div className="auth-roadmap-heading"><span><CheckCircle2 size={16}/></span><div><small>YOUR ROADMAP</small><b>A little progress, every week</b></div><i>67%</i></div>
        <div className="auth-roadmap-track">
          <div className="auth-roadmap-step complete"><span><Check size={12}/></span><div><b>Find your direction</b><small>Career goals</small></div></div>
          <div className="auth-roadmap-step complete"><span><Check size={12}/></span><div><b>Build your foundations</b><small>Core skills</small></div></div>
          <div className="auth-roadmap-step current"><span>3</span><div><b>Make it real</b><small>Projects that show your growth</small></div></div>
        </div>
      </div>
      <div className="auth-presentation-foot"><ShieldCheck size={15}/> Your learning path, saved privately on this device.</div>
      <span className="auth-decoration auth-decoration-one"/><span className="auth-decoration auth-decoration-two"/>
    </aside>

    <section className="auth-panel">
      <Link className="auth-home-link" href="/">Back to PathForge <ArrowRight size={14}/></Link>
      <span className="auth-kicker">{isRegister ? "START YOUR NEXT CHAPTER" : "WELCOME BACK"}</span>
      <h1>{isRegister ? "Create your account" : "Sign in to your path"}</h1>
      <p className="auth-intro">{isRegister ? "A few details now. A learning plan that fits you next." : "Your goals, roadmap, and progress are right where you left them."}</p>

      <form onSubmit={handleSubmit}>
        {isRegister && <label>Full name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} placeholder="Alex Morgan"/></label>}
        <label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com"/></label>
        <label>Password<input type="password" autoComplete={isRegister ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={isRegister ? 8 : 1} placeholder={isRegister ? "At least 8 characters" : "Enter your password"}/></label>
        {isRegister && <>
          <div className="auth-strength" aria-live="polite">
            <div className="auth-strength-label"><span>Password strength</span><b data-strength={passwordStrength.label.toLowerCase()}>{password ? passwordStrength.label : "Add a password"}</b></div>
            <div className="auth-strength-track" role="progressbar" aria-label="Password strength" aria-valuemin={0} aria-valuemax={4} aria-valuenow={passwordStrength.score}><i style={{ width: `${passwordStrength.score * 25}%` }}/></div>
          </div>
          <label>Confirm password<input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} placeholder="Enter your password again"/></label>
          <label className="auth-check"><input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} required/><span>I agree to the Terms and Conditions and Privacy Policy.</span></label>
        </>}
        {!isRegister && <div className="auth-form-options">
          <label className="auth-check"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)}/><span>Remember me</span></label>
          <button type="button" className="auth-forgot" onClick={() => setNotice("Password reset is not available yet. Contact your workspace administrator for help.")}>Forgot password?</button>
        </div>}
        {error && <p className="auth-error" role="alert">{error}</p>}
        {notice && <p className="auth-notice" role="status">{notice}</p>}
        <button className="auth-submit" type="submit">{isRegister ? "Create account" : "Log in"}<ArrowRight size={17}/></button>
      </form>

      <div className="auth-switch">{isRegister ? "Already have an account?" : "Don’t have an account?"} <Link href={isRegister ? "/login" : "/register"}>{isRegister ? "Log in" : "Create account"}</Link></div>
      <small className="auth-prototype-note">Prototype accounts are stored in this browser only.</small>
    </section>
  </main>;
}

function getPasswordStrength(password: string): { score: number; label: string } {
  if (!password) return { score: 0, label: "Add a password" };
  const score = [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ].filter(Boolean).length;
  const labels = ["Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score - 1] ?? "Weak" };
}
