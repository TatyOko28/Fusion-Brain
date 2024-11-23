import { IsEnum, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export enum ImageSize {
  ORIGINAL = 'original',
  THUMBNAIL = 'thumbnail',
}

export class GetImageParamsDto {
  @ApiProperty({
    description: 'UUID of the image',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: 'Invalid image ID format' })
  id: string;
}

export class GetImageQueryDto {
  @ApiProperty({
    description: 'Size of the image to retrieve',
    enum: ImageSize,
    default: ImageSize.ORIGINAL,
  })
  @IsOptional()
  @IsEnum(ImageSize, {
    message: 'Invalid size. Must be either "original" or "thumbnail"',
  })
  @Transform(({ value }) => value?.toLowerCase())
  size: ImageSize = ImageSize.ORIGINAL;
}
