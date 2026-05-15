import { CARD_TYPE } from './cardTypes.js'

/**
 * Static lesson definition — single source of truth for copy and card payloads (TSH-003).
 * The state machine reads `cards.length` only; shape per card is owned here + CardExercise.
 */
export const dailyLesson = {
  id: 'daily-vowels-01',
  title: 'Vowel warm-up',
  description:
    'Listen to target sounds, repeat syllables and phrases, then pick the word that matches.',
  cards: [
    {
      id: 'card-listen-ah',
      type: CARD_TYPE.LISTEN,
      title: 'Listen: “Ah”',
      prompt: 'Hear the open vowel. Focus on a relaxed jaw and steady tone.',
      target: 'ah',
      modelText: 'father',
      modelRate: 0.9,
      phonetic: '/ɑ/',
      hint: 'As in “father” or “hot”. Play uses the example word.',
    },
    {
      id: 'card-repeat-ma',
      type: CARD_TYPE.REPEAT,
      title: 'Repeat: “Ma”',
      prompt: 'Say the syllable clearly, matching the model you heard.',
      target: 'ma',
      modelText: 'ma',
      modelRate: 0.9,
      phonetic: '/mɑ/',
      tip: 'Start with lips closed for /m/, then open into “ah”.',
    },
    {
      id: 'card-listen-ee',
      type: CARD_TYPE.LISTEN,
      title: 'Listen: “Ee”',
      prompt: 'Notice the smile shape — lips spread, tongue high and forward.',
      target: 'ee',
      modelText: 'see',
      modelRate: 0.9,
      phonetic: '/i/',
      hint: 'As in “see” or “tree”. Play uses the example word.',
    },
    {
      id: 'card-choose-ee',
      type: CARD_TYPE.CHOOSE,
      title: 'Which word uses “ee”?',
      prompt: 'Tap the word that contains the vowel you just practiced.',
      vowelHint: 'ee',
      options: [
        { id: 'see', label: 'see', isCorrect: true },
        { id: 'say', label: 'say', isCorrect: false },
        { id: 'so', label: 'so', isCorrect: false },
      ],
    },
    {
      id: 'card-repeat-phrase',
      type: CARD_TYPE.REPEAT,
      title: 'Repeat the phrase',
      prompt: 'Use “ee” in a short everyday phrase at a comfortable pace.',
      target: 'I see the sea',
      modelText: 'I see the sea',
      modelRate: 0.88,
      phonetic: null,
      tip: 'Pause between words if you need to — clarity over speed.',
    },
  ],
  completion: {
    title: 'Lesson complete',
    message: 'Nice work on today’s vowel warm-up. Your practice counts toward your streak.',
    xpReward: 25,
  },
}
