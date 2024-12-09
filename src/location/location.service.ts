import { Injectable,HttpException,HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class locationService {
    async getLocation(token: string, latitude: string, longitude: string): Promise<any> {
        
    }
}