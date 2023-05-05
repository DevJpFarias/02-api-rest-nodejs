import Fastify from 'fastify'
import cookie from '@fastify/cookie'

import { transactionsRoutes } from './routes/transactions'
import { env } from './env'

const app = Fastify()

app.register(cookie)

app.register(transactionsRoutes, {
  prefix: `transactions`
})

app.listen({
  port: Number(env.SERVER_PORT),
}).then(() => {
  console.log('HTTP Server Running!')
})
