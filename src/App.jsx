function App() {
  return (
    <main className="min-h-dvh bg-surface px-4 py-8 text-foreground">
      <div className="mx-auto flex max-w-md flex-col gap-4">
        <p className="text-sm text-foreground-muted">
          Tailwind handles layout; tokens drive colors, radius, and motion
          duration.
        </p>
        <section
          className="ts-card-enter rounded-card bg-surface-elevated p-6 shadow-card"
          aria-label="Sample lesson card"
        >
          <h1 className="text-lg font-semibold text-foreground">
            Daily lesson
          </h1>
          <p className="mt-2 text-foreground-muted">
            Middle path check: <code className="text-accent">bg-surface</code>,{' '}
            <code className="text-accent">rounded-card</code>, and{' '}
            <code className="text-accent">.ts-card-enter</code> from motion.css.
          </p>
        </section>
      </div>
    </main>
  )
}

export default App
