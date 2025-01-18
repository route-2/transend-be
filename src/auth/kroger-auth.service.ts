// // src/auth/auth.service.ts
// import { Injectable } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';  // Import the HttpService
// import { firstValueFrom } from 'rxjs';  // Use rxjs to convert observable to promise

// @Injectable()
// export class AuthService {
//   constructor(private readonly httpService: HttpService) {}

//   async exchangeCodeForToken(code: string): Promise<string> {
//     const tokenUrl = 'https://api.kroger.com/v1/connect/oauth2/token';
    
//     try {
//       const response = await firstValueFrom(
//         this.httpService.post(tokenUrl, null, {
//           params: {
//             client_id: process.env.KROGER_CLIENT_ID,
//             client_secret: process.env.KROGER_CLIENT_SECRET,
//             grant_type: 'authorization_code',
//             code,
//             redirect_uri: process.env.KROGER_REDIRECT_URI,
//           },
//         })
//       );

//       const { access_token } = response.data;
//       return access_token;  // Return the access token
//     } catch (error) {
//       console.error('Error exchanging code for token:', error);
//       throw new Error('Failed to exchange code for token');
//     }
//   }

//   // Exchange client credentials for an access token
//   async exchangeClientCredentialsForToken(): Promise<string> {
//     const tokenUrl = 'https://api.kroger.com/v1/connect/oauth2/token';

//     try {
//       const response = await firstValueFrom(
//         this.httpService.post(tokenUrl, null, {
//           params: {
//             grant_type: 'client_credentials',  // Use client credentials flow
//             scope: 'product.compact',  // Specify the required scope for product data
//             client_id: process.env.KROGER_CLIENT_ID,  // Your Kroger client ID
//             client_secret: process.env.KROGER_CLIENT_SECRET,  // Your Kroger client secret
//           },
//         })
//       );

//       const { access_token } = response.data;
//       return access_token;  // Return the access token
//     } catch (error) {
//       console.error('Error exchanging client credentials for token:', error);
//       throw new Error('Failed to exchange client credentials for token');
//     }
//   }
// }
// src/auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { Telegraf } from 'telegraf';

@Injectable()
export class AuthService {
  private redisClient: Redis;
  private bot: Telegraf;

  constructor(
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
  ) {
this.redisClient = this.redisService['clients'].get('default');
this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);


  }
 
  
  /**
   * Send a message to the Telegram user
   */
  async sendTelegramMessage(chatId: string, message: string): Promise<void> {
    try {
      await this.bot.telegram.sendMessage(chatId, message);
      console.log(`Message sent to Telegram user ${chatId}:`, message);
    } catch (error) {
      console.error(`Error sending message to Telegram user ${chatId}:`, error.message);
    }
  }

  /**
   * Exchange Authorization Code for User-Specific Access Token
   */
  async exchangeCodeForToken(code: string): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
    const tokenUrl = 'https://api.kroger.com/v1/connect/oauth2/token';
    
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          tokenUrl,
          new URLSearchParams({
            client_id: process.env.KROGER_CLIENT_ID,
            client_secret: process.env.KROGER_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.KROGER_REDIRECT_URI,
          }).toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );
  
      console.log('Kroger Token Exchange Response:', response.data);
  
      // Return the full response
      return response.data;
    } catch (error) {
      console.error('Error exchanging code for token:', error.response?.data || error.message);
      throw new Error('Failed to exchange code for token');
    }
  }

  async refreshAccessToken(chatId: string): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
    const tokensString = await this.redisClient.get(`kroger_tokens:${chatId}`);
    if (!tokensString) {
      console.error(`No tokens found in Redis for chat ID ${chatId}.`);
      throw new Error('No tokens found. User needs to log in again.');
    }
  
    const tokens = JSON.parse(tokensString);
    if (!tokens.refresh_token) {
      console.error(`No refresh token found for chat ID ${chatId}.`);
      throw new Error('No refresh token found. User needs to log in again.');
    }
  
    const tokenUrl = 'https://api.kroger.com/v1/connect/oauth2/token';
  
    try {
      console.log(`Attempting to refresh token for chat ID ${chatId}...`);
      const response = await this.httpService.post(
        tokenUrl,
        new URLSearchParams({
          client_id: process.env.KROGER_CLIENT_ID,
          client_secret: process.env.KROGER_CLIENT_SECRET,
          grant_type: 'refresh_token',
          refresh_token: tokens.refresh_token,
        }).toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      ).toPromise();
  
      const { access_token, refresh_token, expires_in } = response.data;
  
      console.log(`Successfully refreshed token for chat ID ${chatId}. Saving updated tokens...`);
  
      // Save refreshed tokens with updated `created_at`
      await this.saveUserTokens(chatId, {
        access_token,
        refresh_token,
        expires_in,
      });
  
      console.log(`Tokens saved successfully for chat ID ${chatId}.`);
      return { access_token, refresh_token, expires_in };
    } catch (error) {
      console.error(`Error refreshing token for chat ID ${chatId}:`, error.message);
  
      // Handle 401 Unauthorized (invalid refresh token)
      if (error.response?.status === 401) {
        console.error(`Invalid refresh token for chat ID ${chatId}. Deleting Redis key.`);
        await this.redisClient.del(`kroger_tokens:${chatId}`);
      }
  
      throw new Error('Failed to refresh token. User may need to log in again.');
    }
  }
  
  

  async saveUserTokens(chatId: string, tokens: { access_token: string; refresh_token: string; expires_in: number }): Promise<void> {
    const { access_token, refresh_token, expires_in } = tokens;
  
    const created_at = Math.floor(Date.now() / 1000); // Current time in seconds
    console.log(`Saving tokens for chat ID ${chatId} with TTL ${expires_in}`);
  
    await this.redisClient.set(
      `kroger_tokens:${chatId}`,
      JSON.stringify({ access_token, refresh_token, expires_in, created_at }),
      'EX',
      expires_in // Set TTL to match token expiration
    );
  
    console.log(`Tokens saved for chat ID ${chatId}:`, { access_token, refresh_token, expires_in, created_at });
  }
  
  
  async getUserTokens(chatId: string): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
    const tokensString = await this.redisClient.get(`kroger_tokens:${chatId}`);
    if (!tokensString) {
      throw new Error('No tokens found for this user. Please log in.');
    }
  
    const tokens = JSON.parse(tokensString);
  
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const tokenExpirationTime = tokens.created_at + tokens.expires_in; // Calculate exact expiration time
  
    if (currentTime >= tokenExpirationTime) {
      console.log(`Access token expired for chat ID ${chatId}, refreshing token...`);
      return this.refreshAccessToken(chatId); // Refresh the token
    }
  
    return tokens;
  }
  
  
  /**
   * Exchange Client Credentials for a Generic Access Token (no user context)
   */
  async exchangeClientCredentialsForToken(): Promise<string> {
    const tokenUrl = 'https://api.kroger.com/v1/connect/oauth2/token';
    try {
      const response = await firstValueFrom(
        this.httpService.post(tokenUrl, null, {
          params: {
            grant_type: 'client_credentials',
            scope: 'product.compact',
            client_id: process.env.KROGER_CLIENT_ID,
            client_secret: process.env.KROGER_CLIENT_SECRET,
          },
        }),
      );
      const { access_token } = response.data;
      return access_token;
    } catch (error) {
      console.error('Error exchanging client credentials for token:', error);
      throw new Error('Failed to exchange client credentials for token');
    }
  }
}
