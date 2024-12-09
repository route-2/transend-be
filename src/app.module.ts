// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { RestaurantModule } from './restaurant/restaurant.module'; // Import RestaurantModule
// import { Restaurant } from './restaurant/restaurant.entity';  // Your Restaurant entity

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'mysql',  // Or your DB type (mysql, sqlite, etc.)
//       host: 'localhost',
//       port: 3306,  // Change to the correct MySQL port
//       username: 'root',  // Your DB credentials
//       password: 'Rutusway56',
//       database: 'lam',  // Your DB name
//       entities: [Restaurant],  // Register your entities
//       synchronize: true,  // Set to false in production
//     }),
//     RestaurantModule,  // Import your Restaurant module here
//   ],
// })
// export class AppModule {}
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from './profile/profile.module'; // Import RestaurantModule
import { AuthModule } from './auth/kroger-auth.module';
import { Restaurant } from './profile/profile.entity';  // Your Restaurant entity
import { ProductModule } from './product/product.module';
import {locationModule} from './location/location.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Rutusway56',
      database: 'lam',
      entities: [Restaurant], // Register your entities
      synchronize: true,  // Set to false in production
    }),
    ProfileModule, 
    ProductModule,
    locationModule,
  ],
})
export class AppModule {}
