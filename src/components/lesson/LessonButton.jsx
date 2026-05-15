export function LessonButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`ts-tap-target ts-focus-ring w-full rounded-pill bg-accent px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
