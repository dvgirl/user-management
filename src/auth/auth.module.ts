// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../users/schemas/user.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import * as dotenv from 'dotenv';
dotenv.config();

console.log("process.env.JWT_SECRET" , process.env.JWT_SECRET) 
@Module({
  imports: [
    PassportModule,
    
    JwtModule.register({
        secret: process.env.JWT_SECRET || 'thisissecratekey',
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN 
            ? Number(process.env.JWT_EXPIRES_IN) 
            : 3600,
        },
      }),

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
