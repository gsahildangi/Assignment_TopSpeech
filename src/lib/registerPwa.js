import { registerSW } from 'virtual:pwa-register'

/**
 * Registers the Workbox service worker and logs lifecycle hooks in dev.
 * `autoUpdate` (vite.config) lets new builds activate on the next navigation.
 */
export function registerPwa() {
  const isDev = import.meta.env.DEV

  registerSW({
    immediate: true,
    onOfflineReady() {
      if (isDev) {
        console.info('[PWA] Cached for offline use')
      }
    },
    onRegistered(registration) {
      if (isDev && registration) {
        console.info('[PWA] Service worker registered', registration.scope)
      }
    },
    onRegisterError(error) {
      console.error('[PWA] Service worker registration failed', error)
    },
  })
}
