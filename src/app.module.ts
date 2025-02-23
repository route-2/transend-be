// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import the RedisModule
import { RedisModule } from '@liaoliaots/nestjs-redis';
import * as dotenv from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/kroger-auth.module';
import { Restaurant } from './profile/profile.entity'; // Example entity
import { ProductModule } from './product/product.module';
import { locationModule } from './location/location.module';
import { CartModule } from './cart/cart.module';
import { ContextModule } from './context/context-module';

dotenv.config();

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
    MongooseModule.forRoot(`${process.env.MONGO_URI}`),
    

    AuthModule,
    ProfileModule,
    ProductModule,
    locationModule,
    CartModule,
    ContextModule
  ],
})
export class AppModule {}
