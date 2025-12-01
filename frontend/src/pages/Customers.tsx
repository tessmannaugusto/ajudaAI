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

type ViewType = 'all' | 'add' | 'edit';

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 1
  });
  const [currentView, setCurrentView] = useState<ViewType>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      setLoading(true);
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

  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      address: customer.address,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      state: customer.state
    });
    setCurrentView('edit');
  };

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setFormData({
      name: '',
      address: '',
      email: '',
      phone: '',
      city: '',
      state: ''
    });
    setCurrentView('add');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (currentView === 'add') {
        const res = await fetch("http://localhost:3333/api/customers", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (res.ok) {
          alert('Cliente adicionado com sucesso!');
          await fetchCustomers();
          setCurrentView('all');
        }
      } else if (currentView === 'edit' && selectedCustomer) {
        const res = await fetch(`http://localhost:3333/api/customers/${selectedCustomer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (res.ok) {
          alert('Cliente atualizado com sucesso!');
          await fetchCustomers();
          setCurrentView('all');
        }
      }
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      alert('Erro ao salvar cliente');
    }
  };

  const renderContent = () => {
    if (loading && currentView === 'all') {
      return <p>Carregando...</p>;
    }

    switch (currentView) {
      case 'all':
        return (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Todos os Clientes</h2>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Nome</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Cidade</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{c.id}</td>
                    <td style={{ padding: '12px' }}>{c.name}</td>
                    <td style={{ padding: '12px' }}>{c.email}</td>
                    <td style={{ padding: '12px' }}>{c.city}</td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => handleEditClick(c)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#2563eb',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '5px' }}>
              <p>Página atual: {pagination.page}</p>
              <p>Total de registros: {pagination.totalItems}</p>
              <p>Total de páginas: {pagination.totalPages}</p>
              <p>Registros por página: {pagination.pageSize}</p>
            </div>
          </div>
        );

      case 'add':
      case 'edit':
        return (
          <div>
            <h2 style={{ marginBottom: '20px' }}>
              {currentView === 'add' ? 'Adicionar Novo Cliente' : 'Editar Cliente'}
            </h2>
            <form onSubmit={handleFormSubmit} style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              maxWidth: '600px'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Nome:
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Email:
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Telefone:
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Endereço:
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Cidade:
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Estado:
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {currentView === 'add' ? 'Adicionar' : 'Atualizar'}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView('all')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '20px',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '30px', fontSize: '20px' }}>Clientes</h2>

        <nav>
          <button
            onClick={() => setCurrentView('all')}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '10px',
              backgroundColor: currentView === 'all' ? '#3b82f6' : 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
          >
            Ver Todos os Clientes
          </button>

          <button
            onClick={handleAddNew}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '10px',
              backgroundColor: currentView === 'add' ? '#3b82f6' : 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
          >
            Adicionar Novo Cliente
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '30px'
      }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default Customers
