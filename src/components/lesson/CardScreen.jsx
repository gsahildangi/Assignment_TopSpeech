import { LessonButton } from './LessonButton.jsx'

export function CardScreen({ card, cardNumber, cardCount, onNext }) {
  const isLast = cardNumber === cardCount

  return (
    <section
      className="ts-card-enter flex flex-col gap-6 rounded-card bg-surface-elevated p-6 shadow-card"
      aria-labelledby="lesson-card-title"
    >
      <p className="text-sm font-medium text-foreground-muted">
        Card {cardNumber} of {cardCount}
      </p>
      <div className="flex flex-col gap-2">
        <h2 id="lesson-card-title" className="text-xl font-semibold text-foreground">
          {card.title}
        </h2>
        <p className="text-foreground-muted">{card.body}</p>
      </div>
      <LessonButton onClick={onNext}>
        {isLast ? 'Finish lesson' : 'Continue'}
      </LessonButton>
    </section>
  )
}
