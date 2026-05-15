/**
 * Static lesson definition — single source of truth for lesson flow (TSH-002).
 * Card types and richer content land in TSH-003; this config only needs enough
 * structure to drive start → cards → end.
 */
export const dailyLesson = {
  id: 'daily-vowels-01',
  title: 'Vowel warm-up',
  description:
    'A short round of listening and repeating vowel sounds. Card exercises expand in a later task.',
  cards: [
    {
      id: 'card-1',
      title: 'Listen: “Ah”',
      body: 'Hear the target vowel sound, then get ready to repeat.',
    },
    {
      id: 'card-2',
      title: 'Repeat: “Ma”',
      body: 'Say the syllable clearly, matching the model.',
    },
    {
      id: 'card-3',
      title: 'Short phrase',
      body: 'Use the vowel in a brief everyday phrase.',
    },
  ],
  completion: {
    title: 'Lesson complete',
    message: 'You made it through today’s warm-up. More card types and feedback come next.',
  },
}
