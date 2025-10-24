import { useEffect, useState } from "react";

interface Customer {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  city: string;
  state: string;
}

interface Pagination {
  page: number,
  pageSize: number,
  totalItems: number,
  totalPages: number
}

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 1
  })

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("http://localhost:3333/api/customers?page=1");
        const data = await res.json();
        setCustomers(data.data);
        setPagination(data.pagination);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

   if (loading) return <p>Carregando...</p>;

    return (
      <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Cidade</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <p>Current page: {pagination.page}</p>
        <p>Total registers: {pagination.totalItems}</p>
        <p>Total pages: {pagination.totalPages}</p>
        <p>Page size: {pagination.pageSize}</p>
        
      </div>

      </div>
    
  );
}

export default Customers
