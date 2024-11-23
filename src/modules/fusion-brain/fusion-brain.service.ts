import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logging/logging.service';
import axios from 'axios';
import * as sharp from 'sharp';

@Injectable()
export class FusionBrainService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly isDevelopment: boolean;

  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
  ) {
    this.apiUrl = this.configService.get<string>('FUSION_BRAIN_API_URL');
    this.apiKey = this.configService.get<string>('FUSION_BRAIN_API_KEY');
    this.isDevelopment = this.configService.get<string>('NODE_ENV') === 'development';
  }

  async generateImage(prompt: string, style: string): Promise<Buffer> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/generate`,
        { prompt, style },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
          timeout: this.isDevelopment ? 5000 : 30000,
        },
      );

      return Buffer.from(response.data);
    } catch (error) {
      if (this.isDevelopment) {
        this.logger.warn(
          'Using mock image in development mode',
          'FusionBrainService',
        );
        return this.getMockImage();
      }
      throw error;
    }
  }

  private async getMockImage(): Promise<Buffer> {
    try {
      // Créer une image test valide avec sharp
      return await sharp({
        create: {
          width: 100,
          height: 100,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 1 }
        }
      })
      .png()
      .toBuffer();
    } catch (error) {
      this.logger.error('Failed to create mock image:', error);
      throw new Error('Failed to create mock image');
    }
  }
}
