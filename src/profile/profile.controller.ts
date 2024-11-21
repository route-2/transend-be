import { Controller, Post, Body } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async getProfile(@Body() body: { accessToken: string }) {
    const { accessToken } = body;
    const profile = await this.profileService.getProfile(accessToken);
    return profile;
  }
}
