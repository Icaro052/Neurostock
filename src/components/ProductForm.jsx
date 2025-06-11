import { useState } from 'react';
import { motion } from 'framer-motion';

const ProductForm = ({ products, setProducts, setPredictions, predictStock, token }) => {
  const [newProduct, setNewProduct] = useState({ name: '', quantity: 0, category: '', price: 0 });
  const [error, setError] = useState('');

  const addProduct = () => {
    if (!newProduct.name || newProduct.quantity <= 0 || !newProduct.category || newProduct.price <= 0) {
      setError('Preencha todos os campos corretamente.');
      return;
    }
    fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newProduct)
    })
      .then(res => res.json())
      .then(data => {
        setProducts([...products, data]);
        setPredictions(prev => [...prev, predictStock(data)]);
        setNewProduct({ name: '', quantity: 0, category: '', price: 0 });
        setError('');
      })
      .catch(err => setError('Erro ao cadastrar produto.'));
  };

  return (
    <motion.div 
      initial={{ x: 100 }} 
      animate={{ x: 0 }} 
      className="bg-white dark:bg-gray-800 p-6 rounded shadow"
    >
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Cadastro de Produtos</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Nome do Produto"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          placeholder="Categoria"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="number"
          placeholder="Preço"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <button onClick={addProduct} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Adicionar
        </button>
      </div>
      <ul className="space-y-2">
        {products.map((prod, index) => (
          <li key={prod.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <span className="dark:text-white">{prod.name} - Qtd: {prod.quantity} - Cat: {prod.category} - R${prod.price.toFixed(2)}</span>
            <p className="text-sm dark:text-gray-300">{predictions[index]}</p>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ProductForm;
