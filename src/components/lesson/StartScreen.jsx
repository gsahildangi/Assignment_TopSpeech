import { LessonButton } from './LessonButton.jsx'

export function StartScreen({ lesson, onStart }) {
  return (
    <section
      className="ts-card-enter flex flex-col gap-6 rounded-card bg-surface-elevated p-6 shadow-card"
      aria-labelledby="lesson-start-title"
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          Today&apos;s lesson
        </p>
        <h1
          id="lesson-start-title"
          className="text-2xl font-semibold text-foreground"
        >
          {lesson.title}
        </h1>
        <p className="text-foreground-muted">{lesson.description}</p>
        <p className="text-sm text-foreground-muted">
          {lesson.cards.length} cards · about 3 min
        </p>
      </div>
      <LessonButton onClick={onStart}>Start lesson</LessonButton>
    </section>
  )
}
