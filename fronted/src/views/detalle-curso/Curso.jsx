import  { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourse } from "../../services/getCourse";
import { useLoading } from "../../context/LoadingContext";
import {
    FaPlay, FaFilePdf, FaHeadphones, FaCheckCircle, FaArrowLeft, FaSpinner
} from "react-icons/fa";

const Curso = () => {
    const { cid } = useParams();
    const [curso, setCurso] = useState(null);
    const { hideLoader } = useLoading(); // Tu loader general
    
    const [activeUnitIndex, setActiveUnitIndex] = useState(0);
    const [mediaLoading, setMediaLoading] = useState(true);
    
    const navigate = useNavigate();

    // 1. CARGA DE DATOS (Súper limpio, sin apagar el loader)
    useEffect(() => {
        getCourse(cid)
            .then(data => {
                setCurso(data || {});
                // 🔥 NUNCA apagamos el loader acá. Dejamos que la <img> de abajo lo haga.
            })
            .catch(err => {
                console.error(err);
                hideLoader(); // Solo si hay error lo apagamos para no trabar al usuario
            });
    }, [cid, hideLoader]);

    const temario = curso?.temario || [];
    const unidadActual = temario[activeUnitIndex] || {};

    const tieneVideo = unidadActual?.video && unidadActual.video.length > 0;
    const tienePdf = unidadActual?.pdf && unidadActual.pdf.length > 0;
    const rawAudio = unidadActual?.audio;
    const listaAudios = Array.isArray(rawAudio) ? rawAudio : (rawAudio ? [rawAudio] : []);
    const tieneAudio = listaAudios.length > 0;

    // 2. EFECTO PARA LOS MINI-LOADERS AL CAMBIAR DE UNIDAD (Video/PDF)
    useEffect(() => {
        setMediaLoading(true); 
        if (!tieneVideo && !tienePdf) {
            setMediaLoading(false);
        }
    }, [activeUnitIndex, tieneVideo, tienePdf]);

    // --- RENDERIZADO DEL REPRODUCTOR ---
    const renderPlayer = () => {
        if (tieneVideo) {
            return (
                <div className="detalle-curso-video-wrapper">
                    {mediaLoading && (
                        <div className="detalle-curso-media-loader">
                            <FaSpinner className="detalle-curso-spinner-icon" />
                        </div>
                    )}
                    <iframe
                        className="detalle-curso-video-frame"
                        src={`${unidadActual.video}?autoplay=false`}
                        title="Video Player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => setMediaLoading(false)} 
                        style={{ opacity: mediaLoading ? 0 : 1 }} 
                    ></iframe>
                </div>
            );
        }
        
        if (tieneAudio) {
            return (
                <div className="detalle-curso-audio-stage">
                    <div className="detalle-curso-audio-icon"><FaHeadphones /></div>
                    <h3 style={{ margin: "0 0 20px 0", fontWeight: 300, fontSize: "1.5rem" }}>
                        Reproductor de Meditaciones
                    </h3>
                    <div className="detalle-curso-audio-playlist">
                       {listaAudios.map((item, idx) => {
                                const url = typeof item === 'string' ? item : item.url;
                                const nombre = typeof item === 'string' ? `Pista ${idx + 1}` : item.titulo;

                                return (
                                    <div key={idx} className="detalle-curso-audio-track">
                                        
                                        {/* 🔥 TÍTULO ARRIBA */}
                                        <div className="track-info">
                                            <span className="track-number">{idx + 1}.</span>
                                            <span className="track-title">{nombre}</span>
                                        </div>
                                        
                                        {/* 🔥 REPRODUCTOR ABAJO */}
                                        <audio controls className="track-player custom-audio-player">
                                            <source src={url} />
                                            Tu navegador no soporta audio.
                                        </audio>
                                        
                                    </div>
                                );
                            })}
                    </div>
                </div>
            );
        }
        
        if (tienePdf) {
            return (
                <div className="detalle-curso-pdf-stage">
                    {mediaLoading && (
                        <div className="detalle-curso-media-loader">
                            <FaSpinner className="detalle-curso-spinner-icon" />
                        </div>
                    )}
                    <iframe 
                        src={`${unidadActual.pdf}#toolbar=0`} 
                        title="Visor PDF" 
                        className="detalle-curso-pdf-frame"
                        onLoad={() => setMediaLoading(false)} 
                        style={{ opacity: mediaLoading ? 0 : 1 }}
                    />
                </div>
            );
        }
        
        return <div style={{ padding: '40px', textAlign: 'center', color: '#aaa' }}>Selecciona una unidad del temario</div>;
    };

    // 🔥 TRUCO PARA EL FOOTER: Si todavía no hay curso, devolvemos un div invisible de 100vh.
    // Esto hace que el footer se vaya para abajo inmediatamente, pero el usuario
    // no ve este div porque tu Loader General está tapando toda la pantalla.
    if (!curso) {
        return <div style={{ minHeight: "100vh" }}></div>;
    }

    return (
        <div className="detalle-curso-page" style={{ minHeight: "100vh" }}>
            
            {/* 🔥 TU IDEA HECHA REALIDAD: Esta <img> es un componente real de React.
                El navegador NO disparará onLoad hasta que sus píxeles estén listos 
                y todo el HTML de abajo ya esté armado. */}
            <img
                src={curso.thumbnail || 'https://via.placeholder.com/1500'}
                alt="Fondo del curso"
                className="detalle-curso-background-layer"
                onLoad={() => hideLoader()}   // <- El loader general muere ACÁ
                onError={() => hideLoader()}  // (Por si falla la imagen de Cloudinary)
            />

            <header className="detalle-curso-header">
                <div className="header-content-wrapper">
                    <button className="detalle-curso-btn-back" onClick={() => navigate(-1)} aria-label="Volver">
                        <FaArrowLeft />
                    </button>
                    <div className="header-titles-block">
                        <span className="header-category">
                            {curso.categoria || "Categoría General"}
                        </span>
                        <h1 className="header-course-title">
                            {curso.nombre}
                        </h1>
                    </div>
                </div>
            </header>

            <div className="detalle-curso-container">
                <div className="detalle-curso-grid">
                    
                    <main className="detalle-curso-main-card">
                        <div className="detalle-curso-unit-header">
                            <div className="detalle-curso-unit-meta">
                                Unidad {activeUnitIndex + 1}
                            </div>
                            <h1 className="detalle-curso-unit-title">
                                {unidadActual.title || "Introducción"}
                            </h1>
                        </div>

                        {renderPlayer()}

                        <div className="detalle-curso-description">
                            <p>{unidadActual.descripcion}</p>
                            {tieneVideo && tienePdf && (
                                <a href={unidadActual.pdf} target="_blank" rel="noreferrer" className="detalle-curso-btn-download">
                                    <FaFilePdf /> Descargar Material PDF
                                </a>
                            )}
                        </div>
                    </main>

                    <aside className="detalle-curso-sidebar">
                        <div className="detalle-curso-sidebar-header">
                            <h3>Contenido del Curso</h3>
                        </div>
                        <ul className="detalle-curso-list">
                            {temario.map((tema, index) => {
                                const isActive = index === activeUnitIndex;
                                
                                let Icono = FaCheckCircle;
                                if (isActive && mediaLoading) Icono = FaSpinner; 
                                else if (tema.video) Icono = FaPlay;
                                else if (tema.audio) Icono = FaHeadphones;
                                else if (tema.pdf) Icono = FaFilePdf;

                                return (
                                    <li
                                        key={index}
                                        className={`detalle-curso-item ${isActive ? 'active' : ''} ${isActive && mediaLoading ? 'loading' : ''}`}
                                        onClick={() => setActiveUnitIndex(index)}
                                    >
                                        <div className="detalle-curso-item-icon">
                                            <Icono className={isActive && mediaLoading ? 'detalle-curso-spin' : ''} />
                                        </div>
                                        <div className="detalle-curso-item-info">
                                            <span className="item-title">{index + 1}. {tema.title}</span>
                                            <div className="item-tags">
                                                {tema.video && <span className="tag video">Video</span>}
                                                {tema.audio && <span className="tag audio">Audio</span>}
                                                {tema.pdf && <span className="tag pdf">PDF</span>}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </aside>

                </div>
            </div>
        </div>
    );
};

export default Curso;