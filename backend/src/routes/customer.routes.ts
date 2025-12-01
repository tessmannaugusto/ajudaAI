import { FastifyInstance } from 'fastify'
import { customerSchema, getCustomerByIdSchema } from '../db/schemas/customer.schema';

const PAGE_SIZE = 20

export async function customersRoutes(fastify: FastifyInstance) {
  fastify.get('/customers', async (request, reply) => {
    try {
      const { page } = request.query as { page: string };
      const pageNumber = Math.max(1, parseInt(page || '1', 10) || 1)
      const offset = (pageNumber - 1) * PAGE_SIZE;
      const { rows } = await fastify.pg.query('SELECT * FROM customers LIMIT $1 OFFSET $2', [PAGE_SIZE, offset]);
      const { rows: countRows } = await fastify.pg.query('SELECT COUNT(*) AS total FROM customers')
      const totalItems = parseInt(countRows[0].total, 10)
      const totalPages = Math.ceil(totalItems / PAGE_SIZE)
      return {
        data: rows,
        pagination: {
          page: pageNumber,
          pageSize: PAGE_SIZE,
          totalItems,
          totalPages
        }
      };
    } catch (err) {
      fastify.log.error(err);
      reply.status(500).send({ error: 'Failed to fetch customers' });
    }
  });

  fastify.get('/customers/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { rows } = await fastify.pg.query(
        'SELECT * FROM customers WHERE id = $1',
        [id]
      )

      const customer = rows[0]
      if (!customer) {
        return reply.status(404).send({ error: 'Customer not found' })
      }

      return customer
    } catch (err) {
      fastify.log.error(err);
      reply.status(500).send({ error: 'Failed to fetch customer' });
    }
  });

  fastify.post('/customers', async (request, reply) => {
    try {
      const { name, email, phone, address, city, state } = customerSchema.parse(request.body)
      console.log({ name, email, phone, address, city, state })
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