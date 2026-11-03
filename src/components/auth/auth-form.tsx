"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const login = useAuthStore((state) => state.login);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isRegister = mode === "register";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (isRegister) {
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

  return <main className="auth-page">
    <Link className="auth-back" href="/"><ArrowLeft size={16}/> Back home</Link>
    <section className="auth-panel">
      <Link href="/" className="auth-brand"><span><GraduationCap size={19}/></span>PathForge</Link>
      <span className="auth-kicker">{isRegister ? "YOUR NEXT CHAPTER" : "WELCOME BACK"}</span>
      <h1>{isRegister ? "Start building your path." : "Pick up where you left off."}</h1>
      <p>{isRegister ? "Create an account to save your career direction and learning progress." : "Log in with the details you used to register on this device."}</p>
      <form onSubmit={handleSubmit}>
        {isRegister && <label>Your name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} placeholder="Alex Morgan"/></label>}
        <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com"/></label>
        <label>Password<input type="password" autoComplete={isRegister ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={isRegister ? 8 : 1} placeholder={isRegister ? "At least 8 characters" : "Your password"}/></label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="auth-submit" type="submit">{isRegister ? "Create account" : "Log in"}<ArrowRight size={17}/></button>
      </form>
      <div className="auth-switch">{isRegister ? "Already have an account?" : "New to PathForge?"} <Link href={isRegister ? "/login" : "/register"}>{isRegister ? "Log in" : "Create an account"}</Link></div>
      <small className="auth-prototype-note">Prototype account details are stored in this browser only.</small>
    </section>
  </main>;
}