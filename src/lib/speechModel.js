/**
 * Speech model playback — Web Speech API wrapper for lesson “Play model” buttons.
 *
 * @see README.md § Speech model playback
 * - speak() must run synchronously inside the user click (mobile Safari).
 * - Prefer modelText in lessonConfig (e.g. "father") over isolated vowels ("ah").
 * - Replace with new Audio(url) when recorded assets are added.
 */

const PREFERRED_VOICE_HINTS = [
  'samantha',
  'google us english',
  'microsoft aria',
  'microsoft zira',
  'karen',
  'daniel',
  'moira',
  'fiona',
]

export function isSpeechModelSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function pickEnglishVoice(voices) {
  const english = voices.filter((v) => v.lang.startsWith('en'))

  for (const hint of PREFERRED_VOICE_HINTS) {
    const match = english.find((v) => v.name.toLowerCase().includes(hint))
    if (match) return match
  }

  return (
    english.find((v) => v.lang === 'en-US' && v.localService) ||
    english.find((v) => v.lang === 'en-US') ||
    english[0]
  )
}

/** Warm up voice list on first load (non-blocking). */
if (typeof window !== 'undefined' && isSpeechModelSupported()) {
  window.speechSynthesis.getVoices()
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices()
  }
}

/**
 * @param {string} text
 * @param {{ rate?: number, pitch?: number }} [options]
 * @returns {Promise<void>}
 */
export function speakModel(text, options = {}) {
  if (!isSpeechModelSupported()) {
    return Promise.reject(new Error('Speech synthesis is not supported in this browser.'))
  }

  const trimmed = text?.trim()
  if (!trimmed) {
    return Promise.reject(new Error('Nothing to play for this card.'))
  }

  const synth = window.speechSynthesis
  synth.cancel()

  const voice = pickEnglishVoice(synth.getVoices())

  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(trimmed)
    utterance.lang = voice?.lang ?? 'en-US'
    utterance.rate = options.rate ?? 0.9
    utterance.pitch = options.pitch ?? 1
    if (voice) utterance.voice = voice

    utterance.onend = () => resolve()
    utterance.onerror = (event) => {
      if (event.error === 'canceled') {
        resolve()
        return
      }
      reject(new Error(event.error || 'Playback failed'))
    }

    synth.speak(utterance)
  })
}

export function stopModelSpeech() {
  if (isSpeechModelSupported()) {
    window.speechSynthesis.cancel()
  }
}
