export type OutboxEventPm = {
  id: number
  name: string
  payload: Record<string, unknown>
  created_at: Date
  processed_at: Date | null
}
