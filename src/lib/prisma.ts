import { PrismaClient } from '@/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
  pgPool?: Pool
}

function normalizePgConnectionString(url: string) {
  // We pass `ssl: { rejectUnauthorized: false }` to the pg Pool explicitly.
  // Unfortunately, recent pg/pg-connection-string versions interpret `sslmode=require`
  // as "verify-full" by default (unless `uselibpqcompat=true` is present), which can
  // cause: "self-signed certificate in certificate chain".
  //
  // To make behavior predictable, we strip ssl-related query params from the URL and
  // let the explicit Pool `ssl` option control TLS.
  try {
    const u = new URL(url)

    const sslParams = [
      'sslmode',
      'sslrootcert',
      'sslcert',
      'sslkey',
      'sslpassword',
      'sslaccept',
      'ssl',
      'sslnegotiation',
      'uselibpqcompat',
    ]

    let changed = false
    for (const p of sslParams) {
      if (u.searchParams.has(p)) {
        u.searchParams.delete(p)
        changed = true
      }
    }

    return changed ? u.toString() : url
  } catch {
    return url
  }
}

const rawConnectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL

if (!rawConnectionString) {
  throw new Error(
    'Missing DIRECT_URL or DATABASE_URL. Set a Postgres connection string for Prisma.',
  )
}

const connectionString = normalizePgConnectionString(rawConnectionString)

const pool =
  globalForPrisma.pgPool ??
  new Pool({
    connectionString,
    // Supabase requires SSL
    ssl: { rejectUnauthorized: false },
  })

const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.pgPool = pool
}
