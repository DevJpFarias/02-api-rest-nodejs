import Fastify from 'fastify'
import { knex } from './database'

const fastify = Fastify()

fastify.get('/hello', async function (request, reply) {
  const tables = await knex('sqlite_schema').select('*')

  return tables
})

fastify.listen({
  port: 3333,
}).then(() => {
  console.log('HTTP Server Running!')
})
