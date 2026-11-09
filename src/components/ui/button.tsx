"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps, MotionProps } from "framer-motion";
import type { ReactNode } from "react";

type ButtonProps = Omit<HTMLMotionProps<"button">, "onDrag"> &
  Pick<MotionProps, "onDrag"> & {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    children: ReactNode;
  };

export function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
  return <motion.button whileTap={{ scale: 0.98 }} className={`pf-button pf-button-${variant} pf-button-${size} ${className}`} {...props}>{children}</motion.button>;
}
