import {
  RefreshTokensCommand,
  RefreshTokensHandler,
} from '@app/auth/application/commands/refresh-tokens'
import { FakeJwtGenerator } from '@app/auth/infrastructure/adapters/jwt-generator/fake-jwt-generator'
import { err, ok } from 'neverthrow'

class SUT {
  private jwtGenerator = new FakeJwtGenerator()

  withRefreshToken(refreshToken: string, accessToken: string) {
    this.jwtGenerator.addRefreshAccessToken(refreshToken, accessToken)
    return this
  }

  withExpiredRefreshToken(refreshToken: string) {
    this.jwtGenerator.expiredToken(refreshToken)
    return this
  }

  async refreshToken(refreshToken: string) {
    return new RefreshTokensHandler(this.jwtGenerator).execute(
      new RefreshTokensCommand(refreshToken),
    )
  }
}
describe('Feature: Refresh Tokens', () => {
  test('User can refresh token', async () => {
    const refreshToken = 'valid-refresh-token'
    const accessToken = 'valid-access-token'

    const sut = new SUT().withRefreshToken(refreshToken, accessToken)

    const result = await sut.refreshToken(refreshToken)

    expect(result).toEqual(ok({ access: accessToken }))
  })

  test('User cannot refresh token if it is expired', async () => {
    const refreshToken = 'valid-refresh-token'

    const sut = new SUT().withExpiredRefreshToken(refreshToken)

    const result = await sut.refreshToken(refreshToken)

    expect(result).toEqual(err(new Error('Refresh token expired')))
  })
})
