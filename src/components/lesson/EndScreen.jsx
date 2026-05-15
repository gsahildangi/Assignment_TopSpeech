import { LessonButton } from './LessonButton.jsx'

export function EndScreen({ completion, onRestart }) {
  return (
    <section
      className="ts-card-enter flex flex-col gap-6 rounded-card bg-surface-elevated p-6 shadow-card"
      aria-labelledby="lesson-end-title"
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-wide text-success">
          Complete
        </p>
        <h2 id="lesson-end-title" className="text-2xl font-semibold text-foreground">
          {completion.title}
        </h2>
        <p className="text-foreground-muted">{completion.message}</p>
      </div>
      <LessonButton onClick={onRestart}>Practice again</LessonButton>
    </section>
  )
}
