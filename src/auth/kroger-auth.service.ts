// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';  // Import the HttpService
import { firstValueFrom } from 'rxjs';  // Use rxjs to convert observable to promise

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async exchangeCodeForToken(code: string): Promise<string> {
    const tokenUrl = 'https://api.kroger.com/v1/connect/oauth2/token';
    
    try {
      const response = await firstValueFrom(
        this.httpService.post(tokenUrl, null, {
          params: {
            client_id: process.env.KROGER_CLIENT_ID,
            client_secret: process.env.KROGER_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.KROGER_REDIRECT_URI,
          },
        })
      );

      const { access_token } = response.data;
      return access_token;  // Return the access token
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw new Error('Failed to exchange code for token');
    }
  }
}
