// src/cart/cart.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CartItem } from './cart.model';

@Injectable()
export class CartService {
  private readonly krogerApiUrl = 'https://api.kroger.com/v1/cart/add'; // Kroger API URL

  // Method to add items to cart
  async addItemsToCart(items: CartItem[], token: string): Promise<void> {
    try {
      const response = await axios.put(
        this.krogerApiUrl,
        { items },  // Send the array of items
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
      console.error('Error adding items to cart:', error);
      throw new Error('Error adding items to cart');
    }
  }
}
