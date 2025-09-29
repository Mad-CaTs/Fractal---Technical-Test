import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MyOrders from './pages/MyOrders';
import AddEditOrder from './pages/AddEditOrder.js';
import Products from './pages/Products';
import './styles/App.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>          
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/add-order" element={<AddEditOrder />} />
          <Route path="/add-order/:id" element={<AddEditOrder />} />
          <Route path="/products" element={<Products />} />
          <Route path="/" element={<MyOrders />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );      
}

export default App;
