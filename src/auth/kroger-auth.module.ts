// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from "./kroger-auth.controller"
import { AuthService } from './kroger-auth.service'

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService],  // Make sure to add AuthService here
})
export class AuthModule {}
