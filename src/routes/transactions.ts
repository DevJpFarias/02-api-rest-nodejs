import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { knex } from "../database"
import { randomUUID } from "node:crypto"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists"

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    console.log(`${request.method} ${request.url}`)
  })

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
      const oneWeek = oneDay * 7

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: oneWeek,
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

  app.get('/', {
    preHandler: [checkSessionIdExists]
  }, async (request, reply) => {
    const { sessionId } = request.cookies

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select()

    return {
      transactions
    }
  })

  app.get('/:id', {
    preHandler: [checkSessionIdExists]
  }, async (request) => {
    const { sessionId } = request.cookies

    const getTransactionParamSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamSchema.parse(request.params)

    const transaction = await knex('transactions')
      .select('*')
      .where({
        session_id: sessionId,
        id
      })
      .first()

    return {
      transaction
    }
  })

  app.get('/summary', {
    preHandler: [checkSessionIdExists]
  }, async (request) => {
    const { sessionId } = request.cookies

    const summary = await knex('transactions')
      .where('session_id', sessionId)
      .sum('amount', { as: 'amount' })
      .first()

    return {
      summary
    }
  })
}