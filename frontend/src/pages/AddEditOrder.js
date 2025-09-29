import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';

const AddEditOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [order, setOrder] = useState({
        orderDate: new Date().toISOString().split('T')[0],
        totalProducts: 0,
        finalPrice: 0,
        orderDetails: []
    });

    const [availableProducts, setAvailableProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editQuantity, setEditQuantity] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        loadProducts();
        if (isEdit) {
            loadOrder();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isEdit]);

    useEffect(() => {
        const checkEditability = async () => {
            if (isEdit && id) {
                try {
                    const canEdit = await orderService.canEdit(id);
                    if (!canEdit) {
                        toast.warning('This order is completed and cannot be modified');
                    }
                } catch (err) {
                    console.error('Error checking editability:', err);
                }
            }
        };
        checkEditability();
    }, [isEdit, id]);

    const loadProducts = async () => {
        try {
            const products = await productService.getActive();
            setAvailableProducts(products);
        } catch (err) {
            toast.error('Error loading products');
        }
    };

    const loadOrder = async () => {
        try {
            setLoading(true);
            const orderData = await orderService.getById(id);
            setOrder({
                ...orderData,
                orderDate: new Date(orderData.orderDate).toISOString().split('T')[0]
            });
        } catch (err) {
            toast.error('Error loading order');
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = () => {
        if (!selectedProductId || quantity <= 0) {
            toast.warning('Please select a product and quantity');
            return;
        }

        const product = availableProducts.find(p => p.id === parseInt(selectedProductId));
        if (!product) return;

        const existingIndex = order.orderDetails.findIndex(od => od.productId === product.id);
        
        let newOrderDetails;
        if (existingIndex >= 0) {
            newOrderDetails = order.orderDetails.map((od, index) => 
                index === existingIndex 
                    ? { 
                        ...od, 
                        quantity: od.quantity + quantity,
                        totalPrice: (od.quantity + quantity) * od.unitPrice
                    }
                    : od
            );
            toast.info('Product quantity updated');
        } else {
            const newDetail = {
                productId: product.id,
                productName: product.name,
                quantity: quantity,
                unitPrice: product.unitPrice,
                totalPrice: quantity * product.unitPrice
            };
            newOrderDetails = [...order.orderDetails, newDetail];
            toast.success('Product added to order');
        }

        setOrder(prev => ({
            ...prev,
            orderDetails: newOrderDetails
        }));

        setSelectedProductId('');
        setQuantity(1);
        setShowAddProductModal(false);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setEditQuantity(product.quantity);
        setShowEditProductModal(true);
    };

    const handleUpdateProduct = () => {
        if (editQuantity <= 0) {
            toast.warning('Quantity must be greater than 0');
            return;
        }

        const newOrderDetails = order.orderDetails.map(od => 
            od.productId === editingProduct.productId
                ? { 
                    ...od, 
                    quantity: editQuantity, 
                    totalPrice: editQuantity * od.unitPrice 
                }
                : od
        );

        setOrder(prev => ({
            ...prev,
            orderDetails: newOrderDetails
        }));

        setShowEditProductModal(false);
        setEditingProduct(null);
        setEditQuantity(1);
        toast.success('Product updated');
    };

    const handleDeleteProductClick = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const handleDeleteProductConfirm = () => {
        const newOrderDetails = order.orderDetails.filter(
            od => od.productId !== productToDelete.productId
        );

        setOrder(prev => ({
            ...prev,
            orderDetails: newOrderDetails
        }));

        setShowDeleteModal(false);
        setProductToDelete(null);
        toast.success('Product removed from order');
    };

    const handleSaveOrder = async () => {
        try {
            if (order.orderDetails.length === 0) {
                toast.warning('Please add at least one product');
                return;
            }

            if (isEdit) {
                const canEdit = await orderService.canEdit(id);
                if (!canEdit) {
                    toast.error('This order is completed and cannot be modified');
                    return;
                }
            }

            setLoading(true);

            const orderData = {
                orderDetails: order.orderDetails.map(od => ({
                    productId: od.productId,
                    quantity: od.quantity
                }))
            };

            if (isEdit) {
                await orderService.update(id, {
                    ...orderData,
                    orderNumber: order.orderNumber,
                    status: order.status || 0
                });
                toast.success('Order updated successfully');
            } else {
                await orderService.create(orderData);
                toast.success('Order created successfully');
            }

            navigate('/my-orders');
        } catch (err) {
            toast.error('Error saving order');
        } finally {
            setLoading(false);
        }
    };

    const totalProducts = order.orderDetails.reduce((sum, od) => sum + od.quantity, 0);
    const finalPrice = order.orderDetails.reduce((sum, od) => sum + od.totalPrice, 0);

    if (loading) return (
    <div className="text-center py-8">
        <div className="loading"></div>
        <p style={{ color: '#2C3E50', marginTop: '1rem' }}>Loading...</p>
    </div>
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="page-title">
                    {isEdit ? 'Edit Order' : 'Add Order'}
                </h1>
            </div>

            {/* Formulario cabeza */}
            <div className="card mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            value={order.orderDate}
                            disabled
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label"># Products</label>
                        <input
                            type="number"
                            value={totalProducts}
                            disabled
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Final Price</label>
                        <input
                            type="text"
                            value={`$${finalPrice.toFixed(2)}`}
                            disabled
                            className="form-input"
                        />
                    </div>
                </div>
            </div>

            {/* Boton para agregar */}
            <div className="mb-6">
                <button
                    onClick={() => setShowAddProductModal(true)}
                    className="btn btn-success"
                >
                    + Add Product to Order
                </button>
            </div>

            {/* Tabla Productos */}
            <div className="table-container mb-6">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    <h3 className="text-lg font-bold text-gray-900">Products in Order</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Unit Price</th>
                            <th>Qty</th>
                            <th>Total Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.orderDetails.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500">
                                    No products added to this order
                                </td>
                            </tr>
                        ) : (
                            order.orderDetails.map((detail, index) => (
                                <tr key={index}>
                                    <td>{detail.productId}</td>
                                    <td className="font-semibold">{detail.productName}</td>
                                    <td>${detail.unitPrice.toFixed(2)}</td>
                                    <td className="font-semibold">{detail.quantity}</td>
                                    <td className="font-semibold">${detail.totalPrice.toFixed(2)}</td>
                                    <td>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => handleEditProduct(detail)}
                                                className="action-btn action-btn-edit"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProductClick(detail)}
                                                className="action-btn action-btn-delete"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Botones */}
            <div className="flex justify-between">
                <button
                    onClick={() => navigate('/my-orders')}
                    className="btn btn-secondary"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSaveOrder}
                    disabled={loading}
                    className="btn btn-primary"
                >
                    {loading ? 'Saving...' : (isEdit ? 'Update Order' : 'Create Order')}
                </button>
            </div>

            {/* Modal de agregacion */}
            {showAddProductModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Add Product</h3>
                        
                        <div className="form-group">
                            <label className="form-label">Select Product</label>
                            <select
                                value={selectedProductId}
                                onChange={(e) => setSelectedProductId(e.target.value)}
                                className="form-select"
                            >
                                <option value="">Choose a product...</option>
                                {availableProducts.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} - ${product.unitPrice.toFixed(2)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className="form-input"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowAddProductModal(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button onClick={handleAddProduct} className="btn btn-success">
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de edicion */}
            {showEditProductModal && editingProduct && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Edit Product: {editingProduct.productName}
                        </h3>
                        
                        <div className="form-group">
                            <label className="form-label">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(parseInt(e.target.value) || 1)}
                                className="form-input"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowEditProductModal(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button onClick={handleUpdateProduct} className="btn btn-primary">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmacion de eliminacion */}
            {showDeleteModal && productToDelete && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Remove Product</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Are you sure you want to remove "{productToDelete.productName}" from this order?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button onClick={handleDeleteProductConfirm} className="btn btn-danger">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddEditOrder;