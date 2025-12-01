import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { CustomerService } from '../services/customer.service';
import { DocumentService } from '../services/document.service';


declare module 'fastify' {
  interface FastifyInstance {
    customerService: CustomerService;
    documentService: DocumentService;
  }
}

async function servicesPlugin(fastify: FastifyInstance) {
  fastify.decorate('customerService', new CustomerService(fastify));
  fastify.decorate('documentService', new DocumentService(fastify));
}

export default fp(servicesPlugin);