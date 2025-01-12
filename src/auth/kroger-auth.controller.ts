// // src/auth/auth.controller.ts
// import { Controller, Post, Body } from '@nestjs/common';
// import { AuthService } from "./kroger-auth.service"  // Import the AuthService

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('exchange-code')
//   async exchangeCode(@Body() body: { code: string }) {
//     const { code } = body;
//     return this.authService.exchangeCodeForToken(code);  // Delegate logic to AuthService
//   }

//   // Endpoint to exchange client credentials for token
//   @Post('client-credentials')
//   async exchangeClientCredentials() {
//     try {
//       const accessToken = await this.authService.exchangeClientCredentialsForToken();
//       return { access_token: accessToken };  // Return the access token
//     } catch (error) {
//       return { message: 'Failed to exchange client credentials for token', error: error.message };
//     }
//   }


// }

import { Controller, Get, Query, Res, HttpStatus, Post, Body } from '@nestjs/common';
import { AuthService } from './kroger-auth.service';
import { Response } from 'express';

@Controller('auth/kroger')
export class KrogerAuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Step 1: Redirect user to Kroger's /authorize endpoint
   * - `state` param is the Telegram `chatId`, so we can map the user later.
   */
  @Get('login')
  login(@Query('state') state: string, @Res() res: Response) {
    if(!process.env.KROGER_CLIENT_ID){
      console.log("no client ID specified")
    }
    const authUrl = `https://api.kroger.com/v1/connect/oauth2/authorize?response_type=code&client_id=${
      process.env.KROGER_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(
      process.env.KROGER_REDIRECT_URI
    )}&scope=cart.basic:write&state=${state}`;

    return res.redirect(authUrl);
  }

  /**
   * Step 2: Kroger redirects back here with ?code=...&state=...
   * We exchange the code for an accessToken, then store it keyed by "state" (the chatId).
   */
  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('state') state: string, // Telegram chat ID
    @Res() res: Response
  ) {
    try {
      // Exchange the code for an access token
      const tokenResponse = await this.authService.exchangeCodeForToken(code);
      const { access_token, refresh_token, expires_in } = tokenResponse;
  
      console.log('Access Token:', access_token);
  
      // Save the tokens to Redis or database with the chat ID
      await this.authService.saveUserTokens(state, { access_token, refresh_token, expires_in });
  
      // Notify Telegram bot
      const botMessage = `🎉 Successfully authenticated with Kroger! Your access token is ready to use.`;
      await this.authService.sendTelegramMessage(state, botMessage);
  
      // Optionally redirect the user to a confirmation page
      return res.status(HttpStatus.OK).send('You have successfully authenticated with Kroger! Return to Telegram to continue.');
    } catch (error) {
      console.error('Error during Kroger callback:', error.message);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Failed to authenticate with Kroger.');
    }
  }
  

  @Post('exchange-code')
  async exchangeCode(@Body() body: { code: string; chatId: string }) {
    const { code, chatId } = body;
  
    // Get the full token response
    const tokenResponse = await this.authService.exchangeCodeForToken(code);
  
    // Extract the tokens and expiry time
    const { access_token, refresh_token, expires_in } = tokenResponse;
  
    // Save the tokens in Redis, keyed by chatId
    await this.authService.saveUserTokens(chatId, { access_token, refresh_token, expires_in });
  
    // Return the tokens (if needed by the front-end or bot)
    return { access_token, refresh_token, expires_in };
  }

  @Get('get-tokens')
  async getTokens(@Query('chatId') chatId: string) {
    try {
      const tokens = await this.authService.getUserTokens(chatId);
      return tokens; // Includes access_token, refresh_token, and expires_in
    } catch (error) {
      console.error(`Error fetching tokens for chat ID ${chatId}:`, error.message);
      return { message: error.message };
    }
  }
  

  

}
