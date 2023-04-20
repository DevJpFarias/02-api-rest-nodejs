import Fastify from 'fastify'

const fastify = Fastify()

fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

fastify.listen({
  port: 3333,
}).then(() => {
  console.log('HTTP Server Running!')
})
