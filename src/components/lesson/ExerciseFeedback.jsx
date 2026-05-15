const FEEDBACK_STYLES = {
  correct: 'border-success/25 bg-success/10 text-success',
  incorrect: 'border-danger/25 bg-danger/10 text-danger',
}

export function ExerciseFeedback({ variant, title, children }) {
  return (
    <p
      role="status"
      aria-live="polite"
      className={`rounded-card border px-4 py-3 text-sm ${FEEDBACK_STYLES[variant]}`}
    >
      <span className="font-semibold">{title}</span> {children}
    </p>
  )
}
