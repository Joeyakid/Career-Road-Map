"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut, Settings as SettingsIcon, Sparkles } from "lucide-react";
import { careerPathById } from "@/data/careers/mock-careers";
import { useAppStore } from "@/store/use-app-store";
import { useAuthStore } from "@/store/use-auth-store";

export default function SettingsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const activeCareerId = useAppStore((state) => state.activeCareerId);
  const careerId = user?.selectedCareer ?? activeCareerId;
  const career = careerPathById.get(careerId ?? "");

  function handleLogout() {
    logout();
    router.replace("/");
  }

  return <main className="account-settings-page">
    <header><Link className="explorer-logo" href="/dashboard"><span><Sparkles size={18}/></span>PathForge</Link><Link href="/dashboard"><ArrowLeft size={15}/> Dashboard</Link></header>
    <section><span className="settings-kicker"><SettingsIcon size={14}/> ACCOUNT</span><h1>Settings</h1><p>Manage your local PathForge profile and career direction.</p>
      <dl><div><dt>Name</dt><dd>{user?.name}</dd></div><div><dt>Email</dt><dd>{user?.email}</dd></div><div><dt>Selected career</dt><dd>{career?.title ?? "No career selected"}</dd></div></dl>
      <button onClick={handleLogout}><LogOut size={16}/> Log out</button>
    </section>
  </main>;
}