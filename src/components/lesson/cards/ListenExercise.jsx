import { PlayModelButton } from '../PlayModelButton.jsx'

export function ListenExercise({ card }) {
  const speakText = card.modelText ?? card.target
  const speakRate = card.modelRate

  return (
    <div className="flex flex-col gap-4">
      <p className="text-foreground-muted">{card.prompt}</p>
      <div
        className="flex flex-col items-center gap-2 rounded-card border border-accent-subtle bg-accent-subtle/40 px-6 py-8"
        aria-label={`Target sound: ${card.target}`}
      >
        <span className="text-5xl font-semibold tracking-tight text-accent">
          {card.target}
        </span>
        {card.phonetic && (
          <span className="font-mono text-lg text-foreground-muted">{card.phonetic}</span>
        )}
        {speakText !== card.target && (
          <p className="text-sm text-foreground-muted">
            Play example: <span className="font-medium text-foreground">{speakText}</span>
          </p>
        )}
        <PlayModelButton text={speakText} rate={speakRate} className="mt-2" />
      </div>
      {card.hint && <p className="text-sm text-foreground-muted">{card.hint}</p>}
    </div>
  )
}
