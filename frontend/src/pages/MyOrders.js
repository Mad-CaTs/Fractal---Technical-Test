import React, { useState, useEffect, use } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [orderToChangeStatus, setOrderToChangeStatus] = useState(null);
    const [newStatus, setNewStatus] = useState(0);

    // Cargar ordenes al iniciar
    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try{
            setLoading(true);
            const ordersData = await orderService.getAll();
            setOrders(ordersData);
        }catch(error){
            setError("Error al cargar las ordenes.");
            console.error(error);
        }finally{
            setLoading(false);
        }
    };

    const handleDeleteClick = (order) => {
        setOrderToDelete(order);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try{
            await orderService.delete(orderToDelete.id);
            await loadOrders();
            setShowDeleteModal(false);
            setOrderToDelete(null);        
        }catch(error){
            setError("Error al eliminar la orden.");
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
        } catch (err) {
            setError('Error al cambiar el estado de la orden');
            console.error(err);
        }
    };

    const handleChangeStatusCancel = () => {
        setShowStatusModal(false);
        setOrderToChangeStatus(null);
    };

    const getStatusText = (status) => {
        const statusMap = {
            0: 'Pending',
            1: 'In Progress', 
            2: 'Completed'
        };
        return statusMap[status] || 'Unknown';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            0: {text: 'Pending', class: 'bg-yellow-100 text-yellow-800'},
            1: { text: 'In Progress', class: 'bg-blue-100 text-blue-800' },
            2: { text: 'Completed', class: 'bg-green-100 text-green-800' },
        };

        const config = statusConfig[status] || { text: 'Unknown', class: 'bg-gray-100 text-gray-800' };

        return (
            <span className={`px-2 py-1 text-xs rounded-full ${config.class}`}>
                {config.text}
            </span>
        );       
    };

    if(loading) return <div className="text-center py-8">Cargando órdenes...</div>;
    if(error) return <div className="text-center py-8 text-red-600">{error}</div>;

    return (
    <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <Link
          to="/add-order"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Order
        </Link>
        </div>

        {/* Tabla de órdenes */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            # Products
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Final Price
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
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                No hay ordenes disponibles.
                            </td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.orderNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(order.orderDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.totalProducts}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${order.finalPrice.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(order.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link
                                    to={`/add-order/${order.id}`}
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                    Edit
                                    </Link>
                                    <button
                                        onClick={() => handleChangeStatusClick(order)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        Change Status
                                    </button>
                                    <button
                                    onClick={() => handleDeleteClick(order)}
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

        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Delete
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete order "{orderToDelete?.orderNumber}"? 
                This action cannot be undone.
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

        {/* Modal para cambiar estado */}
        {showStatusModal && orderToChangeStatus && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                Change Order Status
            </h3>
            <p className="text-sm text-gray-500 mb-4">
                Change status for order: {orderToChangeStatus.orderNumber}
            </p>
            
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
                </label>
                <select
                value={newStatus}
                onChange={(e) => setNewStatus(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value={0}>Pending</option>
                <option value={1}>In Progress</option>
                <option value={2}>Completed</option>
                </select>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                onClick={handleChangeStatusCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                Cancel
                </button>
                <button
                onClick={handleChangeStatusConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                Change Status
                </button>
            </div>
            </div>
        </div>
        )}
        
    </div>
    );
};

export default MyOrders;