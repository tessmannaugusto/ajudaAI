

import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, generateText, stepCountIs, streamText, UIMessage } from 'ai';
import { FastifyInstance } from 'fastify'
import getTools from '../utils/tools';
import aiSchema from '../db/schemas/ai.schema';

export async function aiRoutes(fastify: FastifyInstance) {
  fastify.post('/ask', async function (request, reply) {
    const { input } = aiSchema.parse(request.body)
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      maxOutputTokens: 512,
      tools: getTools(fastify),
      toolChoice: 'auto',
      stopWhen: stepCountIs(3),
      system: 'Do not answer with more information then whats being asked',
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

  fastify.post('/chat', async function (request, reply) {
    const { messages }: {messages: UIMessage[] } = request.body as any;
    const result = streamText({
      model: openai('gpt-4o-mini'),
      maxOutputTokens: 512,
      tools: getTools(fastify),
      toolChoice: 'auto',
      stopWhen: stepCountIs(10),
      system: `Você é um assistente que pode usar ferramentas para buscar informações.
Responda sempre em linguagem natural e use os resultados das ferramentas para formular a resposta final.
Se você não encontrar as repostas nas tools, use a tool searchKnowledgeBase para tentar encontrar.`,
      messages: convertToModelMessages(messages),
      onStepFinish: ({ toolCalls, toolResults, finishReason, usage }) => {
      console.log('--- Step Finished ---');
      console.log('Tool Calls:', JSON.stringify(toolCalls, null, 2));
      console.log('Tool Results:', JSON.stringify(toolResults, null, 2));
      console.log('Finish Reason:', finishReason);
    }
    });
    return reply.send(result.toUIMessageStreamResponse());
  });
}