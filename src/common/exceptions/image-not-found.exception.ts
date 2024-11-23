import { NotFoundException } from '@nestjs/common';

export class ImageNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Image with ID "${id}" not found`);
  }
}
