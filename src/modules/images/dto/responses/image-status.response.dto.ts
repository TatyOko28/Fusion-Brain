import { ApiProperty } from '@nestjs/swagger';

export enum ImageStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class ImageStatusResponseDto {
  @ApiProperty({
    description: 'Current status of the image generation',
    enum: ImageStatus,
    example: ImageStatus.COMPLETED,
  })
  status: ImageStatus;
}
