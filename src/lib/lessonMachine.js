/** Lesson flow phases — start screen, sequential cards, end screen. */
export const LESSON_PHASE = {
  START: 'start',
  CARD: 'card',
  END: 'end',
}

export function getInitialLessonState() {
  return { phase: LESSON_PHASE.START, cardIndex: 0 }
}

/**
 * Pure reducer for lesson navigation. Card count comes from static config so
 * the machine never assumes a fixed number of cards in code.
 */
export function lessonReducer(state, action, { cardCount }) {
  switch (action.type) {
    case 'START_LESSON':
      if (state.phase !== LESSON_PHASE.START) return state
      return { phase: LESSON_PHASE.CARD, cardIndex: 0 }

    case 'NEXT':
      if (state.phase !== LESSON_PHASE.CARD) return state
      if (state.cardIndex >= cardCount - 1) {
        return { phase: LESSON_PHASE.END, cardIndex: state.cardIndex }
      }
      return { ...state, cardIndex: state.cardIndex + 1 }

    case 'RESTART':
      return getInitialLessonState()

    default:
      return state
  }
}

export function getCurrentCard(lesson, state) {
  if (state.phase !== LESSON_PHASE.CARD) return null
  return lesson.cards[state.cardIndex] ?? null
}
