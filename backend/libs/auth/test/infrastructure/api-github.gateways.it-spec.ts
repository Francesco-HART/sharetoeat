import { APIGithubGateway } from '@app/auth/infrastructure/adapters/github/api-github.gateway'
import * as nock from 'nock'

const clientId = 'github-client-id'
const clientSecret = 'github-client-secret'
const code = 'user-oauth-code'

describe('GitHub OAuth Gateway', () => {
  it('Should retrieve user infos from github in a very simple case', async () => {
    nock('https://github.com')
      .post('/login/oauth/access_token', {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      })
      .matchHeader('Accept', 'application/json')
      .matchHeader('Content-Type', 'application/json')
      .reply(200, {
        access_token: 'github-access-token',
      })

    nock('https://api.github.com')
      .get('/user')
      .matchHeader('Authorization', 'token github-access-token')
      .reply(200, {
        name: 'John Doe',
        avatar_url: 'https://avatars.githubusercontent.com/u/123456',
      })
      .get('/user/emails')
      .matchHeader('Authorization', 'token github-access-token')
      .reply(200, [
        {
          email: 'john.doe@gmail.com',
          primary: true,
        },
      ])

    const github = new APIGithubGateway({
      clientId,
      clientSecret,
    })

    const userInfo = await github.getUser(code)

    expect(userInfo).toEqual({
      email: 'john.doe@gmail.com',
      name: 'John Doe',
      avatarUrl: 'https://avatars.githubusercontent.com/u/123456',
    })
  })

  it('Should retrieve primary email when user have multiple emails', async () => {
    nock('https://github.com').post('/login/oauth/access_token').reply(200, {
      access_token: 'github-access-token',
    })

    nock('https://api.github.com')
      .get('/user')
      .reply(200, {
        name: 'John Doe',
        avatar_url: 'https://avatars.githubusercontent.com/u/123456',
      })
      .get('/user/emails')
      .reply(200, [
        {
          email: 'another-email@gmail.com',
          primary: false,
        },
        {
          email: 'john.doe@gmail.com',
          primary: true,
        },
      ])

    const github = new APIGithubGateway({
      clientId,
      clientSecret,
    })

    const userInfo = await github.getUser(code)

    expect(userInfo).toEqual({
      email: 'john.doe@gmail.com',
      name: 'John Doe',
      avatarUrl: 'https://avatars.githubusercontent.com/u/123456',
    })
  })
})
