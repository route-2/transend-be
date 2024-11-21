// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from "./kroger-auth.service"  // Import the AuthService

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('exchange-code')
  async exchangeCode(@Body() body: { code: string }) {
    const { code } = body;
    return this.authService.exchangeCodeForToken(code);  // Delegate logic to AuthService
  }
}
