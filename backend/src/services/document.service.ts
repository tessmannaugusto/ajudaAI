import { FastifyInstance } from 'fastify';
import { generateEmbedding, generateEmbeddings } from '../utils/embedding';


export class DocumentService {
  private db: FastifyInstance['pg'];

  constructor(fastify: FastifyInstance) {
    this.db = fastify.pg;
  }

  async addDocument(
    content: string,
    metadata?: Record<string, any>
  ): Promise<{ id: number; content: string; metadata: any; created_at: string }> {
    const embedding = await generateEmbedding(content);

    const result = await this.db.query(`
      INSERT INTO documents (content, metadata, embedding)
      VALUES ($1, $2, $3::vector)
      RETURNING id, content, metadata, created_at
    `, [content, JSON.stringify(metadata || {}), JSON.stringify(embedding)]);

    return result.rows[0];
  }

  async addDocuments(
    content: string,
    metadata?: Record<string, any>
  ): Promise<Array<{ id: number; content: string; metadata: any; created_at: string }>> {
    const chunks = await generateEmbeddings(content);

    const results = await Promise.all(
      chunks.map(({ content, embedding }) =>
        this.db.query(`
          INSERT INTO documents (content, metadata, embedding)
          VALUES ($1, $2, $3::vector)
          RETURNING id, content, metadata, created_at
        `, [content, JSON.stringify(metadata || {}), JSON.stringify(embedding)])
      )
    );

    return results.flatMap((result: any) => result.rows);
  }

  async searchSimilarDocuments(
    query: string,
    limit: number,
    similarityThreshold: number
  ): Promise<Array<{ id: number; content: string; metadata: any; similarity: number }>> {
    const queryEmbedding = await generateEmbedding(query);

    const result = await this.db.query(`
    SELECT
      id,
      content,
      metadata,
      1 - (embedding <=> $1::vector) as similarity
    FROM documents
    WHERE 1 - (embedding <=> $1::vector) > $2
    ORDER BY embedding <=> $1::vector
    LIMIT $3
  `, [JSON.stringify(queryEmbedding), similarityThreshold, limit]);

  console.log("kb response: ",JSON.stringify(result))
    return result.rows;
  };
}