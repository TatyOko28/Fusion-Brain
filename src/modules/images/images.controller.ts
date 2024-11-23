import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  Body,
  StreamableFile,
  Header,
  Response,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { GetImageParamsDto, GetImageQueryDto } from './dto/get-image.dto';
import { GetImagesQueryDto } from './dto/get-images.dto';
import { ImageCreatedResponseDto } from './dto/responses/image-created.response.dto';
import { ImageStatusResponseDto } from './dto/responses/image-status.response.dto';
import { ImageListResponseDto } from './dto/responses/image-list.response.dto';

@ApiTags('images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new image' })
  @ApiResponse({
    status: 201,
    description: 'Image creation initiated',
    type: ImageCreatedResponseDto,
  })
  async createImage(
    @Body() createImageDto: CreateImageDto,
  ): Promise<ImageCreatedResponseDto> {
    return this.imagesService.createImage(createImageDto);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get image generation status' })
  @ApiResponse({
    status: 200,
    description: 'Returns the status of the image',
    type: ImageStatusResponseDto,
  })
  async getImageStatus(
    @Param() params: GetImageParamsDto,
  ): Promise<ImageStatusResponseDto> {
    return this.imagesService.getImageStatus(params.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get image file' })
  @ApiResponse({
    status: 200,
    description: 'Returns the image file',
    content: {
      'image/*': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Header('Content-Type', 'image/*')
  async getImage(
    @Param() params: GetImageParamsDto,
    @Query() query: GetImageQueryDto,
  ): Promise<StreamableFile> {
    const stream = await this.imagesService.getImage(params.id, query.size);
    return new StreamableFile(stream);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of images with thumbnails' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of images',
    type: ImageListResponseDto,
  })
  async getImages(
    @Query() query: GetImagesQueryDto,
    @Response() res: ExpressResponse,
  ): Promise<void> {
    const result = await this.imagesService.getImages(query);
    // Add pagination headers
    res.header('X-Total-Count', result.meta.total.toString());
    res.header('X-Total-Pages', result.meta.totalPages.toString());
    res.header('X-Current-Page', result.meta.page.toString());
    res.header('X-Has-Next', result.meta.hasNextPage.toString());
    res.header('X-Has-Previous', result.meta.hasPreviousPage.toString());

    // Add Link header for pagination navigation
    const links = [];
    if (result.meta.hasPreviousPage) {
      links.push(
        `</images?page=${result.meta.page - 1}&limit=${result.meta.limit}>; rel="prev"`,
      );
    }
    if (result.meta.hasNextPage) {
      links.push(
        `</images?page=${result.meta.page + 1}&limit=${result.meta.limit}>; rel="next"`,
      );
    }
    if (links.length > 0) {
      res.header('Link', links.join(', '));
    }

    res.json(result);
  }
}
