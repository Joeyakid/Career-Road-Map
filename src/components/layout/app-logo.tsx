import Link from "next/link";
import { Sparkles } from "lucide-react";

export function AppLogo({ href = "/" }: { href?: string }) {
  return <Link href={href} className="app-logo"><span><Sparkles size={18}/></span>PathForge</Link>;
}
