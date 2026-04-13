import type { Easing, Transition } from "framer-motion";

// Unified motion tokens
const EASE_DEFAULT: Easing = [0.25, 0.46, 0.45, 0.94];
const EASE_ENTER: Easing = [0.0, 0.0, 0.2, 1.0];
const EASE_EXIT: Easing = [0.4, 0.0, 1.0, 1.0];
const EASE_SPRING: Easing = [0.34, 1.56, 0.64, 1.0];

// Duration tokens (seconds)
export const duration = {
  instant: 0.1,
  fast: 0.18,
  normal: 0.28,
  slow: 0.45,
  page: 0.5,
} as const;

// Reusable transitions
export const transitions = {
  enter: { duration: duration.normal, ease: EASE_ENTER } as Transition,
  exit: { duration: duration.fast, ease: EASE_EXIT } as Transition,
  page: { duration: duration.page, ease: EASE_DEFAULT } as Transition,
  spring: { type: "spring" as const, stiffness: 300, damping: 30 } as Transition,
  springGentle: { type: "spring" as const, stiffness: 200, damping: 25 } as Transition,
} as const;

// Route-level page transition (for AnimatePresence)
export const pageTransition = {
  initial: { opacity: 0, y: 10, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: duration.page, ease: EASE_DEFAULT } },
  exit: { opacity: 0, y: -6, filter: "blur(1px)", transition: { duration: 0.22, ease: EASE_EXIT } },
} as const;

// Variant presets
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: duration.slow, ease: EASE_DEFAULT },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { delay: i * 0.06, duration: duration.normal, ease: EASE_ENTER },
  }),
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: EASE_ENTER },
  },
};

export const slideInLeft = {
  hidden: { x: -16, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: duration.normal, ease: EASE_ENTER } },
};

export const scaleIn = {
  hidden: { scale: 0.96, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: duration.normal, ease: EASE_ENTER } },
};

// Utility: check if reduced motion is preferred
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// No-motion fallback for GSAP
export function gsapDuration(seconds: number): number {
  return prefersReducedMotion() ? 0.01 : seconds;
}
