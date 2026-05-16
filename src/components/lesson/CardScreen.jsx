import { useEffect, useState } from 'react'
import { CARD_TYPE } from '../../data/cardTypes.js'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import { getCardExitDelayMs } from '../../lib/motionPreference.js'
import { CardExercise } from './cards/CardExercise.jsx'
import { LessonButton } from './LessonButton.jsx'

export function CardScreen({ card, cardNumber, cardCount, onNext }) {
  const isLast = cardNumber === cardCount
  const isChoose = card.type === CARD_TYPE.CHOOSE
  const isRepeat = card.type === CARD_TYPE.REPEAT
  const [chooseSelection, setChooseSelection] = useState(null)
  const [selfCheckRating, setSelfCheckRating] = useState(null)
  const [isExiting, setIsExiting] = useState(false)
  const reducedMotion = useReducedMotion()
  const cardExitMs = getCardExitDelayMs(reducedMotion)

  const canContinue =
    (!isChoose || chooseSelection !== null) &&
    (!isRepeat || selfCheckRating !== null)

  useEffect(() => {
    if (!isExiting) return undefined

    const timer = window.setTimeout(() => {
      onNext()
    }, cardExitMs)

    return () => window.clearTimeout(timer)
  }, [isExiting, onNext, cardExitMs])

  function handleContinue() {
    if (isExiting) return
    setIsExiting(true)
  }

  return (
    <section
      className={[
        'ts-lesson-card',
        isExiting ? 'ts-card-exit' : 'ts-card-enter',
      ].join(' ')}
      aria-labelledby="lesson-card-title"
    >
      <div className="flex flex-col gap-4">
        <h2 id="lesson-card-title" className="text-xl font-semibold text-foreground">
          {card.title}
        </h2>
        <CardExercise
          card={card}
          chooseSelection={chooseSelection}
          onChooseSelect={setChooseSelection}
          selfCheckRating={selfCheckRating}
          onSelfCheckSelect={setSelfCheckRating}
        />
      </div>
      <LessonButton onClick={handleContinue} disabled={!canContinue || isExiting}>
        {isLast ? 'Finish lesson' : 'Continue'}
      </LessonButton>
    </section>
  )
}
