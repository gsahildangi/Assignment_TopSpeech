import { LessonFlow } from './components/lesson/LessonFlow.jsx'

function App() {
  return (
    <>
      <a className="ts-skip-link ts-focus-ring" href="#lesson-main">
        Skip to lesson
      </a>
      <main
        id="lesson-main"
        className="ts-app-main bg-surface text-foreground"
        tabIndex={-1}
      >
        <LessonFlow />
      </main>
    </>
  )
}

export default App
