// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import the RedisModule
import { RedisModule } from '@liaoliaots/nestjs-redis';

import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/kroger-auth.module';
import { Restaurant } from './profile/profile.entity'; // Example entity
import { ProductModule } from './product/product.module';
import { locationModule } from './location/location.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    RedisModule.forRoot({
      closeClient: true,

      readyLog: true,

      config: {
        host: 'localhost',
        port: 6379,
      },
    }),

    // 2) Configure MySQL TypeORM
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Rutusway56',
      database: 'lam',
      entities: [Restaurant],
      synchronize: true,
    }),

    AuthModule,
    ProfileModule,
    ProductModule,
    locationModule,
    CartModule,
  ],
})
export class AppModule {}
