// src/components/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { User, Lock, ArrowLeft } from 'lucide-react';

const LoginPage = ({ onLoginSuccess, navigateTo }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                onLoginSuccess();
            }
        } catch (err) {
            setError('Credenciales inválidas');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
            <div className="p-8 bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
                <button onClick={() => navigateTo('landing')} className="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-4">
                    <ArrowLeft size={20} className="mr-2" /> Volver
                </button>
                <h2 className="text-4xl font-extrabold text-center mb-6 text-blue-800">Iniciar Sesión</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Usuario</label>
                        <div className="relative mt-1">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="pl-10 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="profe_saviare"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="profe123"
                            />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-500 text-center font-medium">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105"
                    >
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
