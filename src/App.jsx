import React, { useState, useEffect } from 'react';

// Importaciones de Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, setDoc, doc, updateDoc, deleteDoc, query, where, getDocs, onSnapshot } from 'firebase/firestore';

// Componente para la página principal de bienvenida
const WelcomePage = ({ setCurrentPage }) => {
    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-gray-900 transition-colors duration-500">
            <div className="text-center w-full max-w-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 space-y-8 transform transition-all duration-500 hover:scale-[1.02]">
                <img
                    src="https://placehold.co/400x200/22c55e/ffffff?text=Logo+de+la+Plataforma"
                    alt="Logo de la Plataforma"
                    className="mx-auto mb-6 rounded-lg shadow-md"
                />
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                    Bienvenido al centro educativo SAG
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
                    <span className="text-green-700 dark:text-green-400">
                        Una experiencia de aprendizaje interactiva
                    </span>
                </h2>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                    <button
                        onClick={() => setCurrentPage('login')}
                        className="px-8 py-3 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-700 transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Ingresar
                    </button>
                    <button
                        onClick={() => setCurrentPage('register')}
                        className="px-8 py-3 bg-gray-200 text-gray-800 font-bold rounded-full shadow-lg hover:bg-gray-300 transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                    >
                        Registrarse
                    </button>
                </div>
            </div>
        </div>
    );
};

// Componente para la página de login
const LoginPage = ({ onLoginSuccess, setCurrentPage }) => {
    // Código de LoginPage... (se mantiene sin cambios)
    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Ingresar</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Usuario"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                        onClick={onLoginSuccess}
                        className="w-full px-4 py-2 text-white bg-green-600 rounded-lg font-bold hover:bg-green-700"
                    >
                        Ingresar
                    </button>
                </div>
                <button
                    onClick={() => setCurrentPage('welcome')}
                    className="w-full text-center text-green-600 hover:underline"
                >
                    Volver
                </button>
            </div>
        </div>
    );
};

// Componente para la página de registro
const RegistrationPage = ({ setCurrentPage, onRegisterSuccess }) => {
    // Código de RegistrationPage... (se mantiene sin cambios)
    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Registrarse</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nombre Completo"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        type="text"
                        placeholder="Usuario"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                        onClick={onRegisterSuccess}
                        className="w-full px-4 py-2 text-white bg-green-600 rounded-lg font-bold hover:bg-green-700"
                    >
                        Registrarse
                    </button>
                </div>
                <button
                    onClick={() => setCurrentPage('login')}
                    className="w-full text-center text-green-600 hover:underline"
                >
                    Volver al login
                </button>
            </div>
        </div>
    );
};

const StudentDashboard = ({ user, onLogout, onCourseSelect }) => {
    // Código del StudentDashboard... (se mantiene sin cambios)
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <header className="flex justify-between items-center pb-8 border-b dark:border-gray-700">
                <h1 className="text-3xl font-bold text-green-600">Dashboard del Estudiante</h1>
                <button onClick={onLogout} className="text-red-500 hover:underline">
                    Cerrar Sesión
                </button>
            </header>
            <main className="mt-8">
                <h2 className="text-2xl font-semibold dark:text-white">
                    Bienvenido, {user.displayName || user.email}!
                </h2>
                <p className="dark:text-gray-400 mt-2">
                    Tu ID de usuario es: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{user.uid}</code>
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold dark:text-white">Cursos Disponibles</h3>
                        <p className="mt-2 dark:text-gray-400">Selecciona un curso para empezar a aprender.</p>
                        <button onClick={() => onCourseSelect({ id: 'course1', name: 'Sistemas de Control' })} className="mt-4 text-green-600 hover:underline">
                            Ir al Curso de Sistemas de Control
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

const AdminDashboard = ({ user, onLogout, db, appId, onViewGrades, onManageCourses, onManageQuizzes, onCourseSelect }) => {
    // Código del AdminDashboard... (se mantiene sin cambios)
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <header className="flex justify-between items-center pb-8 border-b dark:border-gray-700">
                <h1 className="text-3xl font-bold text-green-600">Panel de Administración</h1>
                <button onClick={onLogout} className="text-red-500 hover:underline">
                    Cerrar Sesión
                </button>
            </header>
            <main className="mt-8">
                <h2 className="text-2xl font-semibold dark:text-white">
                    Bienvenido, {user.displayName || 'Admin'}!
                </h2>
                <p className="dark:text-gray-400 mt-2">
                    Tu ID de usuario es: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{user.uid}</code>
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold dark:text-white">Gestión de Cursos</h3>
                        <p className="mt-2 dark:text-gray-400">Crea, edita y elimina cursos.</p>
                        <button onClick={onManageCourses} className="mt-4 text-green-600 hover:underline">
                            Administrar Cursos
                        </button>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold dark:text-white">Gestión de Evaluaciones</h3>
                        <p className="mt-2 dark:text-gray-400">Crea y asigna cuestionarios y exámenes.</p>
                        <button onClick={onManageQuizzes} className="mt-4 text-green-600 hover:underline">
                            Administrar Evaluaciones
                        </button>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold dark:text-white">Calificaciones</h3>
                        <p className="mt-2 dark:text-gray-400">Revisa y gestiona las calificaciones de los estudiantes.</p>
                        <button onClick={onViewGrades} className="mt-4 text-green-600 hover:underline">
                            Ver Calificaciones
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

const App = () => {
    // Definiciones de estado y efectos
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('welcome');
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [appId, setAppId] = useState(null);

    // Inicialización de Firebase
    useEffect(() => {
        // La inicialización debe ocurrir solo una vez
        if (typeof __firebase_config !== 'undefined' && !db) {
            try {
                const firebaseConfig = JSON.parse(__firebase_config);
                const app = initializeApp(firebaseConfig);
                const firestore = getFirestore(app);
                const authInstance = getAuth(app);
                const appId_val = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
                
                setDb(firestore);
                setAuth(authInstance);
                setAppId(appId_val);

                const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
                    if (user) {
                        setLoggedInUser(user);
                        // Navegación post-autenticación
                        const userDoc = await getDocs(query(collection(firestore, "artifacts", appId_val, "users", user.uid, "profile")));
                        if (!userDoc.empty) {
                            const profileData = userDoc.docs[0].data();
                            setLoggedInUser({ ...user, ...profileData });
                        }
                    } else {
                        setLoggedInUser(null);
                    }
                });

                // Iniciar sesión con token personalizado
                if (typeof __initial_auth_token !== 'undefined') {
                    signInWithCustomToken(authInstance, __initial_auth_token);
                } else {
                    signInAnonymously(authInstance);
                }

                return () => unsubscribe();
            } catch (error) {
                console.error("Error initializing Firebase:", error);
            }
        }
    }, [db, auth]); // Ejecutar solo cuando `db` o `auth` cambien para evitar múltiples inicializaciones

    const handleLoginSuccess = (user, userProfile) => {
        setLoggedInUser({ ...user, ...userProfile });
    };

    const handleRegisterSuccess = (user, userProfile) => {
        setLoggedInUser({ ...user, ...userProfile });
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        setCurrentPage('welcome');
    };

    // Funciones de navegación (simuladas)
    const handleViewGrades = () => { console.log("Navegar a ver calificaciones"); };
    const handleManageCourses = () => { console.log("Navegar a gestionar cursos"); };
    const handleManageQuizzes = () => { console.log("Navegar a gestionar cuestionarios"); };
    const handleCourseSelect = (course) => { console.log(`Navegar a curso: ${course.name}`); };

    let content;
    if (loggedInUser && db && appId) {
        if (loggedInUser.role === 'admin') {
            content = <AdminDashboard
                user={loggedInUser}
                onLogout={handleLogout}
                db={db}
                appId={appId}
                onViewGrades={handleViewGrades}
                onManageCourses={handleManageCourses}
                onManageQuizzes={handleManageQuizzes}
                onCourseSelect={handleCourseSelect}
            />;
        } else {
            content = <StudentDashboard
                user={loggedInUser}
                onLogout={handleLogout}
                onCourseSelect={handleCourseSelect}
                db={db}
                appId={appId}
                onViewGrades={handleViewGrades}
            />;
        }
    } else {
        switch (currentPage) {
            case 'login':
                content = <LoginPage onLoginSuccess={handleLoginSuccess} setCurrentPage={setCurrentPage} db={db} appId={appId} />;
                break;
            case 'register':
                content = <RegistrationPage setCurrentPage={setCurrentPage} onRegisterSuccess={handleRegisterSuccess} db={db} appId={appId} />;
                break;
            case 'welcome':
            default:
                content = <WelcomePage setCurrentPage={setCurrentPage} />;
                break;
        }
    }

    return (
        <div className="font-sans antialiased text-gray-900 dark:text-gray-50 transition-colors duration-500">
            {content}
        </div>
    );
};

export default App;
