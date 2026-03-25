import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AUTH_TOKEN_PAYLOAD_KEYS } from '@/modules/auth/auth.constants';
import { AuthService } from '@/modules/auth/application/auth.service';
import { AuthSessionUser } from '@/modules/auth/interfaces/auth-session-user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'dev_secret',
    });
  }

  async validate(
    request: Request,
    payload: { sub: string; email: string; roles: string[]; permissions: string[]; jti: string },
  ): Promise<AuthSessionUser> {
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    const tokenId = payload[AUTH_TOKEN_PAYLOAD_KEYS.TOKEN_ID];

    if (!accessToken || !tokenId) {
      throw new UnauthorizedException();
    }

    const isValid = await this.authService.validateAccessToken({
      tokenId,
      userId: payload[AUTH_TOKEN_PAYLOAD_KEYS.SUBJECT],
      accessToken,
    });

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload[AUTH_TOKEN_PAYLOAD_KEYS.SUBJECT],
      email: payload.email,
      roles: payload.roles,
      permissions: payload.permissions,
      tokenId,
    };
  }
}
