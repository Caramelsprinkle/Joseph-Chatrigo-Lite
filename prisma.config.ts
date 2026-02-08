// Prisma CLI config (Prisma v7+)
// Loads DATABASE_URL from .env so `prisma migrate`/`db push` work locally.
import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DIRECT_URL,
  },
})

