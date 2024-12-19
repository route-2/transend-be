import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { locationService } from './location.service';

@Controller('location')
export class locationController{
    constructor(private readonly krogerLocationsService: locationService) {}

  @Get()
  async getLocations(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
  ) {
    if (!latitude || !longitude) {
      throw new HttpException('Latitude and Longitude are required.', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.krogerLocationsService.fetchLocations(latitude, longitude);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch Kroger locations.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}