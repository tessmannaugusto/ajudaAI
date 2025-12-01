import { FastifyInstance } from 'fastify'
import { customerSchema } from '../db/schemas/customer.schema';
import { DocumentRequestSchema } from '../db/schemas/document.schema';


export async function documentRoutes(fastify: FastifyInstance) {
  fastify.post('/document', async (request, reply) => {
    try {
      const { content, metadata } = DocumentRequestSchema.parse(request.body)
      const row = await fastify.documentService.addDocument(content)
      reply.status(201).send({ id: row.id, created_at: row.created_at });
    } catch (err) {
      fastify.log.error(err);
      reply.status(500).send({ error: 'Failed to add document to documents vectordb' });
    }
  });
}