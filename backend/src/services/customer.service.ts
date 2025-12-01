import { FastifyInstance } from 'fastify';
import { sanitizeField } from '../utils/sanitize';

export interface Customer {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  city: string;
  state: string;
}
export interface EditCustomerInput {
  id: string;
  field: string;
  value: string;
}

export class CustomerService {
  private db: FastifyInstance['pg'];

  constructor(fastify: FastifyInstance) {
    this.db = fastify.pg;
  }

  async getAll(): Promise<Customer[]> {
    const { rows } = await this.db.query('SELECT * FROM customers');
    return rows;
  }

  async editCustomer(editCustomerInput: EditCustomerInput) {
  const allowedFields = ['name', 'email', 'phone', 'address', 'city', 'state'];
  if (!allowedFields.includes(editCustomerInput.field) || !sanitizeField(editCustomerInput.field) || !sanitizeField(editCustomerInput.value)) {
    throw new Error('Campo inválido');
  }
  console.log(JSON.stringify(editCustomerInput))
  const result = await this.db.query(
    `UPDATE customers
     SET ${editCustomerInput.field} = $1
     WHERE id = $2
     RETURNING id, name, email, phone, address, city, state`,
    [editCustomerInput.value, editCustomerInput.id]
  );

  return result.rows[0];
}

  async addCustomer(customer: Customer): Promise<string> {
    await this.db.query(
      `INSERT INTO customers(name, email, phone, address, city, state) 
   VALUES($1, $2, $3, $4, $5, $6) 
   RETURNING id, name, email`,
      [customer.name, customer.email, customer.phone, customer.address, customer.city, customer.state]
    );
    return `O cliente ${customer.name} foi adicionado com sucesso!`
  }
}