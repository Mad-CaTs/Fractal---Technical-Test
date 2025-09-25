import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
  
    // Estados para formularios
    const [formData, setFormData] = useState({
        name: '',
        unitPrice: 0
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);

    // Cargar productos al iniciar componente
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
        setLoading(true);
        const productsData = await productService.getAll();
        setProducts(productsData);
        } catch (err) {
        setError('Error al cargar productos');
        } finally {
        setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', unitPrice: 0 });
    };

    // Manejar creación
    const handleAddClick = () => {
        resetForm();
        setShowAddModal(true);
    };

    const handleCreateProduct = async () => {
        try {
        if (!formData.name.trim() || formData.unitPrice <= 0) {
            setError('Nombre y precio son requeridos');
            return;
        }

        await productService.create({
            name: formData.name.trim(),
            unitPrice: parseFloat(formData.unitPrice)
        });

        await loadProducts();
        setShowAddModal(false);
        resetForm();
        setError(null);
        } catch (err) {
        setError('Error al crear producto');
        }
    };

    // Manejar edición
    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormData({
        name: product.name,
        unitPrice: product.unitPrice,
        isActive: product.isActive
        });
        setShowEditModal(true);
    };

    const handleUpdateProduct = async () => {
        try {
        if (!formData.name.trim() || formData.unitPrice <= 0) {
            setError('Nombre y precio son requeridos');
            return;
        }

        await productService.update(editingProduct.id, {
            name: formData.name.trim(),
            unitPrice: parseFloat(formData.unitPrice),
            isActive: formData.isActive
        });

        await loadProducts();
        setShowEditModal(false);
        setEditingProduct(null);
        resetForm();
        setError(null);
        } catch (err) {
        setError('Error al actualizar producto');
        }
    };

    // Manejar eliminación
    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
        await productService.delete(productToDelete.id);
        await loadProducts();
        setShowDeleteModal(false);
        setProductToDelete(null);
        } catch (err) {
        setError('Error al eliminar producto');
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    if (loading) return <div className="text-center py-8">Cargando productos...</div>;

    return (
    <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
            Add New Product
            </button>
        </div>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            </div>
        )}

        {/* Tabla de productos */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Options
                </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No hay productos disponibles
                    </td>
                </tr>
                ) : (
                products.map((product) => (
                    <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${product.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                        product.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                        onClick={() => handleEditClick(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                        Edit
                        </button>
                        <button
                        onClick={() => handleDeleteClick(product)}
                        className="text-red-600 hover:text-red-900"
                        >
                        Delete
                        </button>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>

        {/* Modal para agregar producto */}
        {showAddModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Product</h3>
                
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product name"
                />
                </div>

                <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price
                </label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                />
                </div>

                <div className="flex justify-end space-x-3">
                <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                    Cancel
                </button>
                <button
                    onClick={handleCreateProduct}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Create Product
                </button>
                </div>
            </div>
            </div>
        )}

        {/* Modal para editar producto */}
        {showEditModal && editingProduct && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Product: {editingProduct.name}
                </h3>
                
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>

                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price
                </label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>

                <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                </label>
                <select
                    value={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                </select>
                </div>

                <div className="flex justify-end space-x-3">
                <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                    Cancel
                </button>
                <button
                    onClick={handleUpdateProduct}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Update Product
                </button>
                </div>
            </div>
            </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && productToDelete && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                Delete Product
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete "{productToDelete.name}"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                <button
                    onClick={handleDeleteCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                    Cancel
                </button>
                <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                    Delete
                </button>
                </div>
            </div>
            </div>
        )}
    </div>
  );
};

export default Products;