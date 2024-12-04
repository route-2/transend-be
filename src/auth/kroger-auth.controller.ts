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

  // Endpoint to exchange client credentials for token
  @Post('client-credentials')
  async exchangeClientCredentials() {
    try {
      const accessToken = await this.authService.exchangeClientCredentialsForToken();
      return { access_token: accessToken };  // Return the access token
    } catch (error) {
      return { message: 'Failed to exchange client credentials for token', error: error.message };
    }
  }


}
