import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('search')
  async search(
    @Query('token') token: string,
    @Query('term') term: string,
    @Query('locationId') locationId: string,
  ): Promise<any> {
    return this.productService.searchProduct(token, term, locationId);
  }

}

/**
   * 
   * curl -X GET \
  'https://api.kroger.com/v1/locations?filter.zipCode.near=46815&filter.department=09' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'

   */
