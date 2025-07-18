import { JwtDecoder } from '@app/core/application/ports/jwt-decoder'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtDecoder: JwtDecoder) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException('Missing authentication token')
    }

    const decoded = this.jwtDecoder.decode(token)

    if (decoded.isErr()) {
      throw new UnauthorizedException('Invalid or expired token')
    }

    request['user'] = decoded.value
    return true
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers['authorization']
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    return authHeader.split(' ')[1]
  }
}
