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
                    console.error("Error al obtener las calificaciones:", error);
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

        const handleAddGrade = async (courseId) => {
            const score = prompt('Introduce la calificación para este curso (0-100):');
            const scoreNum = parseInt(score, 10);
            if (score === null || isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
                return; // Cancelado o inválido
            }

            try {
                const gradeId = `${student.id}_${courseId}`;
                await setDoc(doc(db, `artifacts/${appId}/public/data/grades`, gradeId), {
                    studentId: student.id,
                    courseId: courseId,
                    score: scoreNum,
                    timestamp: new Date().toISOString()
                }, { merge: true });
            } catch (error) {
                console.error("Error al añadir/actualizar la calificación:", error);
            }
        };

        return (
            <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 p-8">
                <button onClick={onBack} className="self-start py-2 px-4 mb-8 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md transition-colors">
                    &larr; Volver
                </button>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-green-600 dark:text-green-400 mb-4">Calificaciones de {student.nombre} {student.apellido}</h2>
                    {loading ? (
                        <p className="text-gray-500 dark:text-gray-400">Cargando calificaciones...</p>
                    ) : (
                        <div className="space-y-4">
                            {courses.map(course => {
                                const grade = grades.find(g => g.courseId === course.id);
                                return (
                                    <div key={course.id} className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                                        <div className="flex-1">
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">{course.title}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{course.description}</p>
                                        </div>
                                        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                                            <p className="text-xl font-bold text-green-600 dark:text-green-400">Nota: {grade ? grade.score : 'N/A'}</p>
                                            {isTeacherView && (
                                                <button onClick={() => handleAddGrade(course.id)} className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors">
                                                    {grade ? 'Actualizar Nota' : 'Añadir Nota'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {grades.length === 0 && (
                                <p className="text-gray-500 dark:text-gray-400">No hay calificaciones registradas para este estudiante.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Componente para la gestión de cursos por el profesor
    const CourseManagementPage = ({ user, onBack, db, appId, onManageQuizzes }) => {
        const [courses, setCourses] = useState([]);
        const [selectedCourse, setSelectedCourse] = useState(null);
        const [newCourseTitle, setNewCourseTitle] = useState('');
        const [newCourseDescription, setNewCourseDescription] = useState('');
        const [newContent, setNewContent] = useState('');
        const [contentType, setContentType] = useState('text');
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');

        useEffect(() => {
            if (!db || !appId || !user) return;

            const coursesRef = collection(db, `artifacts/${appId}/public/data/courses`);
            const q = query(coursesRef, where("professorId", "==", user.id));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedCourses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCourses(fetchedCourses);
                setLoading(false);
                if (selectedCourse) {
                    const updatedSelectedCourse = fetchedCourses.find(c => c.id === selectedCourse.id);
                    setSelectedCourse(updatedSelectedCourse || null);
                }
            }, (error) => {
                console.error("Error al obtener los cursos:", error);
                setLoading(false);
            });
            return () => unsubscribe();
        }, [db, appId, user, selectedCourse]);

        const createCourse = async () => {
            setError('');
            if (!newCourseTitle.trim() || !newCourseDescription.trim()) {
                setError('El título y la descripción del curso son obligatorios.');
                return;
            }

            try {
                await addDoc(collection(db, `artifacts/${appId}/public/data/courses`), {
                    title: newCourseTitle,
                    description: newCourseDescription,
                    content: [],
                    professorId: user.id,
                    professorName: `${user.nombre} ${user.apellido}`,
                    createdAt: new Date().toISOString()
                });
                setNewCourseTitle('');
                setNewCourseDescription('');
            } catch (err) {
                console.error("Error al crear el curso:", err);
                setError('Hubo un error al crear el curso. Por favor, inténtalo de nuevo.');
            }
        };

        const deleteCourse = async (courseId) => {
            if (!window.confirm('¿Estás seguro de que quieres eliminar este curso?')) {
                return;
            }
            try {
                await deleteDoc(doc(db, `artifacts/${appId}/public/data/courses`, courseId));
                if (selectedCourse && selectedCourse.id === courseId) {
                    setSelectedCourse(null);
                }
            } catch (error) {
                console.error('Error al eliminar el curso:', error);
            }
        };

        const addContent = async () => {
            if (!newContent.trim() || !selectedCourse) return;

            try {
                const courseDocRef = doc(db, `artifacts/${appId}/public/data/courses`, selectedCourse.id);
                const newContentArray = [...(selectedCourse.content || [])];
                const contentValue = newContent.trim();
                const contentToAdd = { type: contentType, value: contentValue };

                if (contentType === 'video') {
                    const videoId = getYouTubeId(contentValue);
                    if (!videoId) {
                        alert('URL de YouTube no válida. Por favor, ingresa una URL correcta.');
                        return;
                    }
                    contentToAdd.value = `https://www.youtube.com/watch?v=${videoId}`;
                }

                newContentArray.push(contentToAdd);

                await updateDoc(courseDocRef, { content: newContentArray });
                setNewContent('');
            } catch (error) {
                console.error('Error al agregar contenido:', error);
            }
        };

        return (
            <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 p-8">
                <button onClick={onBack} className="self-start py-2 px-4 mb-8 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md transition-colors">
                    &larr; Volver al Dashboard
                </button>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-12 w-full max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Gestionar Cursos y Contenido</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna de Cursos */}
                        <div className="lg:col-span-1">
                            <h3 className="text-2xl font-bold text-blue-600 mb-4">Mis Cursos</h3>
                            <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                                <h4 className="text-lg font-semibold mb-2">Crear Nuevo Curso</h4>
                                <input
                                    type="text"
                                    value={newCourseTitle}
                                    onChange={(e) => setNewCourseTitle(e.target.value)}
                                    placeholder="Título del curso"
                                    className="w-full p-3 mb-2 rounded-xl border border-gray-300"
                                />
                                <textarea
                                    value={newCourseDescription}
                                    onChange={(e) => setNewCourseDescription(e.target.value)}
                                    placeholder="Descripción del curso"
                                    className="w-full p-3 mb-2 rounded-xl border border-gray-300 resize-none"
                                    rows="3"
                                />
                                {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
                                <button
                                    onClick={createCourse}
                                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Crear Curso
                                </button>
                            </div>
                            <div className="space-y-4">
                                {loading ? (
                                    <p>Cargando cursos...</p>
                                ) : courses.length > 0 ? (
                                    courses.map(course => (
                                        <div
                                            key={course.id}
                                            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${
                                                selectedCourse && selectedCourse.id === course.id
                                                    ? 'bg-blue-100 border-blue-500 border-2'
                                                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                            onClick={() => setSelectedCourse(course)}
                                        >
                                            <span className="text-lg font-medium truncate">{course.title}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteCourse(course.id);
                                                }}
                                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No hay cursos creados.</p>
                                )}
                            </div>
                        </div>

                        {/* Columna de Contenido */}
                        <div className="lg:col-span-2">
                            {selectedCourse ? (
                                <>
                                    <div className="mb-6 border-b pb-4 border-gray-200">
                                        <h3 className="text-3xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h3>
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => setSelectedCourse(course => ({ ...course, currentView: 'content' }))}
                                                className={`py-2 px-4 rounded-xl font-semibold transition-colors ${
                                                    selectedCourse.currentView !== 'quizzes' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                Contenido del Curso
                                            </button>
                                            <button
                                                onClick={() => onManageQuizzes(selectedCourse)}
                                                className={`py-2 px-4 rounded-xl font-semibold transition-colors ${
                                                    selectedCourse.currentView === 'quizzes' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                Gestionar Cuestionarios
                                            </button>
                                        </div>
                                    </div>

                                    {/* Panel de Gestión de Contenido */}
                                    <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                                        <h4 className="text-xl font-semibold mb-3">Agregar Contenido</h4>
                                        <div className="flex gap-2 mb-3">
                                            <button
                                                onClick={() => setContentType('text')}
                                                className={`flex-1 py-2 rounded-xl font-semibold transition-colors ${
                                                    contentType === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                Texto
                                            </button>
                                            <button
                                                onClick={() => setContentType('video')}
                                                className={`flex-1 py-2 rounded-xl font-semibold transition-colors ${
                                                    contentType === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                Video
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newContent}
                                                onChange={(e) => setNewContent(e.target.value)}
                                                placeholder={contentType === 'text' ? 'Escribe aquí tu texto...' : 'Pega la URL de YouTube...'}
                                                className="flex-grow p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                onClick={addContent}
                                                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                                            >
                                                Añadir
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        {(selectedCourse.content && selectedCourse.content.length > 0) ? (
                                            selectedCourse.content.map((item, index) => (
                                                <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                                    {item.type === 'text' ? (
                                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{item.value}</p>
                                                    ) : (
                                                        <div className="relative overflow-hidden rounded-xl" style={{ paddingTop: '56.25%' }}>
                                                            <iframe
                                                                className="absolute top-0 left-0 w-full h-full"
                                                                src={`https://www.youtube.com/embed/${getYouTubeId(item.value)}`}
                                                                frameBorder="0"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                            ></iframe>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-gray-500">
                                                <p className="text-xl">¡Este curso está vacío!</p>
                                                <p className="mt-2 text-sm">Usa el formulario de arriba para añadir texto o videos.</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full text-center text-gray-500">
                                    <p className="text-xl">Selecciona un curso de la lista o crea uno nuevo para empezar.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Componente para la gestión de cuestionarios por curso
    const QuizManagementPage = ({ course, onBack, db, appId }) => {
        const [quizzes, setQuizzes] = useState([]);
        const [loading, setLoading] = useState(true);
        const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
        const [quizTitle, setQuizTitle] = useState('');
        const [questions, setQuestions] = useState([{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);

        useEffect(() => {
            if (!db || !appId || !course) return;

            const quizzesRef = collection(db, `artifacts/${appId}/public/data/quizzes`);
            const q = query(quizzesRef, where("courseId", "==", course.id));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedQuizzes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setQuizzes(fetchedQuizzes);
                setLoading(false);
            }, (error) => {
                console.error("Error al obtener los cuestionarios:", error);
                setLoading(false);
            });
            return () => unsubscribe();
        }, [db, appId, course]);

        const handleAddQuestion = () => {
            setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
        };

        const handleQuestionChange = (index, field, value) => {
            const newQuestions = [...questions];
            newQuestions[index][field] = value;
            setQuestions(newQuestions);
        };

        const handleOptionChange = (qIndex, oIndex, value) => {
            const newQuestions = [...questions];
            newQuestions[qIndex].options[oIndex] = value;
            setQuestions(newQuestions);
        };

        const handleCreateQuiz = async () => {
            if (!quizTitle || questions.some(q => !q.questionText || !q.correctAnswer || q.options.some(o => !o))) {
                alert('Por favor, completa todos los campos del cuestionario.');
                return;
            }

            setLoading(true);
            try {
                await addDoc(collection(db, `artifacts/${appId}/public/data/quizzes`), {
                    title: quizTitle,
                    courseId: course.id,
                    questions: questions,
                    createdAt: new Date().toISOString()
                });
                setQuizTitle('');
                setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
                setIsCreatingQuiz(false);
            } catch (err) {
                console.error("Error al crear el cuestionario:", err);
                alert('Hubo un error al crear el cuestionario.');
            } finally {
                setLoading(false);
            }
        };

        const handleDeleteQuiz = async (quizId) => {
            if (!window.confirm('¿Estás seguro de que quieres eliminar este cuestionario?')) {
                return;
            }
            try {
                await deleteDoc(doc(db, `artifacts/${appId}/public/data/quizzes`, quizId));
            } catch (error) {
                console.error("Error al eliminar el cuestionario:", error);
                alert('Hubo un error al eliminar el cuestionario.');
            }
        };

        return (
            <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 p-8">
                <button onClick={onBack} className="self-start py-2 px-4 mb-8 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md transition-colors">
                    &larr; Volver a Mis Cursos
                </button>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-12 w-full max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Gestionar Cuestionarios para: {course.title}</h2>
                    {isCreatingQuiz ? (
                        <div className="space-y-6">
                            <input
                                type="text"
                                value={quizTitle}
                                onChange={(e) => setQuizTitle(e.target.value)}
                                className="w-full px-4 py-2 text-2xl font-bold border rounded-lg dark:bg-gray-700 dark:text-white"
                                placeholder="Título del Cuestionario"
                            />
                            {questions.map((q, qIndex) => (
                                <div key={qIndex} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                                    <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Pregunta {qIndex + 1}</h4>
                                    <input
                                        type="text"
                                        value={q.questionText}
                                        onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:text-white"
                                        placeholder="Texto de la pregunta"
                                    />
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.options.map((option, oIndex) => (
                                            <div key={oIndex} className="flex items-center">
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:text-white"
                                                    placeholder={`Opción ${oIndex + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Respuesta Correcta</label>
                                        <input
                                            type="text"
                                            value={q.correctAnswer}
                                            onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:text-white"
                                            placeholder="Introduce la respuesta correcta"
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between">
                                <button
                                    onClick={handleAddQuestion}
                                    className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Añadir Pregunta
                                </button>
                                <button
                                    onClick={handleCreateQuiz}
                                    className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Crear Cuestionario
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsCreatingQuiz(true)}
                                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                            >
                                Crear Nuevo Cuestionario
                            </button>
                            <div className="mt-8 space-y-4">
                                {loading ? (
                                    <p className="text-gray-500 dark:text-gray-400">Cargando cuestionarios...</p>
                                ) : quizzes.length > 0 ? (
                                    quizzes.map(quiz => (
                                        <div key={quiz.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                                            <div className="flex-1">
                                                <h4 className="text-xl font-semibold text-gray-800 dark:text-white">{quiz.title}</h4>
                                                <p className="text-gray-600 dark:text-gray-400 mt-2">{quiz.questions.length} preguntas</p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteQuiz(quiz.id)}
                                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">No hay cuestionarios creados para este curso.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    // Componente del Dashboard para estudiantes
    const StudentDashboard = ({ user, onLogout, onCourseSelect, db, appId, onViewGrades }) => {
        const [courses, setCourses] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            if (!db || !appId) return;

            const coursesRef = collection(db, `artifacts/${appId}/public/data/courses`);
            const unsubscribe = onSnapshot(coursesRef, (snapshot) => {
                const fetchedCourses = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                fetchedCourses.sort((a, b) => a.title.localeCompare(b.title));
                setCourses(fetchedCourses);
                setLoading(false);
            }, (error) => {
                console.error("Error al obtener los cursos:", error);
                setLoading(false);
            });
            return () => unsubscribe();
        }, [db, appId]);

        return (
            <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
                <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">Saviare</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-lg font-medium text-gray-800 dark:text-gray-200 hidden md:block">
                            Bienvenido, {user.nombre}
                        </span>
                        <button onClick={() => onViewGrades(user)} className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors">
                            Ver Calificaciones
                        </button>
                        <button onClick={onLogout} className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors">
                            Cerrar sesión
                        </button>
                    </div>
                </header>
                <main className="flex-1 p-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 md:hidden">
                        Bienvenido, {user.nombre}
                    </h2>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-8 mb-4">Mis Cursos</h2>
                    {loading ? (
                        <p className="text-gray-500 dark:text-gray-400">Cargando cursos...</p>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {courses.length > 0 ? (
                                courses.map(course => (
                                    <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 transform hover:scale-[1.02] cursor-pointer" onClick={() => onCourseSelect(course)}>
                                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{course.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
                                        <button className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors">
                                            Ir al curso
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No hay cursos disponibles. Pídele a tu profesor que cree algunos.</p>
                            )}
                        </div>
                    )}
                </main>
            </div>
        );
    };

    // Componente del Dashboard para profesores
    const TeacherDashboard = ({ user, onLogout, db, appId, onViewGrades, onManageCourses, onManageQuizzes, onCourseSelect }) => {
        const [allStudents, setAllStudents] = useState([]);
        const [myCourses, setMyCourses] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            if (!db || !appId) return;
            const studentsRef = collection(db, `artifacts/${appId}/public/data/users`);
            const q = query(studentsRef, where("role", "==", "student"));
            const unsubscribeStudents = onSnapshot(q, (snapshot) => {
                const fetchedStudents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllStudents(fetchedStudents);
                setLoading(false);
            }, (error) => {
                console.error("Error al obtener los estudiantes:", error);
                setLoading(false);
            });

            const coursesRef = collection(db, `artifacts/${appId}/public/data/courses`);
            const coursesQuery = query(coursesRef, where("professorId", "==", user.id));
            const unsubscribeCourses = onSnapshot(coursesQuery, (snapshot) => {
                const fetchedCourses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMyCourses(fetchedCourses);
            }, (error) => {
                console.error("Error al obtener mis cursos:", error);
            });

            return () => {
                unsubscribeStudents();
                unsubscribeCourses();
            };
        }, [db, appId, user.id]);

        // Separa los estudiantes asignados de los no asignados
        const myStudents = allStudents.filter(student => student.professorId === user.id);
        const unassignedStudents = allStudents.filter(student => !student.professorId);

        const handleAssignStudent = async (studentId) => {
            try {
                const studentRef = doc(db, `artifacts/${appId}/public/data/users`, studentId);
                await updateDoc(studentRef, { professorId: user.id });
            } catch (error) {
                console.error("Error al asignar estudiante:", error);
            }
        };

        const handleDeassignStudent = async (studentId) => {
            try {
                const studentRef = doc(db, `artifacts/${appId}/public/data/users`, studentId);
                await updateDoc(studentRef, { professorId: null });
            } catch (error) {
                console.error("Error al desasignar estudiante:", error);
            }
        };

        return (
            <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
                <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">Saviare</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-lg font-medium text-gray-800 dark:text-gray-200 hidden md:block">
                            Bienvenido, Profesor {user.nombre}
                        </span>
                        <button onClick={onLogout} className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors">
                            Cerrar sesión
                        </button>
                    </div>
                </header>
                <main className="flex-1 p-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Panel del Profesor</h2>

                    {/* Mis Estudiantes */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-8 mb-4">Mis Estudiantes ({myStudents.length})</h3>
                        {loading ? (
                            <p className="text-gray-500 dark:text-gray-400">Cargando estudiantes...</p>
                        ) : (
                            <div className="space-y-4">
                                {myStudents.length > 0 ? (
                                    myStudents.map(student => (
                                        <div key={student.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col sm:flex-row justify-between items-center">
                                            <p className="text-lg font-medium text-gray-900 dark:text-white">{student.nombre} {student.apellido}</p>
                                            <div className="flex space-x-2 mt-2 sm:mt-0">
                                                <button onClick={() => onViewGrades(student)} className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
                                                    Ver Calificaciones
                                                </button>
                                                <button onClick={() => handleDeassignStudent(student.id)} className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors">
                                                    Desasignar
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">Aún no tienes estudiantes asignados.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Estudiantes sin Asignar */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-8 mb-4">Estudiantes sin Asignar ({unassignedStudents.length})</h3>
                        {loading ? (
                            <p className="text-gray-500 dark:text-gray-400">Cargando estudiantes...</p>
                        ) : (
                            <div className="space-y-4">
                                {unassignedStudents.length > 0 ? (
                                    unassignedStudents.map(student => (
                                        <div key={student.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col sm:flex-row justify-between items-center">
                                            <p className="text-lg font-medium text-gray-900 dark:text-white">{student.nombre} {student.apellido}</p>
                                            <button onClick={() => handleAssignStudent(student.id)} className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors mt-2 sm:mt-0">
                                                Asignar
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">No hay estudiantes sin asignar.</p>
                                )}
                            </div>
                        )}
                    </div>
                    {/* Mis Cursos */}
                    <div className="mt-12">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Mis Cursos</h3>
                            <button onClick={onManageCourses} className="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-colors">
                                Gestionar Cursos
                            </button>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {myCourses.length > 0 ? (
                                myCourses.map(course => (
                                    <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 transform hover:scale-[1.02] cursor-pointer">
                                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{course.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
                                        <div className="flex space-x-2">
                                            <button onClick={() => onCourseSelect(course)} className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
                                                Ver Contenido
                                            </button>
                                            <button onClick={() => onManageQuizzes(course)} className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors">
                                                Cuestionarios
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">Aún no has creado ningún curso. Usa el botón "Gestionar Cursos".</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        );
    };


    // Componente principal de la aplicación
    const App = () => {
        const [currentPage, setCurrentPage] = useState('welcome');
        const [loggedInUser, setLoggedInUser] = useState(null);
        const [db, setDb] = useState(null);
        const [appId, setAppId] = useState(null);
        const [isAppReady, setIsAppReady] = useState(false);
        const [selectedCourse, setSelectedCourse] = useState(null);
        const [selectedStudent, setSelectedStudent] = useState(null);
        const [manageQuizzesForCourse, setManageQuizzesForCourse] = useState(null);

        useEffect(() => {
            const initializeAppAndAuth = async () => {
                try {
                    const currentAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
                    setAppId(currentAppId);

                    const firebaseConfig = {
                        apiKey: "AIzaSyDK7OjicIcB94q3PRA5RmxBxcRBc1qZzLY",
                        authDomain: "saviare-df1e2.firebaseapp.com",
                        projectId: "saviare-df1e2",
                        storageBucket: "saviare-df1e2.firebasestorage.app",
                        messagingSenderId: "1043459076531",
                        appId: "1:1043459076531:web:efc5d27d88f78d57d79bc6"
                    };

                    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

                    const app = initializeApp(firebaseConfig);
                    const auth = getAuth(app);
                    const firestoreDb = getFirestore(app);
                    setDb(firestoreDb);

                    await new Promise(resolve => {
                        const unsubscribe = onAuthStateChanged(auth, user => {
                            if (!user) {
                                if (initialAuthToken) {
                                    signInWithCustomToken(auth, initialAuthToken).catch(error => {
                                        console.error("Error al iniciar sesión con el token de usuario:", error);
                                        signInAnonymously(auth);
                                    });
                                } else {
                                    signInAnonymously(auth);
                                }
                            }
                            unsubscribe();
                            resolve();
                        });
                    });

                } catch (error) {
                    console.error("Error al inicializar Firebase:", error);
                } finally {
                    setIsAppReady(true);
                }
            };
            initializeAppAndAuth();
        }, []);

        const handleLoginSuccess = (user) => {
            setLoggedInUser(user);
            setCurrentPage('dashboard');
        };

        const handleRegisterSuccess = () => {
            setCurrentPage('login');
        };

        const handleLogout = () => {
            setLoggedInUser(null);
            setCurrentPage('welcome');
            setSelectedCourse(null);
            setSelectedStudent(null);
            setManageQuizzesForCourse(null);
        };

        const handleCourseSelect = (course) => {
            setSelectedCourse(course);
            setCurrentPage('courseDetail');
        };

        const handleBackToDashboard = () => {
            setSelectedCourse(null);
            setSelectedStudent(null);
            setManageQuizzesForCourse(null);
            setCurrentPage('dashboard');
        };

        const handleManageCourses = () => {
            setCurrentPage('manageCourses');
        };

        const handleViewGrades = (student) => {
            setSelectedStudent(student);
            setCurrentPage('grades');
        };

        const handleManageQuizzes = (course) => {
            setManageQuizzesForCourse(course);
            setCurrentPage('manageQuizzes');
        };


        if (!isAppReady) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                    <p className="text-gray-600 dark:text-gray-300">Cargando...</p>
                </div>
            );
        }

        let content;
        if (currentPage === 'courseDetail' && selectedCourse) {
            content = <CourseDetailPage course={selectedCourse} onBack={handleBackToDashboard} db={db} appId={appId} />;
        } else if (currentPage === 'grades' && selectedStudent) {
            const isTeacherView = loggedInUser.role === 'teacher';
            content = <GradesPage student={selectedStudent} onBack={handleBackToDashboard} db={db} appId={appId} isTeacherView={isTeacherView} />;
        } else if (loggedInUser) {
            if (loggedInUser.role === 'teacher') {
                if (currentPage === 'manageCourses') {
                    content = <CourseManagementPage user={loggedInUser} onBack={handleBackToDashboard} db={db} appId={appId} onManageQuizzes={handleManageQuizzes} />;
                } else if (currentPage === 'manageQuizzes' && manageQuizzesForCourse) {
                    content = <QuizManagementPage course={manageQuizzesForCourse} onBack={handleBackToDashboard} db={db} appId={appId} />;
                } else {
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
                }
            } else {
                content = <StudentDashboard user={loggedInUser} onLogout={handleLogout} onCourseSelect={handleCourseSelect} db={db} appId={appId} onViewGrades={handleViewGrades} />;
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
