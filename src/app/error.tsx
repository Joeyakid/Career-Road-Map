"use client";

import { RefreshCw } from "lucide-react";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="app-state"><div className="error-mark">!</div><h1>We couldn&apos;t load that workspace</h1><p>Your progress is safe. Try again and we&apos;ll get you back on track.</p><button onClick={reset}>Try again <RefreshCw size={16}/></button></main>;
}
