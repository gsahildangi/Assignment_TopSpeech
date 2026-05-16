import { useCallback, useEffect, useState } from 'react'
import {
  isSpeechModelSupported,
  speakModel,
  stopModelSpeech,
} from '../../lib/speechModel.js'

export function PlayModelButton({ text, rate, className = '' }) {
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(null)
  const supported = isSpeechModelSupported()

  useEffect(() => () => stopModelSpeech(), [])

  const handlePlay = useCallback(() => {
    if (!supported || playing || !text?.trim()) return

    setError(null)
    setPlaying(true)

    speakModel(text, { rate })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Could not play the model.')
      })
      .finally(() => setPlaying(false))
  }, [supported, playing, text, rate])

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        type="button"
        className="ts-tap-target ts-focus-ring flex w-full min-w-[var(--ts-tap-min)] items-center justify-center gap-2 rounded-pill bg-accent px-6 py-3 text-base font-medium text-stone-950 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        aria-label={`Play model: ${text}`}
        aria-busy={playing}
        disabled={!supported || playing || !text?.trim()}
        onClick={handlePlay}
      >
        <span aria-hidden="true">{playing ? '…' : '▶'}</span>
        {playing ? 'Playing…' : 'Play model'}
      </button>
      {!supported && (
        <p className="text-center text-sm text-foreground-muted">
          Speech playback is not available in this browser.
        </p>
      )}
      {error && (
        <p className="text-center text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
