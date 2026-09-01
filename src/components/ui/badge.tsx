import type { HTMLAttributes } from "react";

export function Badge({ tone = "neutral", className = "", ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "info" | "success" | "warning" | "danger" }) {
  return <span className={`pf-badge pf-badge-${tone} ${className}`} {...props}/>;
}
