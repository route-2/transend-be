import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProfileService {
  async getProfile(accessToken: string) {
    try {
      // Make a GET request to Kroger's profile endpoint using the access token
      const response = await axios.get('https://api.kroger.com/v1/identity/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      });

      return response.data; // Return the profile data
    } catch (error) {
      console.error('Error fetching profile from Kroger:', error);
      throw new Error('Failed to fetch profile');
    }
  }
}
