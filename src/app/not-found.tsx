import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return <main className="app-state"><div className="error-mark"><Compass size={25}/></div><h1>This path doesn&apos;t exist yet</h1><p>Let&apos;s find a learning path that does.</p><Link href="/careers">Explore careers <ArrowRight size={16}/></Link></main>;
}
