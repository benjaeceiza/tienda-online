import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importante para que el botón funcione
import { FaCompass } from "react-icons/fa"; // Ícono para la pantalla vacía
import { useAuth } from "../../context/AuthContext";
import { getUserCourses } from "../../services/getUserCourses";
import CardCourse from "./CardCourse";
import { useLoading } from "../../context/LoadingContext";
import FondoMisCursos from "./FondoMisCursos";

const MisCursos = () => {
    const { user } = useAuth();
    const [cursos, setCursos] = useState([]);
    const { hideLoader } = useLoading();
    
    // Estados de carga sincronizados
    const [dataReady, setDataReady] = useState(false);
    const [imgReady, setImgReady] = useState(false);

    // 1. Cargar Datos
    useEffect(() => {
        if (!user) return;
        const token = localStorage.getItem("token");

        getUserCourses(token)
            .then(data => {
                setCursos(data.courses || []);
            })
            .catch(err => console.error(err))
            .finally(() => {
                setDataReady(true);
            });

    }, [user]);

    // 2. Efecto para ocultar Loader cuando AMBOS estén listos
    useEffect(() => {
        if (dataReady && imgReady ) {
            hideLoader();
        }
    }, [dataReady, imgReady, hideLoader]);

    return (
        <main className="mis-cursos-layout">
            
            {/* Componente de Fondo que avisa cuando carga */}
            <FondoMisCursos onImageLoad={() => setImgReady(true)} />

            <div className="mis-cursos-container">
                {cursos.length > 0 ? (
                    <>
                        <div className="header-mis-cursos">
                            <h1>MIS CURSOS</h1>
                            <p>Tu biblioteca de sanación y conocimiento. Accedé a tu contenido aquí.</p>
                            <div className="divider-glow"></div>
                        </div>

                        <section className="grid-cursos">
                            <CardCourse cursos={cursos} />
                        </section>
                    </>
                ) : (
                    /* 🔥 NUEVO ESTADO VACÍO (EMPTY STATE) 🔥 */
                    <div className="mis-cursos-empty-state">
                        <div className="mis-cursos-empty-card">
                            <div className="mis-cursos-empty-icon-wrapper">
                                <FaCompass className="mis-cursos-empty-icon" />
                            </div>
                            <h2 className="mis-cursos-empty-title">Tu viaje comienza aquí</h2>
                            <p className="mis-cursos-empty-text">
                                Aún no tienes cursos en tu biblioteca. Explorá nuestra tienda, descubrí nuevas herramientas de sanación y comenzá a transformar tu energía.
                            </p>
                            <Link to="/" className="mis-cursos-btn-explorar">
                                Volver al inicio
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default MisCursos;