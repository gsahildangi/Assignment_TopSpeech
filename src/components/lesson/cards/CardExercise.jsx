/**
 * Routes card.type to the correct exercise component.
 * @see README.md § Card types & static content
 */
import { CARD_TYPE } from '../../../data/cardTypes.js'
import { ChooseExercise } from './ChooseExercise.jsx'
import { ListenExercise } from './ListenExercise.jsx'
import { RepeatExercise } from './RepeatExercise.jsx'

const EXERCISE_BY_TYPE = {
  [CARD_TYPE.LISTEN]: ListenExercise,
  [CARD_TYPE.REPEAT]: RepeatExercise,
  [CARD_TYPE.CHOOSE]: ChooseExercise,
}

export function CardExercise({ card, chooseSelection, onChooseSelect }) {
  const Exercise = EXERCISE_BY_TYPE[card.type]

  if (!Exercise) {
    return (
      <p className="text-foreground-muted">
        Unknown exercise type: <code>{card.type}</code>
      </p>
    )
  }

  if (card.type === CARD_TYPE.CHOOSE) {
    return (
      <ChooseExercise
        card={card}
        selectedId={chooseSelection}
        onSelect={onChooseSelect}
      />
    )
  }

  return <Exercise card={card} />
}
