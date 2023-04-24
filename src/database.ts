import * as setupKnex from 'knex'

export const config: setupKnex.Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: './db/app.db'
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  }
}

export const knex = setupKnex.default(config)
