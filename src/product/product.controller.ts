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
  @Query('term') term: string,  
  @Headers('Authorization') authorization: string,  
): Promise<any> {
  if (!authorization) {
    throw new HttpException('Authorization token is required', HttpStatus.UNAUTHORIZED);
  }
  if (!term) {
    throw new HttpException('Search term is required', HttpStatus.BAD_REQUEST);
  }
  
  // Log the incoming request details for debugging
  console.log(`Received search for term: ${term} with Authorization token`);

  const token = authorization.replace('Bearer ', '');
  
  try {
    const result = await this.productService.searchProducts(token, term);
    console.log('Search result:', result);  // Log search result
  
    return result;
  } catch (error) {
    console.error('Error in searchProducts:', error);  // Log any error
    throw new HttpException('Error in searching products', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
}
/**
   * 
   * curl -X GET \
  'https://api.kroger.com/v1/locations?filter.zipCode.near=46815&filter.department=09' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'

   */
