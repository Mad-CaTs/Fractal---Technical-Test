import API from './api';

export const orderService = {
    // Obtener todas las órdenes
    getAll: async () => {
        const response = await API.get('/Orders');
        return response.data;
    },

    // Obtener orden por ID
    getById: async (id) => {
        const response = await API.get(`/Orders/${id}`);
        return response.data;
    },

    // Crear orden
    create: async (orderData) => {
        const response = await API.post('/Orders', orderData);
        return response.data;
    },

    // Actualizar orden
    update: async (id, orderData) => {
        const response = await API.put(`/Orders/${id}`, orderData);
        return response.data;
    },

    // Eliminar orden
    delete: async (id) => {
        await API.delete(`/Orders/${id}`);
        return true;
    },

    // Cambiar estado de orden
    updateStatus: async (id, status) => {
        const response = await API.patch(`/Orders/${id}/status`, status, {
        headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    },

    // Verificar si se puede editar
    canEdit: async (id) => {
        const response = await API.get(`/Orders/${id}/can-edit`);
        return response.data.canEdit;
    },
};