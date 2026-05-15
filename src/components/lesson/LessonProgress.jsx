import { getLessonProgress } from '../../lib/lessonProgress.js'

export function LessonProgress({ cardNumber, cardCount }) {
  const { fraction, percent, label } = getLessonProgress(cardNumber, cardCount)

  return (
    <div className="flex flex-col gap-2" aria-label={label}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-foreground-muted">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-accent">{percent}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-pill bg-accent-subtle"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Lesson progress: ${percent} percent`}
      >
        <div
          className="ts-progress-fill h-full rounded-pill bg-accent"
          style={{ width: `${fraction * 100}%` }}
        />
      </div>
    </div>
  )
}
