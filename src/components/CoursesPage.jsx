    // src/components/CoursesPage.jsx
    import React, { useState, useEffect } from 'react';
    import { Book, User, LogOut, RefreshCcw } from 'lucide-react';

    const CoursesPage = ({ onLogout }) => {
        const [courses, setCourses] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');

        const fetchCourses = async () => {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('token');
            console.log("Intentando obtener cursos...");
            console.log("Token en localStorage:", token ? "Token encontrado" : "No se encontró token");

            if (!token) {
                setError('No hay token de autenticación. Por favor, inicia sesión de nuevo.');
                setLoading(false);
                onLogout(); // Retorna al login si no hay token
                return;
            }

            try {
                const response = await fetch('https://saviare-backend.onrender.com/api/cursos', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    // Aquí manejamos errores como 401 Unauthorized o 404 Not Found
                    const errorData = await response.json();
                    throw new Error(errorData.msg || `Error en la petición: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setCourses(data); // Asume que el backend devuelve un array directamente
                console.log("Cursos cargados exitosamente:", data);
            } catch (err) {
                console.error("Error al cargar los cursos:", err.message || err);
                // Aquí mostraremos el error al usuario en lugar de simplemente cerrar sesión
                setError(`Error: ${err.message || 'Error de conexión con el servidor. Asegúrate de que el backend esté en ejecución.'}`);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchCourses();
        }, []);

        // Estados de carga y error con la nueva paleta de colores
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800">
                    <RefreshCcw className="animate-spin text-orange-500" size={48} />
                    <p className="mt-4 text-xl font-medium">Cargando cursos...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 p-4 text-center">
                    <p className="text-red-600 text-lg mb-4 font-bold">{error}</p>
                    <div className="flex space-x-4">
                        <button onClick={fetchCourses} className="py-2 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-lg transition-colors">
                            Reintentar
                        </button>
                        <button onClick={onLogout} className="py-2 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-lg transition-colors">
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
                <header className="bg-white shadow-md p-4 md:px-8 flex flex-col sm:flex-row justify-between items-center rounded-b-xl">
                    <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500 mb-2 sm:mb-0">Saviare</h1>
                    <button onClick={onLogout} className="flex items-center space-x-2 py-2 px-5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                        <LogOut size={20} />
                        <span>Cerrar sesión</span>
                    </button>
                </header>
                <main className="p-4 md:p-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">Mis Cursos</h2>
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {courses.length > 0 ? (
                            courses.map(course => (
                                <div key={course.id} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100 hover:shadow-2xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="p-3 rounded-full bg-gradient-to-tr from-orange-200 to-amber-200">
                                            <Book size={24} className="text-orange-500" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900">{course.title}</h3>
                                    </div>
                                    <p className="text-slate-600 mb-4">{course.description}</p>
                                    <div className="flex items-center space-x-2 text-sm text-slate-500">
                                        <User size={16} />
                                        <span>Instructor: {course.instructor}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-lg text-slate-500 col-span-full">No hay cursos disponibles.</p>
                        )}
                    </div>
                </main>
            </div>
        );
    };

    export default CoursesPage;
