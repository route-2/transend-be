import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { KrogerAuthController } from './kroger-auth.controller';
import { AuthService } from './kroger-auth.service';

@Module({
  imports: [HttpModule],
  controllers: [KrogerAuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
