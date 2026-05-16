import { SELF_CHECK_OPTIONS } from '../../lib/selfCheckOptions.js'

function optionClass(isSelected) {
  return isSelected
    ? 'border-accent bg-accent-subtle text-accent'
    : 'border-transparent bg-surface text-foreground shadow-card hover:border-accent-subtle'
}

/**
 * Post-production self-monitoring on repeat cards (TSH-008).
 * Gates Continue until the learner reflects — no auto speech scoring.
 */
export function SelfCheckIn({ selectedId, onSelect }) {
  return (
    <div
      className="flex flex-col gap-2.5 rounded-card border border-accent-subtle/60 bg-surface px-3 py-3 sm:px-4 sm:py-3.5"
      role="group"
      aria-labelledby="self-check-heading"
    >
      <div>
        <p id="self-check-heading" className="text-sm font-medium text-foreground">
          How did that feel?
        </p>
        <p className="mt-1 text-sm text-foreground-muted">
          Say it out loud first, then tap what fits — there is no wrong answer.
        </p>
      </div>
      <fieldset className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
        <legend className="sr-only">How your repetition felt</legend>
        {SELF_CHECK_OPTIONS.map((option) => {
          const isSelected = selectedId === option.id
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              className={[
                'ts-tap-target ts-focus-ring flex w-full flex-col items-start rounded-card border px-4 py-3 text-left transition-colors',
                optionClass(isSelected),
              ].join(' ')}
              onClick={() => onSelect(option.id)}
            >
              <span className="text-base font-medium">{option.label}</span>
              <span className="mt-0.5 text-sm text-foreground-muted">{option.detail}</span>
            </button>
          )
        })}
      </fieldset>
    </div>
  )
}
