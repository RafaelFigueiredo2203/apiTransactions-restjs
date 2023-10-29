import 'dotenv/config'
import { Knex, knex as setupKnex } from 'knex'
import { env } from './env'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL env not found')
}

export const config: Knex.Config = {
  client: env.DATABASE_CLIENTE,
  // eslint-disable-next-line prettier/prettier
  connection: env.DATABASE_CLIENTE === 'sqlite' ? {
          // eslint-disable-next-line prettier/prettier
    filename: env.DATABASE_URL
        }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migration',
  },
}

export const knex = setupKnex(config)
