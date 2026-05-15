const STORAGE_KEY = 'topspeech_rewards'

const DEFAULT_REWARDS = {
  streak: 0,
  totalXp: 0,
  lastPracticeDate: null,
}

export function loadRewards() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_REWARDS }
    return { ...DEFAULT_REWARDS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_REWARDS }
  }
}

export function saveRewards(rewards) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rewards))
}
