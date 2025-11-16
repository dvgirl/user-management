// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

        // 🔍 Log the raw token coming from Postman/frontend
        console.log('📌 Incoming Token:', token);

        return token;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });

    // 🔍 Log to confirm env is loaded
    console.log('🔑 JWT_SECRET Loaded:', process.env.JWT_SECRET);
  }

  async validate(payload: any) {
    // 🔍 Log decoded payload
    console.log('🔐 Decoded Payload:', payload);

    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      isAdmin: payload.isAdmin,
    };
  }
}
