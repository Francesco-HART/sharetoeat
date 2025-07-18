import { Result } from 'neverthrow'

export abstract class JwtDecoder {
  abstract decode(token: string): Result<string, Error>
}
