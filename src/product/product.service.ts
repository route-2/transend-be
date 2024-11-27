import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProductService {
  async searchProduct(token: string, term: string, locationId: string): Promise<any> {
    const baseUrl = 'https://api.kroger.com/v1/products';
    const queryParams = `filter.term=${encodeURIComponent(term)}&filter.locationId=${encodeURIComponent(locationId)}`;
    const productUrl = `${baseUrl}?${queryParams}`;

    try {
      const response = await axios.get(productUrl, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Return the raw response for now (you can transform this if needed)
      return response.data;
    } catch (error) {
      console.error('Error fetching product data:', error.response?.data || error.message);
      throw new Error('Failed to fetch product data');
    }
  }
}
