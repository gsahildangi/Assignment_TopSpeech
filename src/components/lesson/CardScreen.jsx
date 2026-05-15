import { useEffect, useState } from 'react'
import { CARD_TYPE } from '../../data/cardTypes.js'
import { CardExercise } from './cards/CardExercise.jsx'
import { LessonButton } from './LessonButton.jsx'

const CARD_EXIT_MS = 280

export function CardScreen({ card, cardNumber, cardCount, onNext }) {
  const isLast = cardNumber === cardCount
  const isChoose = card.type === CARD_TYPE.CHOOSE
  const [chooseSelection, setChooseSelection] = useState(null)
  const [isExiting, setIsExiting] = useState(false)

  const canContinue = !isChoose || chooseSelection !== null

  useEffect(() => {
    if (!isExiting) return undefined

    const timer = window.setTimeout(() => {
      onNext()
    }, CARD_EXIT_MS)

    return () => window.clearTimeout(timer)
  }, [isExiting, onNext])

  function handleContinue() {
    if (isExiting) return
    setIsExiting(true)
  }

  return (
    <section
      className={[
        'flex flex-col gap-6 rounded-card bg-surface-elevated p-6 shadow-card',
        isExiting ? 'ts-card-exit' : 'ts-card-enter',
      ].join(' ')}
      aria-labelledby="lesson-card-title"
    >
      <p className="text-sm font-medium text-foreground-muted">
        Card {cardNumber} of {cardCount}
      </p>
      <div className="flex flex-col gap-4">
        <h2 id="lesson-card-title" className="text-xl font-semibold text-foreground">
          {card.title}
        </h2>
        <CardExercise
          card={card}
          chooseSelection={chooseSelection}
          onChooseSelect={setChooseSelection}
        />
      </div>
      <LessonButton onClick={handleContinue} disabled={!canContinue || isExiting}>
        {isLast ? 'Finish lesson' : 'Continue'}
      </LessonButton>
    </section>
  )
}
