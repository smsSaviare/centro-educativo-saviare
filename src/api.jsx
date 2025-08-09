// src/api.jsx
import axios from 'axios';

// Crea una instancia de Axios
const api = axios.create({
    baseURL: 'http://localhost:5000',
});

export default api;
