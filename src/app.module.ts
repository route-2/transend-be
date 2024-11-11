import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './restaurant/restaurant.entity'; 
import { RestaurantModule } from './restaurant/restaurant.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',            // Database type
      host: 'localhost',        // Database host
      port: 3306,               // MySQL default port
      username: 'root',         // MySQL username
      password: '',             // MySQL password (set this value)
      database: 'lam',          // Database name
      synchronize: true,        // Automatically synchronize the schema (not recommended for production)
      entities: [Restaurant],   // Add your Restaurant entity here
    }),
    RestaurantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
