import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserContext } from './context-entity';

@Injectable()
export class ContextService {
    constructor(@InjectModel(UserContext.name) private userContextModel: Model<UserContext>) {}

    async saveUserContext(chatId: string, data: { preferences: string[], allergies: string[] }) {
        // Fetch existing user data
        const existingUser = await this.userContextModel.findOne({ chatId });
    
        if (existingUser) {
            //  Merge existing preferences and new ones
            const updatedPreferences = new Set([
                ...(existingUser.preferences || []), 
                ...(data.preferences || [])
            ]);
    
            //  Merge existing allergies and new ones
            const updatedAllergies = new Set([
                ...(existingUser.allergies || []), 
                ...(data.allergies || [])
            ]);
    
            return await this.userContextModel.findOneAndUpdate(
                { chatId },
                { 
                    $set: { 
                        preferences: Array.from(updatedPreferences), // Convert Set to Array
                        allergies: Array.from(updatedAllergies) // Convert Set to Array
                    } 
                },
                { upsert: true, new: true }
            );
        } else {
            //  If user does not exist, create a new entry
            return await this.userContextModel.create({ 
                chatId, 
                preferences: data.preferences || [], 
                allergies: data.allergies || [] 
            });
        }
    }
    
    

    async getUserContext(chatId: string): Promise<UserContext | null> {
        return await this.userContextModel.findOne({ chatId });
    }
}
