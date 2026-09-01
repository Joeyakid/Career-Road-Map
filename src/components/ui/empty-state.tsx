import type { ReactNode } from "react";

type EmptyStateProps = { icon: ReactNode; title: string; description: string; action?: ReactNode };

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return <section className="app-empty-state" aria-live="polite"><span>{icon}</span><h2>{title}</h2><p>{description}</p>{action}</section>;
}
