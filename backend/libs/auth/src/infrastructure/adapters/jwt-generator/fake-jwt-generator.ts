import { JwtGenerator } from '@app/auth/application/ports/jwt-generator'
import { err, ok } from 'neverthrow'

export class FakeJwtGenerator extends JwtGenerator {
  private accessTokens = new Map<string, string>()
  private refreshTokens = new Map<string, string>()
  private refreshAccessTokens = new Map<string, string>()
  private refreshTokenExpired?: string

  generateAccess(id: string): string {
    return this.accessTokens.get(id) || ''
  }
  generateRefresh(id: string): string {
    return this.refreshTokens.get(id) || ''
  }

  refresh(token: string) {
    if (this.refreshTokenExpired === token) {
      return err(new Error('Refresh token expired'))
    }
    return ok(this.refreshAccessTokens.get(token) || '')
  }

  addAccessToken(id: string, token: string) {
    this.accessTokens.set(id, token)
  }

  addRefreshToken(id: string, token: string) {
    this.refreshTokens.set(id, token)
  }

  addRefreshAccessToken(refresh: string, access: string) {
    this.refreshAccessTokens.set(refresh, access)
  }

  expiredToken(token: string) {
    this.refreshTokenExpired = token
  }
}
