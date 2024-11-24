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


## Initial Setup

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Create and configure your `.env` file:
```bash
# Copy the example environment file
cp .env.example .env

# Add the following configuration to your .env file:
# API Configuration
FUSION_BRAIN_API_URL=https://dev-api.fusion-brain.com/v1
FUSION_BRAIN_API_KEY=your-api-key-here

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5433/fusion_brain

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3004

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=fusion-brain
MINIO_USE_SSL=false
```

## Services Setup

1. Start PostgreSQL and MinIO services:
```bash
docker-compose up -d
```

2. Verify services are running:
```bash
docker-compose ps
```

3. Configure MinIO:
   - Access MinIO Console at http://localhost:9001
   - Login with:
     - Username: minioadmin
     - Password: minioadmin
   - Create a new bucket named 'fusion-brain'

## Database Setup

1. Generate Prisma client:
```bash
npx prisma generate
```

2. Run initial migration:
```bash
npx prisma migrate dev --name init
```

## Running the Application

1. Start in development mode:
```bash
npm run start:dev
```

2. Access the services:
   - API Documentation: http://localhost:3004/api
   - MinIO Console: http://localhost:9001

## Testing the Setup

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

## Environment Configurations

For different environments, you can create specific configuration files:

1. Development environment:
```bash
cp .env .env.development
```

2. Production environment:
```bash
cp .env .env.production
```

3. Test environment:
```bash
cp .env .env.test
```

## Troubleshooting

### Common Issues

1. MinIO Connection Issues:
```bash
# Check MinIO logs
docker-compose logs minio

# Verify MinIO is running
curl http://localhost:9000/minio/health/live
```

2. PostgreSQL Connection Issues:
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Verify PostgreSQL connection
npx prisma db pull
```

3. Environment Variables:
   - Ensure all required variables are set in .env
   - Check for proper MinIO bucket creation
   - Verify PostgreSQL credentials

### Service Management

1. Restart services:
```bash
docker-compose restart
```

2. View logs:
```bash
docker-compose logs -f
```

3. Stop services:
```bash
docker-compose down
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

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository for image generation using Fusion Brain API.

## Technologies Used

### Core Technologies
- **NestJS** (v10.x) - Progressive Node.js framework
- **TypeScript** (v5.x) - Typed JavaScript
- **Node.js** (v18+) - JavaScript runtime

### Database & Storage
- **PostgreSQL** (v14) - Primary database
- **Prisma** (v5.x) - ORM and database migrations
- **MinIO** - Object storage for images

### Image Processing
- **Sharp** - High-performance image processing
- **Fusion Brain API** - AI image generation

### API Documentation & Testing
- **Swagger/OpenAPI** - API documentation
- **Jest** - Testing framework
- **Supertest** - HTTP testing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Docker** - Containerization
- **Docker Compose** - Container orchestration

### Security & Monitoring
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - HTTP security headers
- **Class Validator** - Input validation
- **Winston** - Logging

## Prerequisites

Before starting, ensure you have installed:
1. Git
2. Docker Desktop (latest version)
3. Node.js (v18+)
4. npm or yarn

---

## Screenshots
<div style="display: flex; flex-wrap: wrap; justify-content: center;">
  <img src="/photos/1.png" width="200" alt="Product details Screen"/>
  <img src="/photos/2.png" width="200" alt="Product details Screen"/>
  <img src="/photos/3.png" width="200" alt="Product details Screen"/>
  <img src="/photos/4.png" width="200" alt="Product details Screen"/>
  <img src="/photos/5.png" width="200" alt="Product details Screen"/>
  <img src="/photos/6.png" width="200" alt="Product details Screen"/>
  <img src="/photos/7.png" width="200" alt="Product details Screen"/>
  <img src="/photos/8.png" width="200" alt="Product details Screen"/>
</div>

---