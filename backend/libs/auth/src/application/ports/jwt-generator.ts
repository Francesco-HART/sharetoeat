import { Result } from 'neverthrow'

export abstract class JwtGenerator {
  abstract generateAccess(id: string): string
  abstract generateRefresh(id: string): string
  abstract refresh(token: string): Result<string, Error>
}
