export function formatRupee(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatRupeeCompact(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
  return formatRupee(amount)
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}