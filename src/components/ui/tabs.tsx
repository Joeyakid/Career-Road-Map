"use client";

import type { ReactNode } from "react";

export function Tabs<T extends string>({ value, onChange, tabs }: { value: T; onChange: (value: T) => void; tabs: { value: T; label: ReactNode }[] }) {
  return <div className="pf-tabs" role="tablist">{tabs.map((tab) => <button key={tab.value} role="tab" aria-selected={tab.value === value} className={tab.value === value ? "active" : ""} onClick={() => onChange(tab.value)}>{tab.label}</button>)}</div>;
}
