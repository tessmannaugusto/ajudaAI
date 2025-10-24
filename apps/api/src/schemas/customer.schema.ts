import z from "zod";

const customerSchema = z.object({
  name: z.string().min(5, 'Name cannot have less than 5 chars').max(100, 'Name cannot exceed 100 chars').describe('The name of the customer'),
  address: z.string().min(8, 'Address cannot have less then 5 chars').max(100, 'Address cannot exceed 200 chars').describe('The address of the customer'),
  email: z.email('Wrong email format').describe('The email of the customer'),
  phone: z.string().regex(/^\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}$/, "Phone number in wrong format"),
  city: z.string().min(5, 'City cannot have less than 5 chars').max(50, 'City cannot exceed 50 chars').describe('The city of the customer'),
  state: z.string().min(2, 'State should have exactly 2 chars').max(2, 'State should have exactly 2 chars').describe('The state of the customer'),
}).strict()

const getCustomerByIdSchema = z.object({
  id: z.uuid().describe('The id of the customer'),
}).strict()

export { customerSchema, getCustomerByIdSchema }
