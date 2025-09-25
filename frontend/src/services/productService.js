import API from "./api";

export const productService = {
    // Obtener todos los productos
    getAll: async () => {
        const response = await API.get("/Products");
        return response.data;
    },

    // Obtener productos activos
    getActive: async () => {
        const response = await API.get('/Products/active');
        return response.data;
    },

    // Obtener producto por ID
    getById: async (id) => {
        const response = await API.get(`/Products/${id}`);
        return response.data;
    },

    // Crear producto
    create: async (productData) => {
        const response = await API.post('/Products', productData);
        return response.data;
    },

    // Actualizar producto
    update: async (id, productData) => {
        const response = await API.put(`/Products/${id}`, productData);
        return response.data;
    },

    // Eliminar producto
    delete: async (id) => {
        await API.delete(`/Products/${id}`);
        return true;
    },
}