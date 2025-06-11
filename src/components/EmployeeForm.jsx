import { useState } from 'react';
import { motion } from 'framer-motion';

const EmployeeForm = ({ employees, setEmployees, token }) => {
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '' });
  const [error, setError] = useState('');

  const getLevel = (points) => {
    if (points >= 100) return 'Mestre';
    if (points >= 50) return 'Intermediário';
    return 'Iniciante';
  };

  const addEmployee = () => {
    if (!newEmployee.name || !newEmployee.role) {
      setError('Preencha todos os campos.');
      return;
    }
    fetch('http://localhost:5000/api/employees', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ...newEmployee, points: 0 })
    })
      .then(res => res.json())
      .then(data => {
        setEmployees([...employees, data]);
        setNewEmployee({ name: '', role: '' });
        setError('');
      })
      .catch(err => setError('Erro ao cadastrar funcionário.'));
  };

  const updateEmployeePoints = (id, points) => {
    fetch(`http://localhost:5000/api/employees/${id}/points`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ points })
    })
      .then(res => res.json())
      .then(data => {
        setEmployees(employees.map(emp => emp.id === id ? { ...emp, points: emp.points + points } : emp));
      })
      .catch(err => setError('Erro ao atualizar pontos.'));
  };

  return (
    <motion.div 
      initial={{ x: -100 }} 
      animate={{ x: 0 }} 
      className="bg-white dark:bg-gray-800 p-6 rounded shadow"
    >
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Cadastro de Funcionários</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Nome"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          placeholder="Cargo"
          value={newEmployee.role}
          onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <button onClick={addEmployee} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Adicionar
        </button>
      </div>
      <ul className="space-y-2">
        {employees.map(emp => (
          <li key={emp.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded flex justify-between">
            <span className="dark:text-white">{emp.name} ({emp.role}) - {getLevel(emp.points)} ({emp.points} pts)</span>
            <button
              onClick={() => updateEmployeePoints(emp.id, 10)}
              className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
            >
              +10 Pontos
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default EmployeeForm;
