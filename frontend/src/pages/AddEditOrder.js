import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';

const AddEditOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    // Estados principales
    const [order, setOrder] = useState({
        orderDate: new Date().toISOString().split('T')[0],
        totalProducts: 0,
        finalPrice: 0,
        orderDetails: []
    });

    const [availableProducts, setAvailableProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados para el modal de agregar producto
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);

    // Estados para el modal de editar producto
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editQuantity, setEditQuantity] = useState(1);

    // Estados para el modal de confirmación de eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Cargar datos al iniciar el componente
    useEffect(() => {
        loadProducts();
            if (isEdit) {
                loadOrder();
            }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isEdit]);

    // Verificar si la orden se puede editar
    useEffect(() => {
        const checkEditability = async () => {
            if (isEdit && id) {
                try {
                    const canEdit = await orderService.canEdit(id);
                    if (!canEdit) {
                    setError('Esta orden está completada y no se puede modificar');
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
        setError('Error al cargar productos');
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
        setError('Error al cargar la orden');
        } finally {
        setLoading(false);
        }
    };

    const handleAddProduct = () => {
        if (!selectedProductId || quantity <= 0) return;

        const product = availableProducts.find(p => p.id === parseInt(selectedProductId));
        if (!product) return;

        // Verificar si el producto ya está en la orden
        const existingIndex = order.orderDetails.findIndex(od => od.productId === product.id);
        
        let newOrderDetails;
        if (existingIndex >= 0) {
        // Actualizar cantidad si ya existe
        newOrderDetails = order.orderDetails.map((od, index) => 
            index === existingIndex 
            ? { ...od, 
                quantity: od.quantity + quantity,
                totalPrice: (od.quantity + quantity) * od.unitPrice
            }
            : od
        );
        } else {
        // Agregar nuevo producto
        const newDetail = {
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            unitPrice: product.unitPrice,
            totalPrice: quantity * product.unitPrice
        };
        newOrderDetails = [...order.orderDetails, newDetail];
        }

        setOrder(prev => ({
        ...prev,
        orderDetails: newOrderDetails
        }));

        // Resetear modal
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
        if (editQuantity <= 0) return;

        const newOrderDetails = order.orderDetails.map(od => 
        od.productId === editingProduct.productId
            ? { ...od, quantity: editQuantity, 
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
    };

    const handleSaveOrder = async () => {
        try {

        if (order.orderDetails.length === 0) {
            setError('Debe agregar al menos un producto');
            return;
        }

        // Validar si se puede editar
        if (isEdit) {
        const canEdit = await orderService.canEdit(id);
        if (!canEdit) {
            setError('Esta orden está completada y no se puede modificar');
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
            status: order.status || 0
            });
        } else {
            await orderService.create(orderData);
        }

        navigate('/my-orders');
        } catch (err) {
        setError('Error al guardar la orden');
        } finally {
        setLoading(false);
        }
    };

    // Calcular totales
    const totalProducts = order.orderDetails.reduce((sum, od) => sum + od.quantity, 0);
    const finalPrice = order.orderDetails.reduce((sum, od) => sum + od.totalPrice, 0);

    if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Order' : 'Add Order'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Formulario principal */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 

          {/* Date (disabled) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={order.orderDate}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          {/* # Products (disabled) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              # Products
            </label>
            <input
              type="number"
              value={totalProducts}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          {/* Final Price (disabled) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Final Price
            </label>
            <input
              type="text"
              value={`$${finalPrice.toFixed(2)}`}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Botón para agregar producto */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddProductModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add Product to Order
        </button>
      </div>

      {/* Tabla de productos en la orden */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Products in Order</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Unit Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Qty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Options
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {order.orderDetails.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No products added to this order
                </td>
              </tr>
            ) : (
              order.orderDetails.map((detail, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {detail.productId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {detail.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${detail.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {detail.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${detail.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditProduct(detail)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProductClick(detail)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between">
        <button
          onClick={() => navigate('/my-orders')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveOrder}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : (isEdit ? 'Update Order' : 'Create Order')}
        </button>
      </div>

      {/* Modal para agregar producto */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Product</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Product
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Choose a product...</option>
                {availableProducts.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.unitPrice.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddProductModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar producto */}
      {showEditProductModal && editingProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit Product: {editingProduct.productName}
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={editQuantity}
                onChange={(e) => setEditQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEditProductModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación de producto */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Remove Product
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to remove "{productToDelete.productName}" from this order?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProductConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
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
