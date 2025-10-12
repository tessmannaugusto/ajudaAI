

import { openai } from '@ai-sdk/openai';
import { generateText, stepCountIs, tool } from 'ai';
import { FastifyInstance } from 'fastify'
import z from 'zod';

const getTools = () => {
  return {
    getCustomers: tool({
      description: 'get the names of customers in database',
      inputSchema: z.object({}),
      execute: async () => ({
        names: "augusto e tayná"
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
      execute: async () => {
        return `the customer name is X and he lives in Y`
      }
    })
  }
}

export async function aiRoutes(fastify: FastifyInstance) {
  fastify.post('/ask', async function (request, reply) {
    const { input } = request.body as { input: string }
    const result = await generateText({
      model: openai('gpt-4o'),
      maxOutputTokens: 512,
      tools: getTools(),
      toolChoice: 'auto',
      stopWhen: stepCountIs(3),
      prompt: `
Você é um assistente que pode usar ferramentas para buscar informações.
Responda sempre em linguagem natural e use os resultados das ferramentas para formular a resposta final.
Pergunta: ${input}
`,
    });

    console.log(JSON.stringify(result.steps[0].content, null, 2));
    console.log('Final Text:', result.text);
    console.log('Usage:', result.usage);


    reply.header('Content-Type', 'text/plain; charset=utf-8');
    return reply.send(result.text);
  });
}