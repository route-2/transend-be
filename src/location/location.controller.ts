import { Controller, Get, Query, HttpException, HttpStatus,Headers } from '@nestjs/common';
import { locationService } from './location.service';

@Controller('location')
export class locationController{
    constructor(private readonly krogerLocationsService: locationService) {}

  @Get()
  async getLocations(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Headers('Authorization') authHeader: string,
  ) {
    if (!latitude || !longitude) {
      throw new HttpException('Latitude and Longitude are required.', HttpStatus.BAD_REQUEST);
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new HttpException(
          'Authorization header is missing or invalid.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const token = authHeader.split(' ')[1];

    try {
      return await this.krogerLocationsService.fetchLocations(latitude, longitude,token);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch Kroger locations.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}