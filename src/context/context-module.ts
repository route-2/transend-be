import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContextService } from './context-service';
import { UserContext, UserContextSchema } from './context-entity';
import { ContextController } from './context-controller'; // Ensure controller is imported

@Module({
    imports: [
        MongooseModule.forFeature([{ name: UserContext.name, schema: UserContextSchema }])
    ],
    controllers: [ContextController], // Ensure this is included
    providers: [ContextService],
    exports: [ContextService],
})
export class ContextModule {}
