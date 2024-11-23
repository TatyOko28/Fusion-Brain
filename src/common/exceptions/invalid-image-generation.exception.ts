import { BadRequestException } from '@nestjs/common';

export class InvalidImageGenerationException extends BadRequestException {
  constructor(message: string) {
    super(`Failed to generate image: ${message}`);
  }
}
