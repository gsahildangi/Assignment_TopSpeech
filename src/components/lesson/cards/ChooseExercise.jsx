import { getChooseResult } from '../../../lib/chooseResult.js'
import {
  getCorrectCheer,
  getIncorrectEncouragement,
} from '../../../lib/feedbackCopy.js'
import { ExerciseFeedback } from '../ExerciseFeedback.jsx'

function optionButtonClass({ option, selectedId, correctId, answered }) {
  const isSelected = selectedId === option.id
  const isCorrectOption = option.id === correctId

  if (!answered) {
    return isSelected
      ? 'border-accent bg-accent-subtle text-accent'
      : 'border-transparent bg-surface text-foreground shadow-card hover:border-accent-subtle'
  }

  if (isCorrectOption) {
    return 'border-success bg-success/10 text-success'
  }

  if (isSelected && !option.isCorrect) {
    return 'border-danger bg-danger/10 text-danger'
  }

  return 'border-transparent bg-surface/80 text-foreground-muted opacity-70'
}

export function ChooseExercise({ card, selectedId, onSelect }) {
  const { answered, isCorrect, selected, correct } = getChooseResult(card, selectedId)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-foreground-muted">{card.prompt}</p>
      <fieldset className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
        <legend className="sr-only">Word choices</legend>
        {card.options.map((option) => {
          const isSelected = selectedId === option.id
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              disabled={answered}
              className={[
                'ts-tap-target ts-focus-ring flex w-full items-center justify-center rounded-card border px-4 py-3 text-lg font-medium transition-colors disabled:cursor-default',
                optionButtonClass({
                  option,
                  selectedId,
                  correctId: correct?.id,
                  answered,
                }),
              ].join(' ')}
              onClick={() => onSelect(option.id)}
            >
              {option.label}
            </button>
          )
        })}
      </fieldset>

      {answered && isCorrect && (
        <ExerciseFeedback
          variant="correct"
          title="Correct!"
          cheer={getCorrectCheer(card.id, selectedId)}
        >
          “{selected.label}” uses the “{card.vowelHint}” vowel you practiced.
        </ExerciseFeedback>
      )}

      {answered && !isCorrect && (
        <ExerciseFeedback
          variant="incorrect"
          title="Keep going"
          cheer={getIncorrectEncouragement(card.id, selectedId)}
        >
          The answer is “{correct?.label}”.
          {selected ? ` “${selected.label}” uses a different vowel.` : ''}
        </ExerciseFeedback>
      )}
    </div>
  )
}
