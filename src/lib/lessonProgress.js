/**
 * Pure progress math for the lesson bar (TSH-005).
 * `cardNumber` is 1-based (from the state machine); fill reflects current card position.
 */
export function getLessonProgress(cardNumber, cardCount) {
  if (!cardNumber || !cardCount || cardCount < 1) {
    return { fraction: 0, percent: 0, label: '' }
  }

  const fraction = Math.min(1, cardNumber / cardCount)
  return {
    fraction,
    percent: Math.round(fraction * 100),
    label: `Card ${cardNumber} of ${cardCount}`,
  }
}
