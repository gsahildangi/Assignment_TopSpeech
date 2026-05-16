/**
 * Articulation self-check ratings for repeat cards (TSH-008).
 * No pass/fail — learners reflect on how a production felt.
 */
export const SELF_CHECK = {
  CLOSE: 'close',
  BUILDING: 'building',
  RETRY: 'retry',
}

/** @typedef {'close' | 'building' | 'retry'} SelfCheckRating */

export const SELF_CHECK_OPTIONS = [
  {
    id: SELF_CHECK.CLOSE,
    label: 'Felt close',
    detail: 'Matched the model well enough to move on.',
  },
  {
    id: SELF_CHECK.BUILDING,
    label: 'Getting there',
    detail: 'Some parts landed — keep shaping at your pace.',
  },
  {
    id: SELF_CHECK.RETRY,
    label: 'Want another try',
    detail: 'Replay the model and try again before you continue.',
  },
]
