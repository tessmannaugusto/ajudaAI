import { FastifyInstance } from 'fastify'

// cada arquivo de rota é um plugin
export async function customersRoutes(fastify: FastifyInstance) {
  fastify.get('/users', async (request, reply) => {
    const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
    return users
  })

  fastify.post('/users', async (request, reply) => {
    const body = request.body as { name: string }
    const newUser = { id: Math.random(), name: body.name }
    reply.code(201)
    return newUser
  })
}