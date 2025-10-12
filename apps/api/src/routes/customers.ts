import { FastifyInstance } from 'fastify'

export async function customersRoutes(fastify: FastifyInstance) {
  fastify.get('/customers', async (request, reply) => {
    try {
      const { rows } = await fastify.pg.query('SELECT * FROM customers');
      reply.send(rows);
    } catch (err) {
      fastify.log.error(err);
      reply.status(500).send({ error: 'Failed to fetch customers' });
    }
  });

  fastify.post('/customers', async (request, reply) => {
    const { name, email, phone, address, city, state } = request.body as { name: string, email: string, phone: string, address: string, city: string, state: string };
    try {
      const { rows } = await fastify.pg.query(
        `INSERT INTO customers(name, email, phone, address, city, state) 
   VALUES($1, $2, $3, $4, $5, $6) 
   RETURNING id, name, email`,
        [name, email, phone, address, city, state]
      );
      reply.status(201).send({ id: rows[0].id, name: rows[0].name });
    } catch (err) {
      fastify.log.error(err);
      reply.status(500).send({ error: 'Failed to create customer' });
    }
  });
}