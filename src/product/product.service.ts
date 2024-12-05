import { Injectable,HttpException,HttpStatus } from '@nestjs/common';
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

  private readonly apiUrl = 'https://api.kroger.com/v1/products';

 /**
   * Search products from the Kroger API using a search term and a token provided by the frontend.
   * @param token - The Bearer token passed from the frontend.
   * @param term - The search term (e.g., "fat free milk").
   * @returns The response data from the Kroger API.
   */
 async searchProducts(token: string, term: string): Promise<any> {
  try {

  
    const response = await axios.get(this.apiUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`, // Token received from the frontend
      },
      timeout:50000,
      params: {
        'filter.term': term,  // Ensure 'filter.term' is the correct query parameter
      },
    });

    return response.data;  // Return the data received from the Kroger API
  } catch (error) {
    console.error('Error in searchProducts:', error.response?.data || error.message);
    throw new HttpException(
      error.response?.data || 'Failed to fetch products',
      error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
}