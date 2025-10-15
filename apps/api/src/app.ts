import Fastify from 'fastify'
import fastifyPostgres from 'fastify-postgres';
import { customersRoutes } from './routes/customer.routes'
import { aiRoutes } from './routes/ai.routes'
import services from './plugins/services';

export async function buildApp() {
  const fastify = Fastify({ logger: true })

  await fastify.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_CONNECTION_STRING,
  });

  await fastify.register(services)
  await fastify.register(customersRoutes, { prefix: '/api' }),
  await fastify.register(aiRoutes, { prefix: '/ai' })

  return fastify
}