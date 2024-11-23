import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MinioService } from '../minio/minio.service';
import { LoggerService } from '../logging/logging.service';
import { CreateImageDto } from './dto/create-image.dto';
import { GetImagesQueryDto } from './dto/get-images.dto';
import { ImageSize } from './dto/get-image.dto';
import { ImageNotFoundException } from '../../common/exceptions/image-not-found.exception';
import { ImageNotReadyException } from '../../common/exceptions/image-not-ready.exception';
import { InvalidImageGenerationException } from '../../common/exceptions/invalid-image-generation.exception';
import * as sharp from 'sharp';
import { ImageCreatedResponseDto } from './dto/responses/image-created.response.dto';
import {
  ImageStatusResponseDto,
  ImageStatus,
} from './dto/responses/image-status.response.dto';
import { ImageListResponseDto } from './dto/responses/image-list.response.dto';
import { FusionBrainService } from '../fusion-brain/fusion-brain.service';

@Injectable()
export class ImagesService {
  constructor(
    private prisma: PrismaService,
    private minioService: MinioService,
    private logger: LoggerService,
    private fusionBrainService: FusionBrainService,
  ) {}

  async createImage(dto: CreateImageDto): Promise<ImageCreatedResponseDto> {
    try {
      this.logger.debug(
        'Creating new image record',
        'ImagesService.createImage',
        {
          prompt: dto.prompt,
          style: dto.style,
        },
      );

      const image = await this.prisma.image.create({
        data: {
          prompt: dto.prompt,
          style: dto.style,
        },
      });

      this.logger.log(
        'Image record created successfully',
        'ImagesService.createImage',
        { imageId: image.id },
      );

      this.processImage(image.id, dto).catch((error) => {
        this.logger.error(
          'Failed to process image',
          error.stack,
          'ImagesService.processImage',
          {
            imageId: image.id,
            error: error.message,
          },
        );
      });

      return { id: image.id };
    } catch (error) {
      this.logger.error(
        'Failed to create image record',
        error.stack,
        'ImagesService.createImage',
        { error: error.message },
      );
      throw new InvalidImageGenerationException(
        'Failed to initialize image generation',
      );
    }
  }

  private async processImage(imageId: string, dto: CreateImageDto) {
    try {
      // Call Fusion Brain API here
      const generatedImage = await this.generateImageWithFusionBrain(dto);

      // Create thumbnail
      const thumbnail = await this.createThumbnail(generatedImage);

      // Upload to Minio
      const originalKey = `original/${imageId}.png`;
      const thumbnailKey = `thumbnails/${imageId}.webp`;

      await this.uploadImages(
        originalKey,
        thumbnailKey,
        generatedImage,
        thumbnail,
      );

      // Update database record
      await this.updateImageStatus(
        imageId,
        'completed',
        originalKey,
        thumbnailKey,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process image ${imageId}: ${error.message}`,
        error.stack,
      );
      await this.updateImageStatus(imageId, 'failed');
      throw error;
    }
  }

  private async generateImageWithFusionBrain(dto: CreateImageDto): Promise<Buffer> {
    try {
      return await this.fusionBrainService.generateImage(dto.prompt, dto.style);
    } catch (error) {
      throw new InvalidImageGenerationException(error.message);
    }
  }

  private async createThumbnail(originalImage: Buffer): Promise<Buffer> {
    try {
      return await sharp(originalImage).resize(128, 128).webp().toBuffer();
    } catch (error) {
      throw new Error(`Failed to create thumbnail: ${error.message}`);
    }
  }

  private async uploadImages(
    originalKey: string,
    thumbnailKey: string,
    originalImage: Buffer,
    thumbnail: Buffer,
  ) {
    try {
      await Promise.all([
        this.minioService.upload(originalKey, originalImage),
        this.minioService.upload(thumbnailKey, thumbnail),
      ]);
    } catch (error) {
      throw new Error(`Failed to upload images: ${error.message}`);
    }
  }

  private async updateImageStatus(
    imageId: string,
    status: 'completed' | 'failed',
    originalUrl?: string,
    thumbnailUrl?: string,
  ) {
    try {
      await this.prisma.image.update({
        where: { id: imageId },
        data: { status, originalUrl, thumbnailUrl },
      });
    } catch (error) {
      this.logger.error(
        `Failed to update image status ${imageId}: ${error.message}`,
        error.stack,
      );
    }
  }

  async getImageStatus(id: string): Promise<ImageStatusResponseDto> {
    const image = await this.prisma.image.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!image) {
      throw new ImageNotFoundException(id);
    }

    return { status: image.status as ImageStatus };
  }

  async getImage(id: string, size: ImageSize) {
    const image = await this.prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      throw new ImageNotFoundException(id);
    }

    if (image.status !== 'completed') {
      throw new ImageNotReadyException(id);
    }

    try {
      const key = size === ImageSize.ORIGINAL ? image.originalUrl : image.thumbnailUrl;
      
      return await this.minioService.getFileStream(key);
    } catch (error) {
      this.logger.error(
        `Failed to get image ${id}: ${error.message}`,
        error.stack,
        'ImagesService.getImage',
        { error: error.message },
      );
      throw new Error('Failed to retrieve image file');
    }
  }

  async getImages(query: GetImagesQueryDto): Promise<ImageListResponseDto> {
    try {
      const { page, limit, sortOrder } = query;
      const skip = (page - 1) * limit;

      const [images, total] = await Promise.all([
        this.prisma.image.findMany({
          where: { status: 'completed' },
          select: {
            id: true,
            prompt: true,
            style: true,
            thumbnailUrl: true,
            createdAt: true,
          },
          orderBy: { createdAt: sortOrder },
          skip,
          take: Number(limit),
        }),
        this.prisma.image.count({
          where: { status: 'completed' },
        }),
      ]);

      if (images.length === 0 && total > 0 && page > 1) {
        throw new BadRequestException(
          `Page ${page} is out of range. Maximum page is ${Math.ceil(
            total / limit,
          )}`,
        );
      }

      const totalPages = Math.ceil(total / limit);

      const paginationMeta = {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };

      // Résoudre toutes les URLs présignées
      const imagesWithUrls = await Promise.all(
        images.map(async (image) => ({
          ...image,
          thumbnailUrl: await this.minioService.getPresignedUrl(image.thumbnailUrl),
        })),
      );

      return {
        data: imagesWithUrls,
        meta: paginationMeta,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Failed to get images list:', error);
      throw new Error('Failed to retrieve images list');
    }
  }
}
