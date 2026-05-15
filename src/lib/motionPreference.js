/** Matches `--ts-duration-normal` in tokens.css (280ms). */
export const CARD_EXIT_MS = 280

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Delay before advancing after card exit — 0 when reduced motion is on. */
export function getCardExitDelayMs(reducedMotion = prefersReducedMotion()) {
  return reducedMotion ? 0 : CARD_EXIT_MS
}
