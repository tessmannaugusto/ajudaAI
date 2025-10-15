import z from "zod";

const aiSchema = z.object({
  input: z.string().min(2).max(100)
}).strict()

export default aiSchema