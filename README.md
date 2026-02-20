diff --git a/e:\PERSONAL PROJECTS\prisma-backend\README.md b/e:\PERSONAL PROJECTS\prisma-backend\README.md
--- a/e:\PERSONAL PROJECTS\prisma-backend\README.md
+++ b/e:\PERSONAL PROJECTS\prisma-backend\README.md
@@ -0,0 +1,157 @@
+# Prisma Backend Starter Kit
+
+A production-ready starter backend built with Node.js, Express, Prisma, and PostgreSQL.
+
+It includes:
+- Express API structure with versioned routing (`/api/v1`)
+- Prisma ORM with PostgreSQL adapter
+- Zod request validation middleware
+- Centralized global error handling (Prisma, Zod, bad JSON, and custom errors)
+- Docker support via `Dockerfile`
+- TypeScript build setup with `tsup`
+
+## Tech Stack
+
+- Node.js
+- Express 5
+- TypeScript
+- Prisma
+- PostgreSQL
+- Zod
+- Docker
+
+## Project Structure
+
+```txt
+src/
+  app.ts
+  server.ts
+  app/
+    routes/
+      index.ts
+    middleware/
+      validate.ts
+    errors/
+      globalErrorHandler.ts
+      prismaErrorHandler.ts
+      handleZodError.ts
+      handleSyntaxError.ts
+    lib/
+      prisma.ts
+prisma/
+  schema.prisma
+  user.prisma
+```
+
+## Prerequisites
+
+- Node.js 20+ (or newer)
+- PostgreSQL database
+- npm
+- Docker (optional)
+
+## Environment Variables
+
+Create a `.env` file in the project root with:
+
+```env
+PORT=3000
+NODE_ENV=development
+ENABLE_SWAGGER=false
+FRONTEND_URL=http://localhost:3000
+DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DB_NAME
+```
+
+## Installation
+
+```bash
+npm install
+```
+
+## Available Scripts
+
+```bash
+npm run dev          # Start development server with watch mode
+npm run build        # Build to dist/ using tsup
+npm start            # Run production build from dist/
+
+npm run db:generate  # Generate Prisma client
+npm run db:migrate   # Create/apply migration in dev
+npm run db:deploy    # Apply migrations in production
+npm run db:push      # Push schema without migration files
+npm run db:reset     # Reset DB (dev only)
+npm run db:studio    # Open Prisma Studio
+npm run db:seed      # Run seed script (if prisma/seed.ts exists)
+```
+
+## Run Locally
+
+1. Set your `.env` values.
+2. Apply database migrations:
+
+```bash
+npm run db:migrate
+```
+
+3. Start the API:
+
+```bash
+npm run dev
+```
+
+Server runs on:
+- `http://localhost:3000` (default from config)
+
+Health route:
+- `GET /` -> Server status response
+
+API base route:
+- `/api/v1`
+
+## Validation and Error Handling
+
+- Use `validate()` middleware (`src/app/middleware/validate.ts`) to parse and validate request payloads with Zod.
+- `globalErrorHandler` handles:
+  - Prisma known request errors
+  - Zod validation errors
+  - Invalid JSON body syntax errors
+  - Custom app errors and fallback internal errors
+
+## Docker
+
+Build the image:
+
+```bash
+docker build -t prisma-backend .
+```
+
+Run the container:
+
+```bash
+docker run --env-file .env -p 5000:5000 prisma-backend
+```
+
+Note:
+- Current `Dockerfile` runs `npm run dev` and exposes port `5000`.
+- Your app config defaults to port `3000` unless `PORT` is set, so set `PORT=5000` in `.env` when running this container.
+
+## Starter Route Setup
+
+Routes are centralized in:
+- `src/app/routes/index.ts`
+
+Add module routes by registering them in `moduleRoutes`, for example:
+
+```ts
+// {
+//   path: "/users",
+//   route: UserRoute
+// }
+```
+
+Then they will be available under:
+- `/api/v1/users`
+
+## License
+
+ISC
# Prisma Backend Starter Kit

A production-ready starter backend built with Node.js, Express, Prisma, and PostgreSQL.

It includes:
- Express API structure with versioned routing (`/api/v1`)
- Prisma ORM with PostgreSQL adapter
- Zod request validation middleware
- Centralized global error handling (Prisma, Zod, bad JSON, and custom errors)
- Docker support via `Dockerfile`
- TypeScript build setup with `tsup`

## Tech Stack

- Node.js
- Express 5
- TypeScript
- Prisma
- PostgreSQL
- Zod
- Docker

## Project Structure

```txt
src/
  app.ts
  server.ts
  app/
    routes/
      index.ts
    middleware/
      validate.ts
    errors/
      globalErrorHandler.ts
      prismaErrorHandler.ts
      handleZodError.ts
      handleSyntaxError.ts
    lib/
      prisma.ts
prisma/
  schema.prisma
  user.prisma
```

## Prerequisites

- Node.js 20+ (or newer)
- PostgreSQL database
- npm
- Docker (optional)

## Environment Variables

Create a `.env` file in the project root with:

```env
PORT=3000
NODE_ENV=development
ENABLE_SWAGGER=false
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DB_NAME
```

## Installation

```bash
npm install
```

## Available Scripts

```bash
npm run dev          # Start development server with watch mode
npm run build        # Build to dist/ using tsup
npm start            # Run production build from dist/

npm run db:generate  # Generate Prisma client
npm run db:migrate   # Create/apply migration in dev
npm run db:deploy    # Apply migrations in production
npm run db:push      # Push schema without migration files
npm run db:reset     # Reset DB (dev only)
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Run seed script (if prisma/seed.ts exists)
```

## Run Locally

1. Set your `.env` values.
2. Apply database migrations:

```bash
npm run db:migrate
```

3. Start the API:

```bash
npm run dev
```

Server runs on:
- `http://localhost:3000` (default from config)

Health route:
- `GET /` -> Server status response

API base route:
- `/api/v1`

## Validation and Error Handling

- Use `validate()` middleware (`src/app/middleware/validate.ts`) to parse and validate request payloads with Zod.
- `globalErrorHandler` handles:
  - Prisma known request errors
  - Zod validation errors
  - Invalid JSON body syntax errors
  - Custom app errors and fallback internal errors

## Docker

Build the image:

```bash
docker build -t prisma-backend .
```

Run the container:

```bash
docker run --env-file .env -p 5000:5000 prisma-backend
```

Note:
- Current `Dockerfile` runs `npm run dev` and exposes port `5000`.
- Your app config defaults to port `3000` unless `PORT` is set, so set `PORT=5000` in `.env` when running this container.

## Starter Route Setup

Routes are centralized in:
- `src/app/routes/index.ts`

Add module routes by registering them in `moduleRoutes`, for example:

```ts
// {
//   path: "/users",
//   route: UserRoute
// }
```

Then they will be available under:
- `/api/v1/...`

## License

ISC
