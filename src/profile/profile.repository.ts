import { Repository } from 'typeorm';
import { Restaurant } from './profile.entity';


export class RestaurantRepository extends Repository<Restaurant> {
  // Custom method to find restaurant by name
  async findByName(name: string): Promise<Restaurant> {
    return this.findOne({ where: { name } });
  }
}
