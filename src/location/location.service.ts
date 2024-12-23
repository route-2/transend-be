

// kroger-locations.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class locationService {
  private readonly API_TOKEN_URL = 'https://api.kroger.com/v1/connect/oauth2/token';
  private readonly API_LOCATIONS_URL = 'https://api.kroger.com/v1/locations';

  private readonly CLIENT_ID = process.env.KROGER_CLIENT_ID;
  private readonly CLIENT_SECRET = process.env.KROGER_CLIENT_SECRET;

  async fetchToken(): Promise<string> {
    try {
      const response = await axios.post(
        this.API_TOKEN_URL,
        new URLSearchParams({
          grant_type: 'client_credentials',
        }),
        {
          auth: {
            username: this.CLIENT_ID,
            password: this.CLIENT_SECRET,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data.access_token;
    } catch (err) {
      console.error('Error fetching token:', err);
      throw new HttpException('Failed to fetch token.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async fetchLocations(latitude: string, longitude: string, token: string): Promise<any[]> {
    try {
      const response = await axios.get(this.API_LOCATIONS_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`, // Use token sent from the frontend
        },
        params: {
          'filter.latLong.near': `${latitude},${longitude}`,
          'filter.radiusInMiles': 10, // Default is 10 miles
          'filter.limit': 10, // Default is 10 results
        },
      });
  
      return response.data.data || [];
    } catch (err) {
      console.error('Error fetching locations:', err);
      throw new HttpException(
        'Failed to fetch locations. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}  