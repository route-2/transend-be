import { 
  Controller, 
  Get, 
  Query, 
  Headers, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Search products using query parameters and a token passed explicitly.
   * @param token - The access token for authorization.
   * @param term - The search term (e.g., "fat free milk").
   * @param locationId - The location ID for filtering results.
   */
  @Get('search')
  async search(
    @Query('token') token: string,
    @Query('term') term: string,
    @Query('locationId') locationId: string,
  ): Promise<any> {
    if (!token) {
      throw new HttpException('Token is required', HttpStatus.UNAUTHORIZED);
    }
    if (!term) {
      throw new HttpException('Search term is required', HttpStatus.BAD_REQUEST);
    }

    return this.productService.searchProduct(token, term, locationId);
  }

  /**
   * Search products using the Authorization header to pass the token.
   * @param term - The search term (query parameter).
   * @param authorization - The Bearer token from the Authorization header.
   */
  @Get('searchprod')
  async searchProduct(
    @Query('term') term: string,  // Search term
    @Headers('Authorization') authorization: string,  // Bearer token passed in the Authorization header
  ): Promise<any> {
    if (!authorization) {
      throw new HttpException('Authorization token is required', HttpStatus.UNAUTHORIZED);
    }
    if (!term) {
      throw new HttpException('Search term is required', HttpStatus.BAD_REQUEST);
    }
  
    // Extract the Bearer token from the Authorization header
    const token = authorization.replace('Bearer ', '');
    
    // Pass the token and term to the service for processing
    return this.productService.searchProducts(token, term);
  }
}  


/**
   * 
   * curl -X GET \
  'https://api.kroger.com/v1/locations?filter.zipCode.near=46815&filter.department=09' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'

   */
