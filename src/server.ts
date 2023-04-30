import Fastify from 'fastify'
import crypto from 'node:crypto'
import { knex } from './database'

const fastify = Fastify()

fastify.get('/tables', async function (request, reply) {
  const tables = await knex('sqlite_schema').select('*')

  return tables
})

fastify.post('/transaction', async function (request, reply) {
  const transaction = await knex('transactions')
    .insert({
      id: crypto.randomUUID(),
      title: 'Transação de teste',
      amount: 1000,
    }).returning('*')

  return transaction
})

fastify.get('/transactions', async function (request, reply) {
  const transactions = await knex('transactions')
    .select('*')

  return transactions
})

fastify.listen({
  port: 3333,
}).then(() => {
  console.log('HTTP Server Running!')
})
