import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../services/orderService';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [orderToChangeStatus, setOrderToChangeStatus] = useState(null);
    const [newStatus, setNewStatus] = useState(0);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const ordersData = await orderService.getAll();
            setOrders(ordersData);
        } catch (error) {
            toast.error("Error loading orders");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (order) => {
        setOrderToDelete(order);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await orderService.delete(orderToDelete.id);
            await loadOrders();
            setShowDeleteModal(false);
            setOrderToDelete(null);
            toast.success("Order deleted successfully");
        } catch (error) {
            setShowDeleteModal(false);
            setOrderToDelete(null);

            if(error.message === 'Cannot delete completed order') {
                toast.error("Cannot delete completed order");
                return;
            } else {
                toast.error("Error deleting order");
            }
            console.error(error);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setOrderToDelete(null);
    };

    const handleChangeStatusClick = (order) => {
        setOrderToChangeStatus(order);
        setNewStatus(order.status);
        setShowStatusModal(true);
    };

    const handleChangeStatusConfirm = async () => {
        try {
            await orderService.updateStatus(orderToChangeStatus.id, newStatus);
            await loadOrders();
            setShowStatusModal(false);
            setOrderToChangeStatus(null);
            toast.success("Order status updated successfully");
        } catch (err) {
            toast.error("Error updating order status");
            console.error(err);
        }
    };

    const handleChangeStatusCancel = () => {
        setShowStatusModal(false);
        setOrderToChangeStatus(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            0: { text: 'Pending', class: 'badge-pending' },
            1: { text: 'In Progress', class: 'badge-progress' },
            2: { text: 'Completed', class: 'badge-completed' },
        };
        const config = statusConfig[status] || { text: 'Unknown', class: 'badge' };
        return <span className={`badge ${config.class}`}>{config.text}</span>;
    };


    if (loading) return (
        <div className="text-center py-8">
            <div className="loading"></div>
            <p style={{ color: '#2C3E50', marginTop: '1rem' }}>Loading orders...</p>
        </div>
    );

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">My Orders</h1>
                <Link to="/add-order" className="btn btn-primary">
                    + Add New Order
                </Link>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Order #</th>
                            <th>Date</th>
                            <th># Products</th>
                            <th>Final Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center text-gray-500">
                                    No orders available
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td className="font-semibold">{order.orderNumber}</td>
                                    <td>{formatDate(order.orderDate)}</td>
                                    <td>{order.totalProducts}</td>
                                    <td className="font-semibold">${order.finalPrice.toFixed(2)}</td>
                                    <td>{getStatusBadge(order.status)}</td>
                                    <td>
                                        <div className="flex space-x-3">
                                            <Link
                                                to={`/add-order/${order.id}`}
                                                className="action-btn action-btn-edit"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleChangeStatusClick(order)}
                                                className="action-btn action-btn-status"
                                            >
                                                Status
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(order)}
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

            {/* Modal de eliminacion */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Confirm Delete
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Are you sure you want to delete order "{orderToDelete?.orderNumber}"?
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

            {/* Modal de estado */}
            {showStatusModal && orderToChangeStatus && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Change Order Status
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Order: {orderToChangeStatus.orderNumber}
                        </p>
                        <div className="form-group">
                            <label className="form-label">New Status</label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(parseInt(e.target.value))}
                                className="form-select"
                            >
                                <option value={0}>Pending</option>
                                <option value={1}>In Progress</option>
                                <option value={2}>Completed</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button onClick={handleChangeStatusCancel} className="btn btn-secondary">
                                Cancel
                            </button>
                            <button onClick={handleChangeStatusConfirm} className="btn btn-primary">
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;