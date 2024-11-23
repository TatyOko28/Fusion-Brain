import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { MinioService } from '../../minio/minio.service';

@Injectable()
export class MinioHealthIndicator extends HealthIndicator {
  constructor(private readonly minioService: MinioService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.minioService.checkConnection();
      return this.getStatus(key, true);
    } catch (error) {
      return this.getStatus(key, false, { message: error.message });
    }
  }
}
