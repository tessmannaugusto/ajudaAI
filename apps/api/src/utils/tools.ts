import { tool } from "ai"
import { FastifyInstance } from "fastify"
import z from "zod"

const getTools = (fastify: FastifyInstance) => {
  return {
    getCustomers: tool({
      description: 'get the names of customers in database',
      inputSchema: z.object({}),
      execute: async () => ({
        customers: await fastify.customerService.getAll()
      })
    }),
    addCustomer: tool({
      description: 'add a new customer to the database',
      inputSchema: z.object({
        name: z.string().describe('The name of the customer'),
        address: z.string().describe('The address of the customer'),
        email: z.string().describe('The email of the customer'),
        phone: z.string().describe('The phone of the customer'),
        city: z.string().describe('The city of the customer'),
        state: z.string().describe('The state of the customer'),
      }),
      execute: async (input: any) => {
        return await fastify.customerService.addCustomer(input)
      }
    })
  }
}

export default getTools