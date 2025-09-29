import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { productService } from '../services/productService';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', unitPrice: 0 });
    const [editingProduct, setEditingProduct] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const productsData = await productService.getAll();
            setProducts(productsData);
        } catch (err) {
            toast.error('Error loading products');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', unitPrice: 0 });
    };

    const handleAddClick = () => {
        resetForm();
        setShowAddModal(true);
    };

    const handleCreateProduct = async () => {
        try {
            if (!formData.name.trim() || formData.unitPrice <= 0) {
                toast.warning('Name and price are required');
                return;
            }

            await productService.create({
                name: formData.name.trim(),
                unitPrice: parseFloat(formData.unitPrice)
            });

            await loadProducts();
            setShowAddModal(false);
            resetForm();
            toast.success('Product created successfully');
        } catch (err) {
            toast.error('Error creating product');
        }
    };

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
                toast.warning('Name and price are required');
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
            toast.success('Product updated successfully');
        } catch (err) {
            toast.error('Error updating product');
        }
    };

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
            toast.success('Product inactivated successfully');
        } catch (err) {
            toast.error('Error inactivating product');
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    if (loading) return (
        <div className="text-center py-8">
            <div className="loading"></div>
            <p style={{ color: '#2C3E50', marginTop: '1rem' }}>Loading products...</p>
        </div>
    );

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Products</h1>
                <button onClick={handleAddClick} className="btn btn-primary">
                    + Add New Product
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Unit Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center text-gray-500">
                                    No products available
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td className="font-semibold">{product.name}</td>
                                    <td className="font-semibold">${product.unitPrice.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${product.isActive ? 'badge-active' : 'badge-inactive'}`}>
                                            {product.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => handleEditClick(product)}
                                                className="action-btn action-btn-edit"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(product)}
                                                className="action-btn action-btn-delete"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de agregacion */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Product</h3>
                        
                        <div className="form-group">
                            <label className="form-label">Product Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="form-input"
                                placeholder="Enter product name"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Unit Price</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.unitPrice}
                                onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                                className="form-input"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                                Cancel
                            </button>
                            <button onClick={handleCreateProduct} className="btn btn-success">
                                Create Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de edicion */}
            {showEditModal && editingProduct && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Edit Product: {editingProduct.name}
                        </h3>
                        
                        <div className="form-group">
                            <label className="form-label">Product Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Unit Price</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.unitPrice}
                                onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                value={formData.isActive}
                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                                className="form-select"
                            >
                                <option value={true}>Active</option>
                                <option value={false}>Inactive</option>
                            </select>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setShowEditModal(false)} className="btn btn-secondary">
                                Cancel
                            </button>
                            <button onClick={handleUpdateProduct} className="btn btn-primary">
                                Update Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de eliminacion */}
            {showDeleteModal && productToDelete && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Product</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Are you sure you want to delete "{productToDelete.name}"?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={handleDeleteCancel} className="btn btn-secondary">
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm} className="btn btn-danger">
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