import { JwtDecoder } from '@app/core/application/ports/jwt-decoder'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { err, ok, Result } from 'neverthrow'

@Injectable()
export class NestJwtDecoder implements JwtDecoder {
  constructor(private readonly jwtService: JwtService) {}

  decode(token: string): Result<string, Error> {
    try {
      const user = this.jwtService.verify(token)
      return ok(user.id)
    } catch (error) {
      return err(error)
    }
  }
}
