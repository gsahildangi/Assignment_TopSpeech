import { dailyLesson } from '../../data/lessonConfig.js'
import { useLessonMachine } from '../../hooks/useLessonMachine.js'
import { LESSON_PHASE } from '../../lib/lessonMachine.js'
import { CardScreen } from './CardScreen.jsx'
import { EndScreen } from './EndScreen.jsx'
import { StartScreen } from './StartScreen.jsx'

export function LessonFlow({ lesson = dailyLesson }) {
  const {
    phase,
    cardCount,
    cardNumber,
    currentCard,
    startLesson,
    next,
    restart,
  } = useLessonMachine(lesson)

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      {phase === LESSON_PHASE.START && (
        <StartScreen lesson={lesson} onStart={startLesson} />
      )}

      {phase === LESSON_PHASE.CARD && currentCard && (
        <CardScreen
          key={currentCard.id}
          card={currentCard}
          cardNumber={cardNumber}
          cardCount={cardCount}
          onNext={next}
        />
      )}

      {phase === LESSON_PHASE.END && (
        <EndScreen completion={lesson.completion} onRestart={restart} />
      )}
    </div>
  )
}
