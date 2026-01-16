import { useNavigate, useParams } from "react-router-dom";
import { getCourse } from "../../services/getCourse";
import { useEffect, useState } from "react";
import { useLoading } from "../../context/LoadingContext";
import { FaPlay, FaCheckCircle, FaLock } from "react-icons/fa";


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
        // Simulación de carga
        getCourse(cid)
            .then(data => setCurso(data || {}))
            .catch(err => setError(err));
    }, [cid, hideLoader]);

    // Datos simulados
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
            descripcion: "Descripción del contenido...",
        }
    };

    return (
        <div className="curso-page-container">
            {/* HEADER */}
            <header className="curso-header">
                <div className="header-bg-overlay"></div>
                <img className="header-img" src={curso?.thumbnail || "https://via.placeholder.com/1500x500"} alt="Fondo" />
                
                <div className="header-content">
                    <button className="btn-back" onClick={() => navigate(-1)}>← Volver</button>
                    <h1 className="course-title">{curso?.nombre || "Cargando..."}</h1>
                </div>
            </header>

            {/* CONTENIDO PRINCIPAL */}
            <div className="course-body">
                <div className="layout-grid">
                    
                    {/* COLUMNA IZQUIERDA: Video + Info */}
                    <main className="main-content">
                        <div className="video-wrapper">
                            <iframe
                                src="https://www.youtube.com/embed/etCvDtguRzk?si=jj_KYaZp_RDySOg3"
                                title="Video Player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <div className="content-panel">
                            <h2 className="unit-current-title">{cursoF.contenidoActual.titulo}</h2>

                            {/* TABS */}
                            <div className="tabs-container">
                                <button
                                    className={`tab-btn ${activeTab === "apuntes" ? "active" : ""}`}
                                    onClick={() => setActiveTab("apuntes")}
                                >
                                    Contenido
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === "comentarios" ? "active" : ""}`}
                                    onClick={() => setActiveTab("comentarios")}
                                >
                                    Comentarios
                                </button>
                            </div>

                            {/* CONTENIDO DEL TAB */}
                            <div className="tab-content">
                                {activeTab === "apuntes" && (
                                    <>
                                        {/* VISOR PDF */}
                                        <div className="pdf-viewer-container">
                                            <iframe
                                                src={"https://res.cloudinary.com/dmnksm3th/image/upload/v1768573184/anexo-1_tn2kvl.pdf#toolbar=0&navpanes=0&scrollbar=0"}
                                                title="Visor del PDF"
                                            />
                                        </div>
                                        <div className="pdf-fallback">
                                            <a
                                                href={"https://res.cloudinary.com/dmnksm3th/image/upload/v1768573184/anexo-1_tn2kvl.pdf"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                ¿No carga? Abrir PDF en pestaña nueva ↗
                                            </a>
                                        </div>
                                    </>
                                )}
                                {activeTab === "comentarios" && <p>Aquí irían los comentarios...</p>}
                            </div>
                        </div>
                    </main>

                    {/* COLUMNA DERECHA: Playlist (Sidebar) */}
                    <aside className="sidebar-playlist">
                        <div className="sidebar-header">
                            <h3>Contenido del curso</h3>
                            <div className="progress-info">
                                <span>30% Completado</span>
                                <div className="progress-bar"><div className="fill" style={{ width: "30%" }}></div></div>
                            </div>
                        </div>

                        <ul className="unit-list">
                            {cursoF.unidades.map((uni, index) => (
                                <li
                                    key={uni.id}
                                    className={`unit-item ${uni.estado === "actual" ? "active-unit" : ""} ${uni.estado === "candado" ? "locked" : ""}`}
                                    onClick={() => uni.estado !== "candado" && setActiveUnit(index)}
                                >
                                    <div className="unit-status-icon">
                                        {uni.estado === "visto" && <FaCheckCircle className="icon-success" />}
                                        {uni.estado === "actual" && <FaPlay className="icon-play" />}
                                        {uni.estado === "candado" && <FaLock className="icon-lock" />}
                                    </div>
                                    <div className="unit-details">
                                        <span className="u-title">Unidad {index + 1}: {uni.titulo}</span>
                                        <span className="u-time">{uni.duracion} min</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </aside>

                </div>
            </div>
        </div>
    )
}

export default Curso;