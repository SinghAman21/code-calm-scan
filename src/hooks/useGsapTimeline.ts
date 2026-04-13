import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/animations/motion-presets";

export function useGsapTimeline() {
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    return () => { tl.current?.kill(); };
  }, []);

  const create = useCallback((config?: gsap.TimelineVars) => {
    tl.current?.kill();
    tl.current = gsap.timeline(config);
    return tl.current;
  }, []);

  return { tl: tl.current, create };
}

export function animateCountUp(
  el: HTMLElement,
  target: number,
  dur = 1.2,
  suffix = ""
) {
  if (prefersReducedMotion()) {
    el.textContent = Math.round(target) + suffix;
    return;
  }
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: dur,
    ease: "power2.out",
    onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; },
  });
}

export function scanLineEffect(container: HTMLElement, onComplete?: () => void) {
  if (prefersReducedMotion()) {
    onComplete?.();
    return;
  }
  const line = document.createElement("div");
  line.className = "scan-line absolute left-0 right-0 h-[2px] z-10 pointer-events-none";
  line.style.top = "0";
  container.style.position = "relative";
  container.appendChild(line);

  gsap.to(line, {
    top: "100%",
    duration: 1.5,
    ease: "power1.inOut",
    onComplete: () => { line.remove(); onComplete?.(); },
  });
}
