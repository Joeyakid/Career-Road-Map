"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  return <AnimatePresence>{open && <div className="pf-modal-layer" role="dialog" aria-modal="true" aria-label={title}><button className="pf-modal-backdrop" onClick={onClose} aria-label="Close dialog"/><motion.section className="pf-modal" initial={{ opacity: 0, y: 16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }}><header><h2>{title}</h2><button onClick={onClose} aria-label="Close dialog"><X size={18}/></button></header>{children}</motion.section></div>}</AnimatePresence>;
}
