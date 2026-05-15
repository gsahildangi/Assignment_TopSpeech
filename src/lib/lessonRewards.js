import { loadRewards, saveRewards } from './rewardsStore.js'

/** Local calendar day key (YYYY-MM-DD) for streak boundaries. */
export function toPracticeDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getYesterdayKey(from = new Date()) {
  const yesterday = new Date(from)
  yesterday.setDate(yesterday.getDate() - 1)
  return toPracticeDateKey(yesterday)
}

/**
 * Apply XP and update streak when a lesson reaches the end phase.
 * Idempotent for streak on the same calendar day; XP is granted each completion.
 */
export function completeLessonRewards({ xpReward = 20 } = {}) {
  const stored = loadRewards()
  const today = toPracticeDateKey()
  const yesterday = getYesterdayKey()

  let streak = stored.streak
  let streakMessage

  if (stored.lastPracticeDate === today) {
    streakMessage = 'You already kept your streak alive today.'
  } else if (stored.lastPracticeDate === yesterday) {
    streak = stored.streak + 1
    streakMessage = `${streak}-day streak — keep it going tomorrow!`
  } else if (stored.lastPracticeDate === null) {
    streak = 1
    streakMessage = 'Day 1 of your practice streak.'
  } else {
    streak = 1
    streakMessage = 'Fresh streak started — welcome back.'
  }

  const totalXp = stored.totalXp + xpReward
  saveRewards({ streak, totalXp, lastPracticeDate: today })

  return {
    xpEarned: xpReward,
    totalXp,
    streak,
    streakMessage,
    isFirstPractice: stored.lastPracticeDate === null,
  }
}
