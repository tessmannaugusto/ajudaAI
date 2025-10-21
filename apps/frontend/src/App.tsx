import './App.css'
import { Link, Route, Routes } from 'react-router-dom'
import Chat from './pages/Chat'
import Customers from './pages/Customers'

function App() {

  return (
    <div>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#eee', width: '100vw' }}>
        <Link to="/">Home</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/customers">Customers</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/customers" element={<Customers />} />
      </Routes>
    </div>
  )
}

export default App
