import { IsString, IsNotEmpty, IsEnum, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ImageStyle {
  ANIME = 'anime',
  REALISTIC = 'realistic',
  ARTISTIC = 'artistic',
  // Add other styles from Fusion Brain API
}

export class CreateImageDto {
  @ApiProperty({
    description: 'Text prompt for image generation',
    example: 'A beautiful sunset over mountains',
    minLength: 3,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 1000, {
    message: 'Prompt must be between 3 and 1000 characters',
  })
  @Matches(/^[a-zA-Z0-9\s.,!?-]+$/, {
    message: 'Prompt contains invalid characters',
  })
  prompt: string;

  @ApiProperty({
    description: 'Image generation style',
    enum: ImageStyle,
    example: ImageStyle.ANIME,
  })
  @IsEnum(ImageStyle, {
    message: `Invalid style. Must be one of: ${Object.values(ImageStyle).join(', ')}`,
  })
  style: ImageStyle;
}
