import z from "zod";

export const DocumentRequestSchema = z.object({
  content: z.string().min(1),
  metadata: z.record(z.string(), z.any()).nullish(),
});

const DocumentBaseSchema = z.object({
  content: z.string().min(1),
  metadata: z.record(z.string(), z.any()).nullish(),
  embedding: z.array(z.number()).length(1024),
});

export const DocumentSchema = DocumentBaseSchema.extend({
  id: z.number().int().positive(),
  created_at: z.coerce.date(),
});

export const DocumentInsertSchema = DocumentBaseSchema;
export type DocumentInsert = z.infer<typeof DocumentInsertSchema>;

export type Document = z.infer<typeof DocumentSchema>;

export const DocumentUpdateSchema = DocumentBaseSchema.partial();
export type DocumentUpdate = z.infer<typeof DocumentUpdateSchema>;