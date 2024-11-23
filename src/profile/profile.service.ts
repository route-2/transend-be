import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  async getProfile(accessToken: string) {
    try {
     

      const response = await axios.get('https://api.kroger.com/v1/identity/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,  
          Accept: 'application/json',
        },
      });

      return response.data; // Return the profile data
    } catch (error) {
      this.logger.error('Error fetching profile from Kroger:', error.response?.data || error.message);
      
      if (error.response && error.response.status === 403) {
        throw new Error('Invalid or expired token. Please authenticate again.');
      }
      
      throw new Error('Failed to fetch profile');
    }
  }
}
