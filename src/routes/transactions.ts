import { FastifyInstance } from "fastify"
import { knex } from "../database"

export async function transactionsRoutes(fastify: FastifyInstance) {
  fastify.get('/transactions', async function (request, reply) {
    const transactions = await knex('transactions')
      .select('*')
  
    return transactions
  })
}