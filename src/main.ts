import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await mongoose.connect(process.env.MONGO_URI);

  app.use(cors({ origin: 'http://localhost:3000' }));

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true, // Allow cookies
    }),
  );
  app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: err.message });
  });

  mongoose.connection.once('open', () => console.log('✅ MongoDB Connected'));
  mongoose.connection.on('error', (err) =>
    console.error('❌ MongoDB Connection Error:', err),
  );

  const corsOptions = {
    origin: '*', // Allow all origins (adjust as needed)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Ensure Authorization is allowed
  };
  app.use(cors(corsOptions));

  app.use(function (req, res, next) {
    res.setTimeout(30000, function () {
      // 30 seconds
      console.log('Request has timed out.');
      res.send(408);
    });
    next();
  });

  app.enableCors({
    origin: '*', // Allow only your frontend origin
    methods: 'GET, POST, PUT, DELETE', // Allow specific HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allow specific headers
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
