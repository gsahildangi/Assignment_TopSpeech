export function RewardStat({ icon, label, value, detail }) {
  return (
    <div className="ts-reward-stat flex flex-col gap-1 rounded-card border border-accent-subtle bg-accent-subtle/40 px-4 py-3">
      <span className="text-2xl" aria-hidden>
        {icon}
      </span>
      <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
        {label}
      </p>
      <p className="text-xl font-semibold tabular-nums text-foreground">{value}</p>
      {detail ? <p className="text-sm text-foreground-muted">{detail}</p> : null}
    </div>
  )
}
