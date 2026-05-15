/**
 * Pure helper for choose-card feedback state.
 * @see README.md § Choose exercise feedback
 */
export function getChooseResult(card, selectedId) {
  if (!selectedId) {
    return { answered: false, isCorrect: false, selected: null, correct: null }
  }

  const selected = card.options.find((o) => o.id === selectedId) ?? null
  const correct = card.options.find((o) => o.isCorrect) ?? null

  return {
    answered: true,
    isCorrect: Boolean(selected?.isCorrect),
    selected,
    correct,
  }
}
