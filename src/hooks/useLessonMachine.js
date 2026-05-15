import { useCallback, useMemo, useReducer } from 'react'
import {
  getCurrentCard,
  getInitialLessonState,
  lessonReducer,
  LESSON_PHASE,
} from '../lib/lessonMachine.js'

export function useLessonMachine(lesson) {
  const cardCount = lesson.cards.length

  const [state, dispatch] = useReducer(
    (current, action) => lessonReducer(current, action, { cardCount }),
    undefined,
    getInitialLessonState
  )

  const startLesson = useCallback(() => dispatch({ type: 'START_LESSON' }), [])
  const next = useCallback(() => dispatch({ type: 'NEXT' }), [])
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), [])

  const currentCard = useMemo(
    () => getCurrentCard(lesson, state),
    [lesson, state]
  )

  const cardNumber =
    state.phase === LESSON_PHASE.CARD ? state.cardIndex + 1 : null

  return {
    phase: state.phase,
    cardIndex: state.cardIndex,
    cardCount,
    cardNumber,
    currentCard,
    startLesson,
    next,
    restart,
  }
}
