import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  logLevel: process.env.LOG_LEVEL || 'info',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
  fusionBrain: {
    apiUrl: process.env.FUSION_BRAIN_API_URL,
    apiKey: process.env.FUSION_BRAIN_API_KEY,
  },
  healthCheck: {
    diskThreshold: parseFloat(process.env.HEALTH_CHECK_DISK_THRESHOLD) || 0.9,
    memoryHeapThreshold:
      parseInt(process.env.HEALTH_CHECK_MEMORY_HEAP_THRESHOLD, 10) || 150,
    memoryRssThreshold:
      parseInt(process.env.HEALTH_CHECK_MEMORY_RSS_THRESHOLD, 10) || 150,
  },
}));
