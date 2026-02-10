import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserCourses } from "../../services/getUserCourses";
import CardCourse from "./CardCourse";
import { useLoading } from "../../context/LoadingContext";
import FondoMisCursos from "./FondoMisCursos"; // Importamos el fondo nuevo

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
                setDataReady(true); // Datos listos (hayan o no cursos)
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
                    <div className="empty-state">
                        <div className="empty-card">
                            <h2>Aún no tienes cursos activos</h2>
                            <p>Explorá nuestra tienda para comenzar tu camino.</p>
                            <button className="btn-explorar">Ir a la Tienda</button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default MisCursos;