import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { customerSchema, getCustomerByIdSchema } from '../db/schemas/customer.schema';


export async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/', (req: FastifyRequest, reply: FastifyReply) => {
    reply.send({ message: '/ route hit' })
  })
  fastify.post('/register', () => {})
  fastify.post('/login', () => {})
  fastify.delete('/logout', () => {})
  fastify.log.info('user routes registered')
}