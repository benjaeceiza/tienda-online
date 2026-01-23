import { useNavigate, useParams } from "react-router-dom";
import { getCourse } from "../../services/getCourse";
import { useEffect, useState } from "react";
import { useLoading } from "../../context/LoadingContext";
import { FaPlay, FaFilePdf, FaList, FaCheckCircle } from "react-icons/fa";

const Curso = () => {
    const { cid } = useParams();
    const [curso, setCurso] = useState(null); // Inicializar en null para manejar la carga
    const [error, setError] = useState(null);
    const { hideLoader } = useLoading();
    const [activeTab, setActiveTab] = useState("apuntes");
    const [activeUnitIndex, setActiveUnitIndex] = useState(0); // Usamos el índice del array

    const navigate = useNavigate();

    useEffect(() => {
        getCourse(cid)
            .then(data => {
                setCurso(data || {});
                hideLoader();
            })
            .catch(err => {
                setError(err);
                hideLoader();
            });
    }, [cid, hideLoader]);

    // LÓGICA: Obtener la unidad actual basada en el índice seleccionado
    // Si curso o temario no existen aún, usamos un objeto vacío para evitar errores
    const temario = curso?.temario || [];
    const unidadActual = temario[activeUnitIndex] || {};

    // Helper para saber si hay video
    const tieneVideo = unidadActual?.video && unidadActual.video.length > 0;
    // Helper para saber si hay PDF
    const tienePdf = unidadActual?.pdf && unidadActual.pdf.length > 0;

    return (
        <div className="curso-page-container">
            {/* HEADER */}
            <header className="curso-header">
                <div className="header-bg-overlay"></div>
                <img
                    className="header-img"
                    src={curso?.thumbnail || "https://via.placeholder.com/1500x500"}
                    alt="Fondo"
                />

                <div className="header-content">
                    <button className="btn-back" onClick={() => navigate(-1)}>← Volver</button>
                    <h1 className="course-title-header">{curso?.nombre || "Cargando curso..."}</h1>
                </div>
            </header>

            {/* CONTENIDO PRINCIPAL */}
            <div className="course-body">
                <div className="layout-grid">

                    {/* COLUMNA IZQUIERDA: Reproductor + Pestañas */}
                    <main className="main-content">
                        {tieneVideo ? (
                            <div className="video-wrapper">
                                <iframe
                                    src={unidadActual.video}
                                    title={unidadActual.titulo}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            ""
                        )}


                        <div className="content-panel">
                            <h2 className="unit-current-title">
                                {unidadActual?.title || "Selecciona una unidad"}
                            </h2>
                            <p className="unit-description">
                                {unidadActual?.descripcion || ""}
                            </p>

                            {/* TABS */}
                            <div className="tabs-container">
                                <button
                                    className={`tab-btn ${activeTab === "apuntes" ? "active" : ""}`}
                                    onClick={() => setActiveTab("apuntes")}
                                >
                                    Apuntes / Recursos
                                </button>
                                
                            </div>

                            {/* CONTENIDO DEL TAB */}
                            <div className="tab-content">
                                {activeTab === "apuntes" && (
                                    <>
                                        {tienePdf ? (
                                            <>
                                                <div className="pdf-viewer-container">
                                                    <iframe
                                                        
                                                        src={`${unidadActual.pdf}#toolbar=0&navpanes=0&scrollbar=0`}
                                                        title="Visor del PDF"
                                                    />
                                                </div>
                                                <div className="pdf-fallback">
                                                    <a
                                                        href={unidadActual.pdf}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        ¿No carga? Abrir PDF en pestaña nueva ↗
                                                    </a>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="no-content-msg">
                                                <p>Esta unidad no tiene material PDF adjunto.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                                
                            </div>
                        </div>
                    </main>

                    {/* COLUMNA DERECHA: Temario (Sidebar) */}
                    <aside className="sidebar-playlist">
                        <div className="sidebar-header">
                            <h3>Temario del curso</h3>
                            {/* Barra de progreso visual (opcional si tienes lógica de completado) */}
                            <div className="progress-info">
                                <span>Contenido del curso</span>
                            </div>
                        </div>

                        <ul className="unit-list">
                            {temario.length > 0 ? (
                                temario.map((tema, index) => {
                                    const isActive = index === activeUnitIndex;

                                    return (
                                        <li
                                            key={index}
                                            className={`unit-item ${isActive ? "active-unit" : ""}`}
                                            onClick={() => setActiveUnitIndex(index)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="unit-status-icon">
                                                {/* Icono dinámico según el tipo de contenido */}
                                                {isActive ? <FaPlay className="icon-play" /> : <FaCheckCircle className="icon-circle" style={{ opacity: 0.3 }} />}
                                            </div>

                                            <div className="unit-details">
                                                <span className="u-title">
                                                    {index + 1}. {tema.title}
                                                </span>
                                                <div className="u-meta">
                                                    {/* Etiquetas pequeñas para saber qué tiene la clase */}
                                                    {tema.video && <span style={{ fontSize: '0.7rem', marginRight: '5px' }}>🎥 Video</span>}
                                                    {tema.pdf && <span style={{ fontSize: '0.7rem' }}>📄 PDF</span>}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })
                            ) : (
                                <p style={{ padding: '20px' }}>Cargando temario...</p>
                            )}
                        </ul>
                    </aside>

                </div>
            </div>
        </div>
    );
}

export default Curso;