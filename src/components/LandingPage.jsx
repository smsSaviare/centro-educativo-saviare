// src/components/LandingPage.jsx
import React from 'react';

const LandingPage = ({ navigateTo }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-white">
            <h1 className="text-5xl font-extrabold text-center mb-4 md:text-6xl">Saviare</h1>
            <p className="text-xl text-center mb-8 max-w-2xl">
                Plataforma de seguridad operacional para el aprendizaje autónomo.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                    onClick={() => navigateTo('login')}
                    className="w-full sm:w-auto py-3 px-8 bg-white text-blue-600 font-bold rounded-lg shadow-xl hover:bg-gray-100 transition-colors transform hover:scale-105"
                >
                    Iniciar Sesión
                </button>
                <button
                    onClick={() => navigateTo('register')}
                    className="w-full sm:w-auto py-3 px-8 bg-transparent border-2 border-white text-white font-bold rounded-lg shadow-xl hover:bg-white hover:text-blue-600 transition-colors transform hover:scale-105"
                >
                    Crear Cuenta
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
