import { useNavigate, useParams } from "react-router-dom";
import { getCourse } from "../../services/getCourse";
import { useEffect, useState } from "react";
import { useLoading } from "../../context/LoadingContext";
import { FaPlay, FaCheckCircle, FaLock, FaFileAlt } from "react-icons/fa";


const Curso = () => {

    const { cid } = useParams();
    const [curso, setCurso] = useState();
    const [error, setError] = useState(null);
    const { hideLoader } = useLoading();

    const [activeTab, setActiveTab] = useState("apuntes");
    const [activeUnit, setActiveUnit] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        hideLoader();

        getCourse(cid)
            .then(data => setCurso(data || {}))
            .catch(err => setError(err))
    }, [cid])


    // Datos simulados (esto vendría de tu DB)
    const cursoF = {
        titulo: "Limpieza Energética Avanzada",
        unidades: [
            { id: 0, titulo: "Introducción a la energía", duracion: "10:05", estado: "visto", tipo: "video" },
            { id: 1, titulo: "Herramientas necesarias", duracion: "15:20", estado: "actual", tipo: "video" },
            { id: 2, titulo: "Técnicas de protección", duracion: "12:00", estado: "candado", tipo: "video" },
            { id: 3, titulo: "Cierre y conclusiones", duracion: "08:45", estado: "candado", tipo: "video" },
        ],
        contenidoActual: {
            titulo: "Herramientas necesarias",
            descripcion: `En esta unidad aprenderemos a diferenciar las distintas herramientas para la limpieza. 
      
      Es fundamental comprender que no todas las hierbas funcionan para los mismos propósitos. A continuación detallamos la lista de materiales que vas a necesitar para la práctica... (Aquí iría todo el texto que antes tenías en el PDF, renderizado bonito en HTML).`,
        }
    };



    return (
        <>
            <header className="encabezadoContenidoCurso">
                <img className="bgHeaderContenidoCursos" src={curso?.thumbnail} alt="Fondo" onLoad={() => hideLoader()} />
                <div className="sectionContenido">
                    <div className="buttonGoBackContainer">
                        <button className="buttonGoBack" onClick={() => navigate(-1)}>Volver</button>
                    </div>
                    <h1 className="courseTitleContenido">{curso?.nombre}</h1>
                </div>
            </header>
            <div className="bgColorContenido">
                <div className="courseLayout">
                    <main className="main-content">
                        <div className="video-container">
                            <iframe
                                src="https://www.youtube.com/embed/etCvDtguRzk?si=jj_KYaZp_RDySOg3" // Tu URL aquí
                                title="Video Player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <div className="info-panel">
                            <h1 className="unit-title">{cursoF.contenidoActual.titulo}</h1>

                            {/* TABS DE NAVEGACIÓN */}
                            <div className="tabs-header">
                                <button
                                    className={`tab-btn ${activeTab === "apuntes" ? "active" : ""}`}
                                    onClick={() => setActiveTab("apuntes")}
                                >
                                    Apuntes de la Clase
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === "comentarios" ? "active" : ""}`}
                                    onClick={() => setActiveTab("comentarios")}
                                >
                                    Comentarios
                                </button>
                            </div>

                            <div className="tab-content">
                                {activeTab === "apuntes" && (
                                    <div className="text-content">
                                        {/* Aquí renderizas el HTML de tu base de datos */}
                                        <p>{cursoF.contenidoActual.descripcion}</p>
                                        <div className="tip-box">
                                            <strong>Nota importante:</strong> Recuerda siempre limpiar tus herramientas antes de usarlas.
                                        </div>
                                    </div>
                                )}
                                {activeTab === "comentarios" && <p>Aquí iría la sección de comentarios...</p>}
                            </div>
                        </div>
                    </main >

                    {/* COLUMNA DERECHA: Playlist / Temario */}
                    <aside className="sidebar-playlist">
                        <div className="sidebar-header">
                            <h3>Contenido del curso</h3>
                            <p className="progress-text">30% Completado</p>
                            <div className="progress-bar"><div className="fill" style={{ width: "30%" }}></div></div>
                        </div>

                        <ul className="unit-list">
                            {cursoF.unidades.map((uni, index) => (
                                <li
                                    key={uni.id}
                                    className={`unit-item ${uni.estado === "actual" ? "active-unit" : ""} ${uni.estado === "candado" ? "locked" : ""}`}
                                    onClick={() => setActiveUnit(index)}
                                >
                                    <div className="unit-icon">
                                        {uni.estado === "visto" && <FaCheckCircle color="#4caf50" />}
                                        {uni.estado === "actual" && <FaPlay color="#a515c2" />}
                                        {uni.estado === "candado" && <FaLock color="#666" />}
                                    </div>
                                    <div className="unit-info">
                                        <span className="unit-name">Unidad {index + 1}: {uni.titulo}</span>
                                        <span className="unit-meta">{uni.duracion} min</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>
            </div>
        </>
    )
}

export default Curso;