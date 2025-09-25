import axios from "axios";

const API = axios.create(
    { 
        baseURL: "https://localhost:7067/api", 
        headers: { "Content-Type": "application/json" },    
    });

API.interceptors.request.use(
    (response) => response,
    (error) => {
        console.error("API error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default API;