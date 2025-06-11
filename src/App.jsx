import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import EmployeeForm from './components/EmployeeForm';
import ProductForm from './components/ProductForm';
import Dashboard from './components/Dashboard';
import Home from './components/Home';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [token, setToken] = useState(null);

  // Login simulado
  useEffect(() => {
    fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    })
      .then(res => res.json())
      .then(data => setToken(data.token))
      .catch(err => console.error('Erro ao autenticar:', err));
  }, []);

  // Carregar dados
  useEffect(() => {
    if (token) {
      fetch('http://localhost:5000/api/employees', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setEmployees(data))
        .catch(err => console.error('Erro ao carregar funcionários:', err));

      fetch('http://localhost:5000/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setProducts(data);
          setPredictions(data.map(predictStock));
        })
        .catch(err => console.error('Erro ao carregar produtos:', err));
    }
  }, [token]);

  // Previsão de estoque com média móvel simulada
  const predictStock = (product) => {
    const historicalSales = [100, 120, 80, 90, 110].slice(-5);
    const movingAverage = historicalSales.reduce((a, b) => a + b, 0) / historicalSales.length;
    const predictedDemand = movingAverage * 1.15;
    const reorderQuantity = Math.ceil(predictedDemand - product.quantity);
    return predictedDemand > product.quantity 
      ? `Reabastecer ${product.name}: Pedir ${reorderQuantity} unidades!`
      : `Estoque de ${product.name} está adequado.`;
  };

  return (
    <BrowserRouter>
      <div className={`${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'} min-h-screen p-6 transition-colors duration-300`}>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="max-w-7xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold dark:text-white">Neurostock - Gestão Inteligente</h1>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded transition-colors"
            >
              {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
            </button>
          </div>
          <nav className="mb-6 flex gap-4">
            <Link to="/" className="text-blue-600 dark:text-blue-300 hover:underline">Início</Link>
            <Link to="/dashboard" className="text-blue-600 dark:text-blue-300 hover:underline">Dashboard</Link>
            <Link to="/product" className="text-blue-600 dark:text-blue-300 hover:underline">Produtos</Link>
            <Link to="/employee" className="text-blue-600 dark:text-blue-300 hover:underline">Funcionários</Link>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard employees={employees} products={products} predictions={predictions} />} />
            <Route path="/product" element={<ProductForm />} />
            <Route path="/employee" element={<EmployeeForm />} />
            <Route path="*" element={<h2 className="text-red-500">Página não encontrada</h2>} />
          </Routes>
        </motion.div>
      </div>
    </BrowserRouter>
  );
};

export default App;