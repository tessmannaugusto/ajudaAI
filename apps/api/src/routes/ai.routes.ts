

import { openai } from '@ai-sdk/openai';
import { generateText, stepCountIs } from 'ai';
import { FastifyInstance } from 'fastify'
import getTools from '../utils/tools';
import aiSchema from '../schemas/ai.schema';

export async function aiRoutes(fastify: FastifyInstance) {
  fastify.post('/ask', async function (request, reply) {
    const { input } = aiSchema.parse(request.body)
    const result = await generateText({
      model: openai('gpt-4o'),
      maxOutputTokens: 512,
      tools: getTools(fastify),
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