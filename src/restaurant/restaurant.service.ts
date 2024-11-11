// src/restaurant/restaurant.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  // You can add service methods here for interacting with the database
  findAll(): Promise<Restaurant[]> {
    return this.restaurantRepository.find();
  }

  // Add more methods as needed
}
