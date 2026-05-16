import { useCallback, useState } from 'react'
import { dailyLesson } from '../../data/lessonConfig.js'
import { useLessonMachine } from '../../hooks/useLessonMachine.js'
import { completeLessonRewards } from '../../lib/lessonRewards.js'
import { LESSON_PHASE } from '../../lib/lessonMachine.js'
import { CardScreen } from './CardScreen.jsx'
import { EndScreen } from './EndScreen.jsx'
import { LessonProgress } from './LessonProgress.jsx'
import { StartScreen } from './StartScreen.jsx'

export function LessonFlow({ lesson = dailyLesson }) {
  const {
    phase,
    cardIndex,
    cardCount,
    cardNumber,
    currentCard,
    startLesson,
    next,
    restart,
  } = useLessonMachine(lesson)

  const [completionRewards, setCompletionRewards] = useState(null)

  const handleNext = useCallback(() => {
    const finishingLesson =
      phase === LESSON_PHASE.CARD && cardIndex >= cardCount - 1

    if (finishingLesson) {
      setCompletionRewards(
        completeLessonRewards({ xpReward: lesson.completion.xpReward ?? 20 })
      )
    }

    next()
  }, [phase, cardIndex, cardCount, next, lesson.completion.xpReward])

  const handleRestart = useCallback(() => {
    setCompletionRewards(null)
    restart()
  }, [restart])

  return (
    <div className="ts-lesson-shell" role="region" aria-label="Daily lesson">
      {phase === LESSON_PHASE.START && (
        <StartScreen lesson={lesson} onStart={startLesson} />
      )}

      {phase === LESSON_PHASE.CARD && currentCard && (
        <>
          <LessonProgress
            className="shrink-0"
            cardNumber={cardNumber}
            cardCount={cardCount}
          />
          <CardScreen
            key={currentCard.id}
            card={currentCard}
            cardNumber={cardNumber}
            cardCount={cardCount}
            onNext={handleNext}
          />
        </>
      )}

      {phase === LESSON_PHASE.END && (
        <EndScreen
          completion={lesson.completion}
          rewards={completionRewards}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}
