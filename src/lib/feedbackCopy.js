/**
 * Cheer (correct) and encouragement (incorrect) lines for choose-card feedback.
 * Picks are stable per card + selection so re-renders do not shuffle copy.
 */

const CORRECT_CHEERS = [
  'You nailed it — keep that momentum going!',
  'Great ear for the vowel sound!',
  'That’s the one! Your practice is paying off.',
  'Nice work — you matched the sound you heard.',
]

const INCORRECT_ENCOURAGEMENT = [
  'Almost — vowel contrasts take reps. You’ve got the next one.',
  'Good try. Noticing the difference is how you learn the sound.',
  'Every attempt trains your ear — listen again and give it another go.',
  'Mistakes are part of the warm-up. You’re still building the map.',
]

function pickStable(lines, seed) {
  if (!lines.length || !seed) return lines[0] ?? ''
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i)) | 0
  }
  return lines[Math.abs(hash) % lines.length]
}

export function getCorrectCheer(cardId, selectedId) {
  return pickStable(CORRECT_CHEERS, `${cardId}:${selectedId}:correct`)
}

export function getIncorrectEncouragement(cardId, selectedId) {
  return pickStable(INCORRECT_ENCOURAGEMENT, `${cardId}:${selectedId}:incorrect`)
}
