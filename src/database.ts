import * as setupKnex from 'knex'
import { env } from './env/index'

export const config: setupKnex.Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  }
}

export const knex = setupKnex.default(config)
