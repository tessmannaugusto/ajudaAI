import Fastify from 'fastify'
import { customersRoutes } from './routes/customers'

export async function buildApp() {
  const fastify = Fastify({ logger: false })

  await fastify.register(customersRoutes, { prefix: '/api' })

  return fastify
}