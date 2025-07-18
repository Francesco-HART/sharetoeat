export type GithubUser = {
  name: string
  email: string
  avatarUrl: string
}

export abstract class GithubGateway {
  getUser: (code: string) => Promise<GithubUser>
}
