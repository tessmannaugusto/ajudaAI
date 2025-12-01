import Fastify from 'fastify'
import fastifyPostgres from 'fastify-postgres';
import cors from '@fastify/cors';
import { customersRoutes } from './routes/customer.routes'
import { aiRoutes } from './routes/ai.routes'
import services from './plugins/services';
import { userRoutes } from './routes/user.routes';
import { documentRoutes } from './routes/document.routes';

export async function buildApp() {
  const fastify = Fastify({ logger: true })

  await fastify.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_CONNECTION_STRING,
  });

  await fastify.register(cors, { origin: true }) // ambiente de dev
  await fastify.register(services)
  await fastify.register(customersRoutes, { prefix: '/api' }),
  await fastify.register(aiRoutes, { prefix: '/ai' })
  await fastify.register(documentRoutes, { prefix: '/document' })
  await fastify.register(userRoutes, { prefix: '/user' })
  
  return fastify
}