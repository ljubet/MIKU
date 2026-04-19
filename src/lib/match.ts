export function computeMatchScore(jobTags: string[], studentSkills: string[]): number {
  if (!jobTags.length) return 0
  const normalizedSkills = studentSkills.map((s) => s.toLowerCase())
  const normalizedTags = jobTags.map((t) => t.toLowerCase())
  const matches = normalizedTags.filter((t) => normalizedSkills.includes(t)).length
  const raw = Math.round((matches / normalizedTags.length) * 100)
  return Math.max(0, Math.min(raw, 100))
}
