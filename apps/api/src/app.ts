import Fastify from 'fastify'
import fastifyPostgres from 'fastify-postgres';
import { customersRoutes } from './routes/customers'

export async function buildApp() {
  const fastify = Fastify({ logger: true })

  await fastify.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_CONNECTION_STRING,
  });

  await fastify.register(customersRoutes, { prefix: '/api' })

  return fastify
}