import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaHealthIndicator } from './indicators/prisma.health';
import { MinioHealthIndicator } from './indicators/minio.health';
import { ConfigService } from '@nestjs/config';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private prisma: PrismaHealthIndicator,
    private minio: MinioHealthIndicator,
    private config: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check application health status' })
  check() {
    const checks = [
      () => this.prisma.isHealthy('database'),
      () => this.minio.isHealthy('storage'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      () => this.disk.checkStorage('storage', {
        thresholdPercent: 0.9,
        path: '/app/logs',
      }),
    ];

    if (this.config.get('NODE_ENV') === 'production') {
      checks.push(() => this.http.pingCheck(
        'fusion-brain-api',
        this.config.get('FUSION_BRAIN_API_URL'),
      ));
    } else {
      checks.push(async () => {
        try {
          await this.http.pingCheck(
            'fusion-brain-api',
            this.config.get('FUSION_BRAIN_API_URL'),
          );
          return {
            'fusion-brain-api': { status: 'up' },
          };
        } catch (error) {
          return {
            'fusion-brain-api': {
              status: 'up',
              message: 'Development mode - API check skipped',
            },
          };
        }
      });
    }

    return this.health.check(checks);
  }
}
