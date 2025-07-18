import {
  GithubGateway,
  GithubUser,
} from '@app/auth/application/ports/github.gateway'

type Config = {
  clientId: string
  clientSecret: string
}

type Email = {
  email: string
  primary: boolean
}

type Profile = {
  name: string
  avatar_url: string
}

export class APIGithubGateway implements GithubGateway {
  constructor(private readonly config: Config) {}

  private fetchGithubApi(path: string, accessToken: string) {
    return fetch(`https://api.github.com${path}`, {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    })
  }

  private async getAccessToken(code: string) {
    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          code,
        }),
      },
    )

    const tokens = await response.json()
    return tokens.access_token
  }

  private async getProfile(accessToken: string) {
    const response = await this.fetchGithubApi('/user', accessToken)
    return (await response.json()) as Profile
  }

  private async getUserPrimaryEmail(accessToken: string) {
    const response = await this.fetchGithubApi('/user/emails', accessToken)

    const emails = (await response.json()) as Email[]
    return emails.find((email) => email.primary)!.email
  }

  async getUser(code: string): Promise<GithubUser> {
    const accessToken = await this.getAccessToken(code)
    const profile = await this.getProfile(accessToken)
    const email = await this.getUserPrimaryEmail(accessToken)

    return {
      email,
      name: profile.name,
      avatarUrl: profile.avatar_url,
    }
  }
}
