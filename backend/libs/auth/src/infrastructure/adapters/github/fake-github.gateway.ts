import {
  GithubGateway,
  GithubUser,
} from '@app/auth/application/ports/github.gateway'

export class FakeGithubGateway implements GithubGateway {
  private users: Map<string, GithubUser> = new Map()

  async getUser(code: string): Promise<GithubUser> {
    const user = this.users.get(code)
    if (!user) {
      throw new Error('User not found')
    }

    return user
  }

  withUser(code: string, user: GithubUser) {
    this.users.set(code, user)
  }
}
