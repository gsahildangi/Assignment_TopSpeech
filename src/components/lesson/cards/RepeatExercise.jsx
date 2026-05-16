import { PlayModelButton } from '../PlayModelButton.jsx'
import { SelfCheckIn } from '../SelfCheckIn.jsx'

export function RepeatExercise({ card, selfCheckRating, onSelfCheckSelect }) {
  const speakText = card.modelText ?? card.target
  const speakRate = card.modelRate

  return (
    <div className="flex flex-col gap-3">
      <p className="text-foreground-muted">{card.prompt}</p>
      <div
        className="flex flex-col items-center gap-2 rounded-card border border-accent-subtle bg-surface px-5 py-5 sm:py-6"
        aria-label={`Repeat: ${card.target}`}
      >
        <span className="text-center text-4xl font-semibold tracking-tight text-foreground">
          {card.target}
        </span>
        {card.phonetic && (
          <span className="font-mono text-lg text-foreground-muted">{card.phonetic}</span>
        )}
        <PlayModelButton text={speakText} rate={speakRate} className="mt-2" />
      </div>
      {card.tip && (
        <p className="rounded-card bg-accent-subtle/30 px-4 py-3 text-sm text-foreground-muted">
          <span className="font-medium text-foreground">Tip: </span>
          {card.tip}
        </p>
      )}
      <SelfCheckIn selectedId={selfCheckRating} onSelect={onSelfCheckSelect} />
    </div>
  )
}
