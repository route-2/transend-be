import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ContextService } from './context-service';
import { UserContext } from './context-entity';
import mongoose from 'mongoose';


@Controller('context')
export class ContextController {
    constructor(private readonly contextService: ContextService) {}

    @Post('save')
    async saveUserContext(@Body() body: { chatId: string; preferences: string[], allergies: string[] }) {
        return this.contextService.saveUserContext(body.chatId, {
            preferences: body.preferences || [],
            allergies: body.allergies || []
        });
    }

    @Get('get/:chatId')
    async getUserContext(@Param('chatId') chatId: string) {
        return this.contextService.getUserContext(chatId);
    }

    @Get('test')
  getTest() {
    return { message: 'Context module is working' };
  }
    @Get('test-db')
    async testDatabaseConnection() {
        const state = mongoose.connection.readyState;
        let statusMessage = "";

        switch (state) {
            case 0:
                statusMessage = "🔴 Disconnected";
                break;
            case 1:
                statusMessage = "🟢 Connected";
                break;
            case 2:
                statusMessage = "🟡 Connecting...";
                break;
            case 3:
                statusMessage = "🟠 Disconnecting...";
                break;
            default:
                statusMessage = "❌ Unknown State";
        }

        return { status: statusMessage, dbURI: process.env.MONGO_URI };
    }
}
