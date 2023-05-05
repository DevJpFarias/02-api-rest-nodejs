import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { knex } from "../database"
import { randomUUID } from "node:crypto"

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit'])
    })

    const { title, amount, type } = createTransactionBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if(!sessionId) {
      sessionId = randomUUID()
      
      const oneSecond = 1000
      const oneMinute = oneSecond * 60
      const oneHour = oneMinute * 60
      const oneDay = oneHour * 24
      const sevenDaysInMilliseconds = oneDay * 7

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: sevenDaysInMilliseconds,
      })
    }

    await knex('transactions')
      .insert({
        id: randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        session_id: sessionId,
      })

    return reply.status(201).send()
  })

  app.get('/', async () => {
    const transactions = await knex('transactions').select()

    return {
      transactions
    }
  })

  app.get('/:id', async (request) => {
    const getTransactionParamSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamSchema.parse(request.params)

    const transaction = await knex('transactions').select('*').where('id', id).first()

    return {
      transaction
    }
  })

  app.get('/summary', async () => {
    const summary = await knex('transactions').sum('amount', { as: 'amount' }).first()

    return {
      summary
    }
  })
}