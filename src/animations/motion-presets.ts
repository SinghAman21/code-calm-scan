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

// ============================================
// SIGNATURE ANIMATIONS FOR CODE CALM SCAN
// ============================================

/**
 * CASCADING FINDINGS ANIMATION
 * Used in FindingsPanel when findings load.
 * Each finding slides in with a spring rhythm, creating
 * a "wave" of discoveries. Visual metaphor: scanning down the code.
 */
export const cascadeContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const cascadeItem = {
  hidden: { opacity: 0, x: -20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: duration.normal,
      ease: EASE_ENTER,
      type: "spring" as const,
      stiffness: 120,
      damping: 14,
    },
  },
};

/**
 * BLOOM EFFECT FOR SELECTED FINDING
 * When a finding is selected, its left border "blooms" outward
 * and the card gains subtle elevation. Indicates focus intent.
 */
export const bloomBorder = {
  idle: {
    borderLeftWidth: "2px",
    transition: { duration: 0.2, ease: EASE_DEFAULT },
  },
  selected: {
    borderLeftWidth: "4px",
    transition: { duration: 0.2, ease: EASE_ENTER },
  },
};

export const bloomElevation = {
  idle: {
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    transition: { duration: 0.2, ease: EASE_DEFAULT },
  },
  selected: {
    boxShadow: "0 4px 12px 0 rgba(23, 78, 79, 0.15)",
    transition: { duration: 0.2, ease: EASE_ENTER },
  },
};

/**
 * SCAN BUTTON PULSE
 * While scanning, the button pulses with the primary color.
 * Creates a sense of active searching. Loops until scan completes.
 */
export const scanPulse = {
  scanning: {
    boxShadow: [
      "0 0 0 0 rgba(23, 78, 79, 0.7)",
      "0 0 0 10px rgba(23, 78, 79, 0)",
    ],
    transition: {
      duration: 1.5,
      ease: "easeOut",
      repeat: Infinity,
    },
  },
  idle: {
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  },
};

/**
 * HOVER LIFT EFFECT
 * Interactive elements gain subtle lift on hover,
 * creating a tactile "clickable" sensation.
 */
export const hoverLift = {
  rest: {
    y: 0,
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  },
  hover: {
    y: -2,
    boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.1)",
    transition: { duration: duration.fast, ease: EASE_ENTER },
  },
  tap: {
    y: 0,
  },
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
