import Link from "next/link";
import { ArrowLeft, ArrowRight, Compass } from "lucide-react";

export default function CareerNotFound() {
  return <main className="career-not-found"><span><Compass size={27}/></span><p>CAREER PATH</p><h1>Career not found</h1><p>That career path is unavailable. Explore the available paths or head back home.</p><div><Link href="/careers"><ArrowLeft size={16}/> Return to Careers</Link><Link href="/">Return Home <ArrowRight size={16}/></Link></div></main>;
}