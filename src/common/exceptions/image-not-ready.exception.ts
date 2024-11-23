import { BadRequestException } from '@nestjs/common';

export class ImageNotReadyException extends BadRequestException {
  constructor(id: string) {
    super(`Image with ID "${id}" is not ready yet`);
  }
}
