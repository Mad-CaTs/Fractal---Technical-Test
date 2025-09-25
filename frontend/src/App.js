import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MyOrders from './pages/MyOrders';
import AddEditOrder from './pages/AddEditOrder.js';
import Products from './pages/Products';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/add-order" element={<AddEditOrder />} />
              <Route path="/add-order/:id" element={<AddEditOrder />} />
              <Route path="/products" element={<Products />} />
              <Route path="/" element={<MyOrders />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
