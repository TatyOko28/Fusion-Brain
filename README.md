<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Getting Started

### Prerequisites

Before starting, ensure you have installed:
1. Git
2. Docker Desktop (latest version)
3. Node.js (v18+)
4. npm or yarn
5. A Fusion Brain API key

### Initial Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd fusion-brain
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment files:
```bash
# Development environment
cp .env.example .env.development

# Production environment
cp .env.example .env.production

# Test environment
cp .env.example .env.test
```

4. Configure your `.env` file:
```env
# Development API Configuration
FUSION_BRAIN_API_URL=https://dev-api.fusion-brain.com/v1
FUSION_BRAIN_API_KEY=dev-key-xxxxx
PORT=3004
```

Production environment (.env.production):
```env
# Production API Configuration
FUSION_BRAIN_API_URL=https://api.fusion-brain.com/v1
FUSION_BRAIN_API_KEY=prod-key-xxxxx
```

### Database Setup

1. Start PostgreSQL and MinIO:
```bash
docker-compose up -d postgres minio
```

2. Initialize the database:
```bash
# Generate Prisma client
npx prisma generate

# Run initial migration
npx prisma migrate dev --name init
```

### Running the Application

1. Start in development mode:
```bash
npm run start:dev
```

2. Access the services:
- API Documentation: http://localhost:3004/api
- MinIO Console: http://localhost:9001
  - Username: minioadmin
  - Password: minioadmin

### Testing the Setup

1. Check health status:
```bash
curl http://localhost:3004/health
```

2. Create a test image:
```bash
curl -X POST http://localhost:3004/images \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test image","style":"anime"}'
```

## Configuration

### Environment Setup

1. Create environment files for different environments:
```bash
# Development environment
cp .env.example .env.development

# Production environment
cp .env.example .env.production

# Test environment
cp .env.example .env.test
```

### Fusion Brain API Configuration

1. Development Setup:
```env
# .env.development
FUSION_BRAIN_API_URL=https://dev-api.fusion-brain.com/v1
FUSION_BRAIN_API_KEY=dev-key-xxxxx
```

2. Production Setup:
```env
# .env.production
FUSION_BRAIN_API_URL=https://api.fusion-brain.com/v1
FUSION_BRAIN_API_KEY=prod-key-xxxxx
```

3. Link appropriate environment file:
```bash
# For development
ln -s .env.development .env

# For production
ln -s .env.production .env
```

### Environment Features

#### Development Mode
- Mock images when no valid API key
- Permissive health checks
- Short API timeouts (5s)
- Mock data fallbacks

#### Production Mode
- Strict API validation
- No mock data
- Strict health checks
- Long API timeouts (30s)
- Full error reporting

### API Integration Issues

1. API Key Issues:
```bash
# Check API key
echo $FUSION_BRAIN_API_KEY

# Verify endpoint
curl -I $FUSION_BRAIN_API_URL
```

2. Mock Data Testing:
```bash
# Use mock data
FUSION_BRAIN_API_KEY=dev-xxxxx npm run start:dev

# Use real API
FUSION_BRAIN_API_KEY=real-xxxxx npm run start:dev
```

3. Health Checks:
```bash
# Development health check
curl http://localhost:3004/health

# Production health check
curl https://your-production-url/health
```

## Development

### Running Tests

1. Unit Tests:
```bash
npm run test
```

2. E2E Tests:
```bash
npm run test:e2e
```

3. Test Coverage:
```bash
npm run test:cov
```

### API Endpoints

1. Create Image:
```bash
POST /images
{
  "prompt": "A beautiful sunset over mountains",
  "style": "anime"
}
```

2. Check Status:
```bash
GET /images/{id}/status
```

3. Get Image:
```bash
GET /images/{id}?size=original|thumbnail
```

4. List Images:
```bash
GET /images?page=1&limit=20&sortOrder=desc
```

### Database Management

1. Create new migration:
```bash
npx prisma migrate dev --name <migration-name>
```

2. Reset database (development only):
```bash
npx prisma migrate reset
```

3. View database:
```bash
npx prisma studio
```

## Production Deployment

1. Build production image:
```bash
docker build -t fusion-brain-api:prod .
```

2. Configure production environment:
```bash
cp .env.example .env.prod
# Edit .env.prod with production values
```

3. Deploy:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

4. Verify deployment:
```bash
# Check health
curl http://localhost:3004/health

# Check logs
docker-compose logs -f
```

## Troubleshooting

### Common Issues

1. Port Conflicts:
```bash
# Change port in .env
PORT=3005  # Or another free port
```

2. Database Connection:
```bash
# Check PostgreSQL logs
docker-compose logs postgres
```

3. MinIO Issues:
```bash
# Check MinIO logs
docker-compose logs minio
```

4. Permission Issues:
```bash
# Fix logs directory permissions
chmod 777 logs/
```

## Project Structure

```
fusion-brain/
├── src/
│   ├── config/           # Configuration
│   ├── modules/          # Application modules
│   ├── common/           # Shared components
│   └── main.ts          # Entry point
├── prisma/              # Database schema
├── test/                # Tests
└── docker/             # Docker configs
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT

# Fusion Brain Image Generation Service

## Technologies Used

### Backend Framework
- NestJS (v10.x) - Progressive Node.js framework
- TypeScript (v5.x) - Typed JavaScript

### Database & Storage
- PostgreSQL (v14) - Primary database
- Prisma (v5.x) - ORM and database migrations
- MinIO - Object storage for images
- Redis (optional) - Caching layer

### Image Processing
- Sharp - High performance image processing
- Fusion Brain API - AI image generation

### Testing
- Jest - Unit and integration testing
- Supertest - HTTP testing
- Docker Compose - Test environment

### Development Tools
- ESLint - Code linting
- Prettier - Code formatting
- Swagger/OpenAPI - API documentation
- Winston - Logging

### DevOps & Deployment
- Docker - Containerization
- Docker Compose - Multi-container orchestration
- GitHub Actions (optional) - CI/CD
- Health checks - Application monitoring

### Security
- CORS configuration
- Rate limiting
- Input validation
- Environment-based configurations
