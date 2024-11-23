import { ApiProperty } from '@nestjs/swagger';

export class ImageItemDto {
  @ApiProperty({
    description: 'Image ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Original prompt used to generate the image',
    example: 'A beautiful sunset over mountains',
  })
  prompt: string;

  @ApiProperty({
    description: 'Style used for generation',
    example: 'anime',
  })
  style: string;

  @ApiProperty({
    description: 'URL to the thumbnail image',
    example: 'https://minio.example.com/thumbnails/123e4567.webp',
  })
  thumbnailUrl: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-03-15T12:00:00Z',
  })
  createdAt: Date;
}

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPreviousPage: boolean;
}

export class ImageListResponseDto {
  @ApiProperty({
    description: 'List of images',
    type: [ImageItemDto],
  })
  data: ImageItemDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
