const FEEDBACK_STYLES = {
  correct: 'border-success/25 bg-success/10 text-success',
  incorrect: 'border-danger/25 bg-danger/10 text-danger',
}

const CHEER_ICON = { correct: '🎉', incorrect: '💪' }

export function ExerciseFeedback({ variant, title, cheer, children }) {
  const icon = CHEER_ICON[variant]

  return (
    <div
      role="status"
      aria-live="polite"
      className={`ts-feedback-pop rounded-card border px-4 py-3 text-sm ${FEEDBACK_STYLES[variant]}`}
    >
      <p className="flex items-center gap-2 font-semibold">
        <span className="ts-cheer-icon" aria-hidden="true">
          {icon}
        </span>
        {title}
      </p>
      {cheer ? <p className="mt-2 font-medium leading-snug">{cheer}</p> : null}
      {children ? <p className="mt-2 leading-snug opacity-90">{children}</p> : null}
    </div>
  )
}
