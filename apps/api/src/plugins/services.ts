import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { CustomerService } from '../services/customer.service';


declare module 'fastify' {
  interface FastifyInstance {
    customerService: CustomerService;
  }
}

async function servicesPlugin(fastify: FastifyInstance) {
  fastify.decorate('customerService', new CustomerService(fastify));
}

export default fp(servicesPlugin);