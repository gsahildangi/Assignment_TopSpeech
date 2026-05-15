import { useState } from 'react'
import { CARD_TYPE } from '../../data/cardTypes.js'
import { CardExercise } from './cards/CardExercise.jsx'
import { LessonButton } from './LessonButton.jsx'

export function CardScreen({ card, cardNumber, cardCount, onNext }) {
  const isLast = cardNumber === cardCount
  const isChoose = card.type === CARD_TYPE.CHOOSE
  const [chooseSelection, setChooseSelection] = useState(null)

  const canContinue = !isChoose || chooseSelection !== null

  return (
    <section
      className="ts-card-enter flex flex-col gap-6 rounded-card bg-surface-elevated p-6 shadow-card"
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
      <LessonButton onClick={onNext} disabled={!canContinue}>
        {isLast ? 'Finish lesson' : 'Continue'}
      </LessonButton>
    </section>
  )
}
