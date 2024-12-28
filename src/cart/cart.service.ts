// src/cart/cart.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CartItem } from './cart.model';

@Injectable()
export class CartService {
  private readonly krogerApiUrl = 'https://api.kroger.com/v1/cart/add'; // Kroger API URL

  // Method to add items to cart
  async addItemsToCart(items: CartItem[], token: string | null): Promise<void> {
    try {
      // Retry logic to wait for token availability
      const MAX_RETRIES = 5;
      const RETRY_DELAY = 1000; // Delay between retries in milliseconds
  
      let retries = 0;
  
      while (!token && retries < MAX_RETRIES) {
        console.log(`Waiting for token... Retry ${retries + 1}/${MAX_RETRIES}`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY)); // Wait before retrying
        retries++;
        // Optionally, fetch or refresh token logic here
        // token = await this.refreshToken(); // Example
      }
  
      if (!token) {
        throw new Error('Token not available after retries');
      }
  
      // Make the API call
      const response = await axios.put(
        this.krogerApiUrl,
        { items }, // Send the array of items
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
  
      if (response.status !== 204) {
        throw new Error('Failed to add items to the cart');
      }
    } catch (error) {
      console.error('Error adding items to cart:', error.message);
      throw new Error('Error adding items to cart');
    }
  }
}