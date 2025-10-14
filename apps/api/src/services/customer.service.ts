import { FastifyInstance } from 'fastify';

export interface Customer {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  city: string;
  state: string;
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