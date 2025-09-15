// src/auth/kroger-auth.controller.ts
import { Controller, Get, Query, Res, HttpStatus, Post, Body, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './kroger-auth.service';

@Controller('auth/kroger')
export class KrogerAuthController {
  constructor(private readonly authService: AuthService) {}

  // Step 1: redirect to Kroger authorize
  @Get('login')
  login(@Query('state') state: string, @Res() res: Response) {
    const scope = encodeURIComponent('product.compact cart.basic:write');
    const authUrl =
      `https://api.kroger.com/v1/connect/oauth2/authorize?response_type=code` +
      `&client_id=${process.env.KROGER_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(process.env.KROGER_REDIRECT_URI!)}` +
      `&scope=${scope}` +
      `&state=${encodeURIComponent(state)}`;
    return res.redirect(authUrl);
  }

  // Step 2: exchange code, save tokens, notify FE via postMessage
  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('state') state: string, 
    @Res() res: Response
  ) {
    try {
      const tokenResponse = await this.authService.exchangeCodeForToken(code);
      const { access_token, refresh_token, expires_in } = tokenResponse;

      // (a) log
      console.log('Kroger OAuth ok for', state, { expires_in });

      // (b) save (keyed by state=userId)
      await this.authService.saveUserTokens(state, {
        access_token,
        refresh_token,
        expires_in,
      });

      // (c) return a tiny HTML page that posts back to the opener and closes
      const feOrigin = process.env.FRONTEND_ORIGIN || '*'; // e.g. https://yourapp.com during prod
      const html = `
<!doctype html>
<meta charset="utf-8" />
<title>Kroger Auth Complete</title>
<script>
  (function () {
    try {
      if (window.opener) {
        window.opener.postMessage(
          { type: 'kroger-auth', ok: true, userId: ${JSON.stringify(state)} },
          ${JSON.stringify(feOrigin)}
        );
      }
    } catch (e) { /* noop */ }
    window.close();
  })();
</script>
<body>Authenticated. You can close this window.</body>`;
      res.status(HttpStatus.OK).send(html);
    } catch (err: any) {
      console.error('Kroger callback error:', err?.message || err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Failed to authenticate with Kroger.');
    }
  }

  @Post('exchange-code')
  async exchangeCode(@Body() body: { code: string; userId: string }) {
    const { code, userId } = body;
    const tokenResponse = await this.authService.exchangeCodeForToken(code);
    const { access_token, refresh_token, expires_in } = tokenResponse;
    await this.authService.saveUserTokens(userId, { access_token, refresh_token, expires_in });
    return { access_token, refresh_token, expires_in };
  }

  @Get('get-tokens')
  async getTokens(@Query('userId') userId: string) {
    try {
      if (!userId) throw new HttpException('userId is required', HttpStatus.BAD_REQUEST);
      const tokens = await this.authService.getUserTokens(userId);
      if (!tokens) throw new HttpException('No tokens found for this user', HttpStatus.NOT_FOUND);
      return tokens;
    } catch (error: any) {
      console.error(`Error fetching tokens for userId=${userId}:`, error?.message || error);
      throw new HttpException(error.message || 'Failed to fetch tokens', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
