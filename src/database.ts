import * as setupKnex from 'knex'

export const knex = setupKnex.default({
  client: 'sqlite',
  connection: {
    filename: './tmp/app.db'
  }
})
