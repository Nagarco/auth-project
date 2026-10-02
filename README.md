# NestJS Authentication API

A learning project focused on NestJS fundamentals, demonstrating how to implement user authentication and role-based authorization.

## Features

- **Authentication:** Local strategy (email/password) and JWT strategy via Passport.
- **Security by Default:** All routes are protected by a global `JwtAuthGuard`. Use `@Public()` to bypass.
- **Role-Based Access Control (RBAC):** Built-in `@Roles()` decorator and `RolesGuard`.
- **Database Integration:** TypeORM with PostgreSQL.
- **High-Performance Caching:** Redis caching via `@nestjs/cache-manager` and `@keyv/redis`.
- **Data Validation:** Global `ValidationPipe` with whitelist enforcement.
- **Data Serialization:** Global `ClassSerializerInterceptor` to strip sensitive fields (e.g., passwords).
- **Modern Tooling:** ESM modules, Vitest for testing, and Oxlint for fast linting.

## 🛠️ Tech Stack

- **Framework:** [NestJS (v12)](https://nestjs.com/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Database:** PostgreSQL
- **Cache:** Redis
- **Security:** Passport, JWT, bcrypt

## Installation

```bash
$ npm install
```

## Configuration

Ensure you have a `.env` file in the root directory with the following variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
