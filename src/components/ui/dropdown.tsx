"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function Dropdown({ label, items }: { label: string; items: { label: string; onSelect: () => void }[] }) {
  const [open, setOpen] = useState(false);
  return <div className="pf-dropdown"><button onClick={() => setOpen(!open)} aria-expanded={open}>{label}<ChevronDown size={15}/></button>{open && <div role="menu">{items.map((item) => <button role="menuitem" key={item.label} onClick={() => { item.onSelect(); setOpen(false); }}>{item.label}</button>)}</div>}</div>;
}
