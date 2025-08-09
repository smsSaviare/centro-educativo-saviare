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
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                    Bienvenido al centro educativo SAG
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
                    <span className="text-green-700 dark:text-green-300">Desarrollado por Saviare</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-prose mx-auto mt-4">
                    Tu plataforma integral para el aprendizaje y la gestión en seguridad operacional.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                    <button
                        onClick={() => setCurrentPage('login')}
                        className="w-full sm:w-auto py-4 px-8 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50"
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => setCurrentPage('register')}
                        className="w-full sm:w-auto py-4 px-8 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                    >
                        Crear Usuario
                    </button>
                </div>
            </div>
        </div>
    );
};

// Componente para la página de registro de usuario
const RegistrationPage = ({ setCurrentPage, onRegisterSuccess, db, appId }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student', // Rol por defecto
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.nombre || !formData.apellido || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Todos los campos son obligatorios.');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        try {
            if (!db || !appId) {
                setError('La base de datos no está disponible. Por favor, inténtalo de nuevo.');
                setLoading(false);
                return;
            }

            const usersRef = collection(db, `artifacts/${appId}/public/data/users`);
            const q = query(usersRef, where("email", "==", formData.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setError('El correo electrónico ya está registrado.');
                setLoading(false);
                return;
            }

            await addDoc(usersRef, {
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });

            onRegisterSuccess();
        } catch (err) {
            console.error("Error detallado al registrar el usuario:", err);
            setError('Ocurrió un error al intentar registrar el usuario. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 p-4">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-lg w-full max-w-md space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Crear Usuario</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Nombre"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Apellido</label>
                        <input type="text" name="apellido" value={formData.apellido} onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Apellido"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="usuario@saviare.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Contraseña</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rol</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="student">Estudiante</option>
                            <option value="teacher">Profesor</option>
                        </select>
                    </div>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    ¿Ya tienes una cuenta?{' '}
                    <a href="#" onClick={() => setCurrentPage('login')} className="font-medium text-green-600 hover:text-green-500">
                        Inicia Sesión
                    </a>
                </p>
            </div>
        </div>
    );
};

// Componente para la página de inicio de sesión
const LoginPage = ({ onLoginSuccess, setCurrentPage, db, appId }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Por favor, ingresa tu correo y contraseña.');
            setLoading(false);
            return;
        }

        try {
            if (!db || !appId) {
                setError('La base de datos no está disponible. Por favor, inténtalo de nuevo.');
                setLoading(false);
                return;
            }

            const usersRef = collection(db, `artifacts/${appId}/public/data/users`);
            const q = query(usersRef, where("email", "==", email), where("password", "==", password));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                onLoginSuccess({ id: userDoc.id, ...userDoc.data() });
            } else {
                setError('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
            }
        } catch (err) {
            console.error("Error detallado al iniciar sesión:", err);
            setError('Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 p-4">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-lg w-full max-w-md space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Iniciar Sesión</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="usuario@saviare.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="••••••••"
                        />
                    </div>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    ¿No tienes una cuenta?{' '}
                    <a href="#" onClick={() => setCurrentPage('register')} className="font-medium text-green-600 hover:text-green-500">
                        Crea una aquí
                    </a>
                </p>
            </div>
        </div>
    );
};

// Helper para extraer el ID de YouTube
const getYouTubeId = (url) => {
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : null;
};

// Componente para ver los detalles de un curso y sus cuestionarios
const CourseDetailPage = ({ course, onBack, db, appId, user }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [loadingQuizzes, setLoadingQuizzes] = useState(true);
    const [takenQuizzes, setTakenQuizzes] = useState({});

    // Cargar cuestionarios del curso
    useEffect(() => {
        if (!db || !appId || !course) return;

        const quizzesRef = collection(db, `artifacts/${appId}/public/data/quizzes`);
        const q = query(quizzesRef, where("courseId", "==", course.id));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedQuizzes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setQuizzes(fetchedQuizzes);
            setLoadingQuizzes(false);
        }, (error) => {
            console.error("Error al obtener los cuestionarios:", error);
            setLoadingQuizzes(false);
        });
        return () => unsubscribe();
    }, [db, appId, course]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 p-8">
            <button onClick={onBack} className="self-start py-2 px-4 mb-8 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md transition-colors">
                &larr; Volver al Dashboard
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-green-600 dark:text-green-400 mb-4">{course.title}</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{course.description}</p>
                <div className="prose dark:prose-invert max-w-none mt-8">
                    {course.content && course.content.length > 0 ? (
                        course.content.map((item, index) => (
                            <div key={index} className="mb-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                {item.type === 'text' ? (
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{item.value}</p>
                                ) : (
                                    <div className="relative pt-[56.25%] rounded-lg overflow-hidden shadow-lg">
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-full"
                                            src={`https://www.youtube.com/embed/${getYouTubeId(item.value)}`}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">El profesor aún no ha añadido contenido a este curso.</p>
                    )}
                    <h3 className="text-2xl font-bold mt-8 mb-4">Cuestionarios</h3>
                    {loadingQuizzes ? (
                        <p>Cargando cuestionarios...</p>
                    ) : quizzes.length > 0 ? (
                        <ul className="space-y-4">
                            {quizzes.map(quiz => (
                                <li key={quiz.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{quiz.title}</h4>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        {quiz.questions.length} preguntas
                                    </p>
                                    <button className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
                                        Empezar Cuestionario
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay cuestionarios disponibles para este curso.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Componente para ver las calificaciones de un estudiante (vista por estudiante o profesor)
const GradesPage = ({ student, onBack, db, appId, isTeacherView }) => {
    const [grades, setGrades] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db || !appId || !student) return;

        const coursesRef = collection(db, `artifacts/${appId}/public/data/courses`);
        const gradesRef = collection(db, `artifacts/${appId}/public/data/grades`);

        // Obtenemos todos los cursos y luego las notas del estudiante
        const unsubscribeCourses = onSnapshot(coursesRef, (courseSnapshot) => {
            const fetchedCourses = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCourses(fetchedCourses);

            const unsubscribeGrades = onSnapshot(query(gradesRef, where("studentId", "==", student.id)), (gradeSnapshot) => {
                const fetchedGrades = gradeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setGrades(fetchedGrades);
                setLoading(false);
            }, (error) => {
                console.error("Error al obtener las notas:", error);
                setLoading(false);
            });
            return () => unsubscribeGrades();
        }, (error) => {
            console.error("Error al obtener los cursos:", error);
            setLoading(false);
        });
        return () => unsubscribeCourses();
    }, [db, appId, student]);

    const getCourseTitle = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course ? course.title : 'Curso no encontrado';
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 p-8">
            <button onClick={onBack} className="self-start py-2 px-4 mb-8 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md transition-colors">
                &larr; Volver
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-green-600 dark:text-green-400 mb-4">
                    {isTeacherView ? `Calificaciones de ${student.nombre} ${student.apellido}` : 'Mis Calificaciones'}
                </h2>
                {loading ? (
                    <p>Cargando calificaciones...</p>
                ) : grades.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mt-4">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700">
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Cuestionario
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Curso
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Nota
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {grades.map(grade => (
                                    <tr key={grade.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{grade.quizTitle}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{getCourseTitle(grade.courseId)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{grade.score} / {grade.totalQuestions}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No hay calificaciones disponibles.</p>
                )}
            </div>
        </div>
    );
};

// Componente para el dashboard del estudiante
const StudentDashboard = ({ user, onLogout, onCourseSelect, db, appId, onViewGrades }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db || !appId) return;
        const coursesRef = collection(db, `artifacts/${appId}/public/data/courses`);
        const unsubscribe = onSnapshot(coursesRef, (snapshot) => {
            const fetchedCourses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCourses(fetchedCourses);
            setLoading(false);
        }, (error) => {
            console.error("Error al obtener los cursos:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [db, appId]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Bienvenido, {user.nombre}</h1>
                <div className="flex items-center space-x-4">
                    <button onClick={() => onViewGrades(user)} className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md transition-colors">
                        Mis Calificaciones
                    </button>
                    <button onClick={onLogout} className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-colors">
                        Cerrar Sesión
                    </button>
                </div>
            </header>
            <div className="flex-grow">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Mis Cursos</h2>
                {loading ? (
                    <p className="text-gray-500 dark:text-gray-400">Cargando cursos...</p>
                ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" onClick={() => onCourseSelect(course)}>
                                <h3 className="text-xl font-bold text-green-600 dark:text-green-400">{course.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{course.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No hay cursos disponibles.</p>
                )}
            </div>
        </div>
    );
};

// Componente para el dashboard del profesor
const TeacherDashboard = ({ user, onLogout, db, appId, onViewGrades, onManageCourses, onManageQuizzes, onCourseSelect }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db || !appId) return;
        const coursesRef = collection(db, `artifacts/${appId}/public/data/courses`);
        const q = query(coursesRef, where("teacherId", "==", user.id));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedCourses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCourses(fetchedCourses);
            setLoading(false);
        }, (error) => {
            console.error("Error al obtener los cursos del profesor:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [db, appId, user.id]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Panel de Profesor, {user.nombre}</h1>
                <div className="flex items-center space-x-4">
                    <button onClick={onManageCourses} className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md transition-colors">
                        Gestionar Cursos
                    </button>
                    <button onClick={onManageQuizzes} className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md transition-colors">
                        Gestionar Cuestionarios
                    </button>
                    <button onClick={onLogout} className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-colors">
                        Cerrar Sesión
                    </button>
                </div>
            </header>
            <div className="flex-grow">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Mis Cursos</h2>
                {loading ? (
                    <p className="text-gray-500 dark:text-gray-400">Cargando cursos...</p>
                ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" onClick={() => onCourseSelect(course)}>
                                <h3 className="text-xl font-bold text-green-600 dark:text-green-400">{course.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{course.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No hay cursos disponibles.</p>
                )}
            </div>
        </div>
    );
};

// Componente para la gestión de cursos por parte del profesor
const ManageCoursesPage = ({ user, onBack, db, appId }) => {
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', content: [] });
    const [error, setError] = useState('');
    const [contentItem, setContentItem] = useState({ type: 'text', value: '' });

    useEffect(() => {
        if (!db || !appId || !user) return;
        const coursesRef = collection(db, `artifacts/${appId}/public/data/courses`);
        const q = query(coursesRef, where("teacherId", "==", user.id));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedCourses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCourses(fetchedCourses);
            setLoadingCourses(false);
        }, (error) => {
            console.error("Error al obtener los cursos:", error);
            setLoadingCourses(false);
        });
        return () => unsubscribe();
    }, [db, appId, user]);

    const handleEditCourse = (course) => {
        setIsEditing(true);
        setCurrentCourse(course);
        setFormData({ title: course.title, description: course.description, content: course.content || [] });
    };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este curso?')) {
            try {
                await deleteDoc(doc(db, `artifacts/${appId}/public/data/courses`, courseId));
            } catch (err) {
                console.error("Error al eliminar el curso:", err);
            }
        }
    };

    const handleSaveCourse = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.title || !formData.description) {
            setError('El título y la descripción son obligatorios.');
            return;
        }

        try {
            if (isEditing) {
                await updateDoc(doc(db, `artifacts/${appId}/public/data/courses`, currentCourse.id), {
                    title: formData.title,
                    description: formData.description,
                    content: formData.content,
                });
            } else {
                await addDoc(collection(db, `artifacts/${appId}/public/data/courses`), {
                    title: formData.title,
                    description: formData.description,
                    content: formData.content,
                    teacherId: user.id
                });
            }
            setIsEditing(false);
            setCurrentCourse(null);
            setFormData({ title: '', description: '', content: [] });
        } catch (err) {
            console.error("Error al guardar el curso:", err);
            setError('Ocurrió un error al guardar el curso.');
        }
    };

    const handleAddContent = () => {
        if (contentItem.value.trim() !== '') {
            setFormData(prev => ({ ...prev, content: [...prev.content, { ...contentItem }] }));
            setContentItem({ type: 'text', value: '' });
        }
    };

    const handleRemoveContent = (index) => {
        setFormData(prev => ({
            ...prev,
            content: prev.content.filter((_, i) => i !== index)
        }));
    };
    
    // Función para obtener la vista previa del contenido.
    const getContentPreview = (item) => {
        if (item.type === 'text') {
            const preview = item.value.substring(0, 50);
            return preview.length < item.value.length ? `${preview}...` : preview;
        } else if (item.type === 'video') {
            return `Video de YouTube: ${item.value}`;
        }
        return 'Contenido no reconocido';
    };


    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 p-8">
            <button onClick={onBack} className="self-start py-2 px-4 mb-8 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md transition-colors">
                &larr; Volver al Dashboard
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-green-600 dark:text-green-400 mb-4">
                    {isEditing ? 'Editar Curso' : 'Gestionar Cursos'}
                </h2>
                {isEditing ? (
                    <form onSubmit={handleSaveCourse} className="space-y-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Título del Curso</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Escribe el título del curso"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Escribe una descripción breve del curso"
                            />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Contenido del Curso</h3>
                        <div className="space-y-4">
                            {formData.content.map((item, index) => (
                                <div key={index} className="flex items-center p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                                    <div className="flex-grow">
                                        <p className="font-semibold text-gray-800 dark:text-white">{item.type === 'text' ? 'Texto' : 'Video'}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{getContentPreview(item)}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveContent(index)}
                                        className="ml-4 p-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col space-y-2">
                            <div className="flex space-x-2">
                                <select
                                    value={contentItem.type}
                                    onChange={(e) => setContentItem({ ...contentItem, type: e.target.value })}
                                    className="block px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="text">Texto</option>
                                    <option value="video">Video (URL de YouTube)</option>
                                </select>
                                <input
                                    type="text"
                                    value={contentItem.value}
                                    onChange={(e) => setContentItem({ ...contentItem, value: e.target.value })}
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder={contentItem.type === 'text' ? 'Escribe el texto aquí' : 'Pega la URL de YouTube'}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddContent}
                                    className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Añadir
                                </button>
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        <div className="flex justify-end space-x-4">
                            <button type="button" onClick={() => { setIsEditing(false); setCurrentCourse(null); setFormData({ title: '', description: '', content: [] }); }} className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors">
                                Guardar Curso
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <button
                            onClick={() => { setIsEditing(true); setCurrentCourse(null); setFormData({ title: '', description: '', content: [] }); }}
                            className="py-2 px-4 mb-8 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        >
                            Crear Nuevo Curso
                        </button>
                        {loadingCourses ? (
                            <p>Cargando cursos...</p>
                        ) : courses.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.map(course => (
                                    <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
                                        <h3 className="text-xl font-bold text-green-600 dark:text-green-400">{course.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{course.description}</p>
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleEditCourse(course)} className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors text-sm">
                                                Editar
                                            </button>
                                            <button onClick={() => handleDeleteCourse(course.id)} className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm">
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No tienes cursos creados. ¡Empieza creando uno!</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// Componente para la gestión de cuestionarios por parte del profesor
const ManageQuizzesPage = ({ onBack, user, db, appId }) => {
    const [courses, setCourses] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingQuizzes, setLoadingQuizzes] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [formData, setFormData] = useState({ title: '', courseId: '', questions: [] });
    const [error, setError] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState({ questionText: '', options: ['', '', '', ''], correctAnswer: 0 });

    // Cargar cursos del profesor
    useEffect(() => {
        if (!db || !appId || !user) return;
        const coursesRef = collection(db, `artifacts/${appId}/public/data/courses`);
        const q = query(coursesRef, where("teacherId", "==", user.id));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedCourses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCourses(fetchedCourses);
            setLoadingCourses(false);
        }, (error) => {
            console.error("Error al obtener los cursos:", error);
            setLoadingCourses(false);
        });
        return () => unsubscribe();
    }, [db, appId, user]);

    // Cargar cuestionarios del profesor
    useEffect(() => {
        if (!db || !appId || !user) return;
        const quizzesRef = collection(db, `artifacts/${appId}/public/data/quizzes`);
        const q = query(quizzesRef, where("teacherId", "==", user.id));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedQuizzes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setQuizzes(fetchedQuizzes);
            setLoadingQuizzes(false);
        }, (error) => {
            console.error("Error al obtener los cuestionarios:", error);
            setLoadingQuizzes(false);
        });
        return () => unsubscribe();
    }, [db, appId, user]);

    const handleEditQuiz = (quiz) => {
        setIsEditing(true);
        setCurrentQuiz(quiz);
        setFormData({ title: quiz.title, courseId: quiz.courseId, questions: quiz.questions || [] });
    };

    const handleDeleteQuiz = async (quizId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este cuestionario?')) {
            try {
                await deleteDoc(doc(db, `artifacts/${appId}/public/data/quizzes`, quizId));
            } catch (err) {
                console.error("Error al eliminar el cuestionario:", err);
            }
        }
    };

    const handleSaveQuiz = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.title || !formData.courseId || formData.questions.length === 0) {
            setError('El título, el curso y al menos una pregunta son obligatorios.');
            return;
        }

        try {
            if (isEditing) {
                await updateDoc(doc(db, `artifacts/${appId}/public/data/quizzes`, currentQuiz.id), {
                    title: formData.title,
                    courseId: formData.courseId,
                    questions: formData.questions,
                    teacherId: user.id
                });
            } else {
                await addDoc(collection(db, `artifacts/${appId}/public/data/quizzes`), {
                    title: formData.title,
                    courseId: formData.courseId,
                    questions: formData.questions,
                    teacherId: user.id
                });
            }
            setIsEditing(false);
            setCurrentQuiz(null);
            setFormData({ title: '', courseId: '', questions: [] });
            setCurrentQuestion({ questionText: '', options: ['', '', '', ''], correctAnswer: 0 });
        } catch (err) {
            console.error("Error al guardar el cuestionario:", err);
            setError('Ocurrió un error al guardar el cuestionario.');
        }
    };

    const handleAddQuestion = () => {
        if (currentQuestion.questionText.trim() !== '' && currentQuestion.options.every(opt => opt.trim() !== '')) {
            setFormData(prev => ({ ...prev, questions: [...prev.questions, { ...currentQuestion }] }));
            setCurrentQuestion({ questionText: '', options: ['', '', '', ''], correctAnswer: 0 });
        } else {
            setError('Todos los campos de la pregunta y opciones deben estar llenos.');
        }
    };

    const handleRemoveQuestion = (index) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 p-8">
            <button onClick={onBack} className="self-start py-2 px-4 mb-8 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md transition-colors">
                &larr; Volver al Dashboard
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-green-600 dark:text-green-400 mb-4">
                    {isEditing ? 'Editar Cuestionario' : 'Gestionar Cuestionarios'}
                </h2>
                {isEditing ? (
                    <form onSubmit={handleSaveQuiz} className="space-y-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Título del Cuestionario</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Escribe el título del cuestionario"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Curso Asociado</label>
                            <select
                                value={formData.courseId}
                                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="">Selecciona un curso</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>{course.title}</option>
                                ))}
                            </select>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Preguntas</h3>
                        <div className="space-y-4">
                            {formData.questions.map((q, index) => (
                                <div key={index} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-semibold text-gray-800 dark:text-white">Pregunta {index + 1}</p>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveQuestion(index)}
                                            className="p-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-gray-800 dark:text-gray-200">{q.questionText}</p>
                                    <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        {q.options.map((option, optIndex) => (
                                            <li key={optIndex} className={optIndex === q.correctAnswer ? 'font-bold text-green-600 dark:text-green-400' : ''}>
                                                {String.fromCharCode(65 + optIndex)}. {option}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl space-y-4">
                            <h4 className="font-semibold text-gray-800 dark:text-white">Añadir Nueva Pregunta</h4>
                            <input
                                type="text"
                                value={currentQuestion.questionText}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Escribe la pregunta aquí"
                            />
                            <div className="space-y-2">
                                {currentQuestion.options.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            checked={currentQuestion.correctAnswer === index}
                                            onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                                            className="form-radio text-green-600"
                                        />
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => {
                                                const newOptions = [...currentQuestion.options];
                                                newOptions[index] = e.target.value;
                                                setCurrentQuestion({ ...currentQuestion, options: newOptions });
                                            }}
                                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder={`Opción ${String.fromCharCode(65 + index)}`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleAddQuestion}
                                className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                            >
                                Añadir Pregunta
                            </button>
                        </div>
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        <div className="flex justify-end space-x-4">
                            <button type="button" onClick={() => { setIsEditing(false); setCurrentQuiz(null); setFormData({ title: '', courseId: '', questions: [] }); setCurrentQuestion({ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }); }} className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors">
                                Guardar Cuestionario
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <button
                            onClick={() => { setIsEditing(true); setCurrentQuiz(null); setFormData({ title: '', courseId: '', questions: [] }); setCurrentQuestion({ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }); }}
                            className="py-2 px-4 mb-8 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        >
                            Crear Nuevo Cuestionario
                        </button>
                        {loadingQuizzes ? (
                            <p>Cargando cuestionarios...</p>
                        ) : quizzes.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {quizzes.map(quiz => (
                                    <div key={quiz.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
                                        <h3 className="text-xl font-bold text-green-600 dark:text-green-400">{quiz.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Curso: {courses.find(c => c.id === quiz.courseId)?.title || 'No encontrado'}</p>
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleEditQuiz(quiz)} className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors text-sm">
                                                Editar
                                            </button>
                                            <button onClick={() => handleDeleteQuiz(quiz.id)} className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm">
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No tienes cuestionarios creados. ¡Empieza creando uno!</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// Componente para tomar un cuestionario
const QuizPage = ({ quiz, onBack, user, db, appId }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);

    const handleOptionSelect = (optionIndex) => {
        setSelectedOption(optionIndex);
    };

    const handleNextQuestion = () => {
        const currentQuestion = quiz.questions[currentQuestionIndex];
        if (selectedOption === currentQuestion.correctAnswer) {
            setScore(prevScore => prevScore + 1);
        }

        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setSelectedOption(null); // Reset selection
        } else {
            // Fin del cuestionario
            setQuizComplete(true);
            saveGrade(score, quiz.questions.length);
        }
    };

    const saveGrade = async (finalScore) => {
        try {
            await addDoc(collection(db, `artifacts/${appId}/public/data/grades`), {
                studentId: user.id,
                quizId: quiz.id,
                courseId: quiz.courseId,
                score: finalScore + (selectedOption === quiz.questions[currentQuestionIndex].correctAnswer ? 1 : 0),
                totalQuestions: quiz.questions.length,
                quizTitle: quiz.title,
                timestamp: new Date()
            });
        } catch (err) {
            console.error("Error al guardar la nota:", err);
        }
    };

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 p-8">
            <button onClick={onBack} className="self-start py-2 px-4 mb-8 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md transition-colors">
                &larr; Volver
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-12 space-y-6">
                <h2 className="text-3xl md:text-4xl font-extrabold text-green-600 dark:text-green-400 mb-4">{quiz.title}</h2>
                {quizComplete ? (
                    <div className="text-center space-y-4">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Cuestionario Completado</h3>
                        <p className="text-xl text-gray-700 dark:text-gray-300">
                            Tu nota es: {score} / {quiz.questions.length}
                        </p>
                    </div>
                ) : (
                    <>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}</h3>
                        <p className="text-lg text-gray-700 dark:text-gray-300">{currentQuestion.questionText}</p>
                        <ul className="space-y-4">
                            {currentQuestion.options.map((option, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => handleOptionSelect(index)}
                                        className={`w-full text-left py-3 px-4 rounded-lg border transition-all duration-200
                                            ${selectedOption === index
                                                ? 'bg-green-500 text-white border-green-500 shadow-md'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {String.fromCharCode(65 + index)}. {option}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={handleNextQuestion}
                            disabled={selectedOption === null}
                            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {currentQuestionIndex < quiz.questions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Cuestionario'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

// Componente principal que maneja la lógica de la aplicación
const App = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('welcome');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    // Variables globales de Firebase (se inyectan en el entorno de Canvas)
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
    const db = getFirestore(initializeApp(firebaseConfig));
    const auth = getAuth(initializeApp(firebaseConfig));

    // Lógica de autenticación
    useEffect(() => {
        const initializeAuth = async () => {
            if (typeof __initial_auth_token !== 'undefined') {
                await signInWithCustomToken(auth, __initial_auth_token);
            } else {
                await signInAnonymously(auth);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // El usuario autenticado es el de Canvas, lo usamos para el ID
            if (user) {
                console.log("Usuario de Firebase autenticado:", user.uid);
            } else {
                console.log("Usuario no autenticado en Firebase.");
            }
        });

        initializeAuth();
        return () => unsubscribe();
    }, [auth]);

    const handleLoginSuccess = (user) => {
        setLoggedInUser(user);
        setCurrentPage('dashboard');
    };

    const handleRegisterSuccess = () => {
        // Redirigir a la página de login después del registro exitoso
        setCurrentPage('login');
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        setCurrentPage('welcome');
    };

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        setCurrentPage('courseDetail');
    };

    const handleBack = () => {
        if (currentPage === 'courseDetail') {
            setSelectedCourse(null);
        } else if (currentPage === 'viewGrades') {
            setSelectedStudent(null);
        } else if (currentPage === 'takeQuiz') {
            setSelectedQuiz(null);
        }
        setCurrentPage('dashboard');
    };

    const handleViewGrades = (student) => {
        setSelectedStudent(student);
        setCurrentPage('viewGrades');
    };

    const handleManageCourses = () => {
        setCurrentPage('manageCourses');
    };

    const handleManageQuizzes = () => {
        setCurrentPage('manageQuizzes');
    };
    
    const handleQuizSelect = (quiz) => {
        setSelectedQuiz(quiz);
        setCurrentPage('takeQuiz');
    };


    // Renderizado condicional basado en el estado de la aplicación
    let content;
    if (loggedInUser) {
        if (selectedCourse) {
            content = <CourseDetailPage course={selectedCourse} onBack={handleBack} db={db} appId={appId} user={loggedInUser} onQuizSelect={handleQuizSelect} />;
        } else if (selectedStudent) {
            content = <GradesPage student={selectedStudent} onBack={handleBack} db={db} appId={appId} isTeacherView={loggedInUser.role === 'teacher'} />;
        } else if (selectedQuiz) {
            content = <QuizPage quiz={selectedQuiz} onBack={() => {setSelectedQuiz(null); setCurrentPage('courseDetail');}} user={loggedInUser} db={db} appId={appId} />;
        } else if (currentPage === 'manageCourses') {
            content = <ManageCoursesPage user={loggedInUser} onBack={handleBack} db={db} appId={appId} />;
        } else if (currentPage === 'manageQuizzes') {
            content = <ManageQuizzesPage user={loggedInUser} onBack={handleBack} db={db} appId={appId} />;
        } else {
            if (loggedInUser.role === 'teacher') {
                content = <TeacherDashboard
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
                content = <StudentDashboard user={loggedInUser} onLogout={handleLogout} onCourseSelect={handleCourseSelect} db={db} appId={appId} onViewGrades={handleViewGrades} />;
            }
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
