// src/cart/cart.controller.ts
import { Controller, Put, Body, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { CartService } from "./cart.service"
import { CartItem } from './cart.model';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Put('add')
  async addItemsToCart(
    @Body() items: CartItem[],      // Array of CartItem objects
    @Headers('Authorization') authHeader: string, // Authorization token
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.replace('Bearer ', ''); // Extract token

    if (!items || items.length === 0) {
      throw new HttpException('Items are required', HttpStatus.BAD_REQUEST);
    }

    try {
      // Call service to add items to cart
      await this.cartService.addItemsToCart(items, token);
      return { status: 'success', message: 'Items added to cart successfully' };
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
