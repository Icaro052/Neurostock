import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Dashboard = ({ employees, products, predictions }) => {
  const stockChartRef = useRef(null);
  const employeeChartRef = useRef(null);

  useEffect(() => {
    // Gráfico de estoque
    if (stockChartRef.current) {
      const stockCtx = stockChartRef.current.getContext('2d');
      new Chart(stockCtx, {
        type: 'bar',
        data: {
          labels: products.map(p => p.name),
          datasets: [{
            label: 'Quantidade em Estoque',
            data: products.map(p => p.quantity),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
          }]
        },
        options: { scales: { y: { beginAtZero: true } } }
      });
    }

    // Gráfico de pontos dos funcionários
    if (employeeChartRef.current) {
      const employeeCtx = employeeChartRef.current.getContext('2d');
      new Chart(employeeCtx, {
        type: 'doughnut',
        data: {
          labels: employees.map(e => e.name),
          datasets: [{
            label: 'Pontos',
            data: employees.map(e => e.points),
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
          }]
        }
      });
    }
  }, [products, employees]);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2 dark:text-white">Estoque</h3>
          <canvas ref={stockChartRef}></canvas>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2 dark:text-white">Desempenho dos Funcionários</h3>
          <canvas ref={employeeChartRef}></canvas>
        </div>
      </div>
      <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-lg font-medium mb-2 dark:text-white">Previsões de Estoque</h3>
        {predictions.length > 0 ? (
          predictions.map((pred, index) => (
            <p key={index} className="text-sm dark:text-gray-300">{pred}</p>
          ))
        ) : (
          <p className="text-sm dark:text-gray-300">Nenhuma previsão disponível.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
