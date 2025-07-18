export type EmailAuthRequestPm = {
  id: string
  email: string
  code: string
  expires_at: Date
  is_used: boolean
}
