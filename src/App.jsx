import React, { useState, useEffect } from 'react';

// Importaciones de Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, setDoc, doc, updateDoc, deleteDoc, query, where, getDocs, onSnapshot } from 'firebase/firestore';

// Componentes de la aplicación (simulados para la demostración)
// NOTA: Deberías tener estos componentes en archivos separados en un proyecto real.
// Para esta solución, los incluimos aquí para que el código sea autocontenido.
const WelcomePage = ({ setCurrentPage }) => (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-gray-900 transition-colors duration-500">
        <div className="text-center w-full max-w-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 space-y-8 transform transition-all duration-500 hover:scale-[1.02]">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Bienvenido al centro educativo SAG
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
                <span className="text-green-700 dark:text-green-300">Saviare</span>
            </h2>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
                <button
                    onClick={() => setCurrentPage('login')}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
                >
                    Iniciar Sesión
                </button>
                <button
                    onClick={() => setCurrentPage('register')}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
                >
                    Registrarse
                </button>
            </div>
        </div>
    </div>
);

const LoginPage = ({ onLoginSuccess, setCurrentPage, db, appId }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');
        try {
            // Lógica de inicio de sesión
            // ... (asumimos que esta parte está funcionando)
            onLoginSuccess({
                id: 'student123',
                email: email,
                role: 'student'
            }); // Esto es un ejemplo, debes reemplazarlo con tu lógica real de autenticación.
        } catch (e) {
            setError('Error al iniciar sesión. Verifica tus credenciales.');
            console.error("Error logging in: ", e);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-gray-900">
            <div className="w-full max-w-md bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Iniciar Sesión</h2>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button
                    onClick={handleLogin}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                >
                    Iniciar Sesión
                </button>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    ¿No tienes una cuenta? <button onClick={() => setCurrentPage('register')} className="text-green-600 hover:text-green-700 font-semibold">Regístrate</button>
                </p>
            </div>
        </div>
    );
};

const RegistrationPage = ({ setCurrentPage, onRegisterSuccess, db, appId }) => {
    // Lógica de registro
    // ... (asumimos que esta parte está funcionando)
    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-gray-900">
            <div className="w-full max-w-md bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Registrarse</h2>
                <p className="text-center text-gray-600 dark:text-gray-400">Lógica de registro aquí...</p>
                <button
                    onClick={() => setCurrentPage('login')}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                >
                    Volver a Iniciar Sesión
                </button>
            </div>
        </div>
    );
};

const TeacherDashboard = ({ user, onLogout, db, appId, onViewGrades, onManageCourses, onManageQuizzes, onCourseSelect }) => (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <h1 className="text-4xl font-extrabold mb-4">Panel del Profesor</h1>
        <p>Hola, {user.email}! (ID: {user.id})</p>
        <button onClick={onLogout} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg">Cerrar Sesión</button>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-2">Gestionar Cursos</h2>
                <p>Aquí puedes asignar y desasignar cursos a los estudiantes. (Esta parte ya funciona según tu descripción)</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-2">Gestionar Exámenes</h2>
                <p>Gestiona los exámenes y preguntas.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-2">Ver Calificaciones</h2>
                <p>Visualiza y edita las calificaciones de los estudiantes.</p>
            </div>
        </div>
    </div>
);

// Componente StudentDashboard con la lógica de Firestore corregida
const StudentDashboard = ({ user, onLogout, onCourseSelect, db, appId, onViewGrades }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = user.id;

    useEffect(() => {
        if (!db || !userId) return;

        // Construye la ruta de la colección para los cursos públicos
        const coursesPath = `artifacts/${appId}/public/data/courses`;
        const coursesRef = collection(db, coursesPath);

        // Crea una consulta filtrada por el ID del estudiante en un arreglo de IDs
        const q = query(coursesRef, where("studentIds", "array-contains", userId));

        // Escucha cambios en tiempo real en la colección filtrada
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const coursesList = [];
            snapshot.forEach((doc) => {
                coursesList.push({ id: doc.id, ...doc.data() });
            });
            setCourses(coursesList);
            setLoading(false);
        }, (error) => {
            console.error("Error al obtener los cursos en tiempo real: ", error);
            setLoading(false);
        });

        // La función de limpieza se ejecuta cuando el componente se desmonta
        // para detener la escucha en tiempo real.
        return () => unsubscribe();
    }, [db, userId, appId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
            <h1 className="text-4xl font-extrabold mb-4">Panel del Estudiante</h1>
            <p>Hola, {user.email}! (ID: {user.id})</p>
            <button onClick={onLogout} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg">Cerrar Sesión</button>

            <h2 className="text-3xl font-bold mt-8 mb-4">Mis Cursos</h2>
            {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 cursor-pointer" onClick={() => onCourseSelect(course)}>
                            <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">{course.name}</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{course.description}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-400">No tienes cursos asignados en este momento.</p>
            )}
        </div>
    );
};

// Componente principal de la aplicación
const App = () => {
    const [currentPage, setCurrentPage] = useState('welcome');
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);

    // Variables globales para Firebase (Canvas Environment)
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

    useEffect(() => {
        const initializeFirebase = async () => {
            try {
                const app = initializeApp(firebaseConfig);
                const firestoreDb = getFirestore(app);
                const authInstance = getAuth(app);

                setDb(firestoreDb);
                setAuth(authInstance);

                onAuthStateChanged(authInstance, async (user) => {
                    if (user) {
                        const token = await user.getIdTokenResult();
                        setUserId(user.uid);
                        // Suponemos que el rol está en los claims del token
                        setLoggedInUser({ id: user.uid, email: user.email, role: token.claims.role });
                        // También puedes obtener el rol desde un documento en Firestore si lo tienes
                        // const userDocRef = doc(firestoreDb, `artifacts/${appId}/users/${user.uid}/profile`, 'userProfile');
                        // const userDocSnap = await getDoc(userDocRef);
                        // if (userDocSnap.exists()) {
                        //     setLoggedInUser({ id: user.uid, email: user.email, role: userDocSnap.data().role });
                        // }
                    } else {
                        setUserId(null);
                        setLoggedInUser(null);
                    }
                });

                // Si hay un token de autenticación inicial, úsalo para iniciar sesión
                if (initialAuthToken) {
                    await signInWithCustomToken(authInstance, initialAuthToken);
                } else {
                    await signInAnonymously(authInstance);
                }

            } catch (error) {
                console.error("Error al inicializar Firebase o al autenticar: ", error);
            }
        };

        initializeFirebase();
    }, [appId, initialAuthToken, firebaseConfig]);

    const handleLoginSuccess = (user) => {
        setLoggedInUser(user);
        setCurrentPage('dashboard');
    };

    const handleRegisterSuccess = (user) => {
        setLoggedInUser(user);
        setCurrentPage('dashboard');
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        setCurrentPage('welcome');
        if (auth) {
            auth.signOut();
        }
    };

    let content;
    if (loggedInUser) {
        if (loggedInUser.role === 'teacher') {
            content = <TeacherDashboard user={loggedInUser} onLogout={handleLogout} db={db} appId={appId} />;
        } else {
            content = <StudentDashboard user={loggedInUser} onLogout={handleLogout} db={db} appId={appId} />;
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
