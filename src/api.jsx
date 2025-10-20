// src/api.jsx
import axios from "axios";

// 🔒 Forzamos que siempre use Render
const api = axios.create({
  baseURL: "https://saviare-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("🔗 Conectado al backend:", api.defaults.baseURL);

export default api;
