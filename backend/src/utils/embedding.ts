import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { embed, embedMany } from 'ai';
import { openai } from "@ai-sdk/openai";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
});

const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = await splitter.splitText(value);
  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

const generateEmbedding = async (value: string): Promise<number[]> => {
  const valueWithoutNewLine = value.replace(/\n/g, ' ');
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: valueWithoutNewLine,
  });
  return embedding;
};



export { generateEmbeddings, generateEmbedding }