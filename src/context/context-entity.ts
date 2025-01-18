import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()  // Add this decorator
export class UserContext extends Document {
    @Prop({ required: true, unique: true })
    chatId: string;

    @Prop({ type: [String], default: [] })
    allergies: string[];

    @Prop({ type: [String], default: [] })
    preferences: string[];

    @Prop({ type: String, default: null })
    diet: string;

    @Prop({ type: Object, default: {} })
    lastConversation: Record<string, any>;
}

export const UserContextSchema = SchemaFactory.createForClass(UserContext);
