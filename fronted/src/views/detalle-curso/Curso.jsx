import  { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourse } from "../../services/getCourse";
import { useLoading } from "../../context/LoadingContext";
import {
    FaPlay, FaFilePdf, FaHeadphones, FaCheckCircle, FaArrowLeft, FaSpinner
} from "react-icons/fa";
// 🔥 Importamos el traductor
import { useTranslation } from 'react-i18next';

const Curso = () => {
    const { t } = useTranslation("global"); // 🔥 Hook de traducción
    const { cid } = useParams();
    const [curso, setCurso] = useState(null);
    const { hideLoader } = useLoading(); 
    
    const [activeUnitIndex, setActiveUnitIndex] = useState(0);
    const [mediaLoading, setMediaLoading] = useState(true);
    
    const navigate = useNavigate();

    useEffect(() => {
        getCourse(cid)
            .then(data => {
                setCurso(data || {});
            })
            .catch(err => {
                console.error(err);
                hideLoader(); 
            });
    }, [cid, hideLoader]);

    const temario = curso?.temario || [];
    const unidadActual = temario[activeUnitIndex] || {};

    const tieneVideo = unidadActual?.video && unidadActual.video.length > 0;
    const tienePdf = unidadActual?.pdf && unidadActual.pdf.length > 0;
    const rawAudio = unidadActual?.audio;
    const listaAudios = Array.isArray(rawAudio) ? rawAudio : (rawAudio ? [rawAudio] : []);
    const tieneAudio = listaAudios.length > 0;

    useEffect(() => {
        setMediaLoading(true); 
        if (!tieneVideo && !tienePdf) {
            setMediaLoading(false);
        }
    }, [activeUnitIndex, tieneVideo, tienePdf]);

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
                        {t("reproductor.titulo_meditaciones")}
                    </h3>
                    <div className="detalle-curso-audio-playlist">
                       {listaAudios.map((item, idx) => {
                                const url = typeof item === 'string' ? item : item.url;
                                // 🔥 Traducimos el nombre de la pista si es "Meditación X"
                                const nombre = typeof item === 'string' 
                                    ? `${t("reproductor.pista")} ${idx + 1}` 
                                    : item.titulo.replace("Meditación", t("reproductor.meditacion"));

                                return (
                                    <div key={idx} className="detalle-curso-audio-track">
                                        <div className="track-info">
                                            <span className="track-number">{idx + 1}.</span>
                                            <span className="track-title">{nombre}</span>
                                        </div>
                                        <audio controls className="track-player custom-audio-player">
                                            <source src={url} />
                                            {t("reproductor.audio_no_soportado")}
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
        
        return <div style={{ padding: '40px', textAlign: 'center', color: '#aaa' }}>{t("reproductor.selecciona_unidad")}</div>;
    };

    if (!curso) {
        return <div style={{ minHeight: "100vh" }}></div>;
    }

    return (
        <div className="detalle-curso-page" style={{ minHeight: "100vh" }}>
            
            <img
                src={curso.thumbnail || 'https://via.placeholder.com/1500'}
                alt="Fondo del curso"
                className="detalle-curso-background-layer"
                onLoad={() => hideLoader()} 
                onError={() => hideLoader()} 
            />

            <header className="detalle-curso-header">
                <div className="header-content-wrapper">
                    <button className="detalle-curso-btn-back" onClick={() => navigate(-1)} aria-label="Volver">
                        <FaArrowLeft />
                    </button>
                    <div className="header-titles-block">
                        <span className="header-category">
                            {t(`navbar.cursos_${curso.categoria?.replace(/ /g, "_")}`, curso.categoria)}
                        </span>
                        <h1 className="header-course-title">
                            {t(`cursos_db.${curso._id}.nombre`, curso.nombre)}
                        </h1>
                    </div>
                </div>
            </header>

            <div className="detalle-curso-container">
                <div className="detalle-curso-grid">
                    
                    <main className="detalle-curso-main-card">
                        <div className="detalle-curso-unit-header">
                            <div className="detalle-curso-unit-meta">
                                {t("reproductor.unidad")} {activeUnitIndex + 1}
                            </div>
                            <h1 className="detalle-curso-unit-title">
                                {/* 🔥 Buscamos traducción del título de la unidad en el JSON */}
                                {t(`cursos_db.${curso._id}.temario.${unidadActual.title?.toLowerCase().replace(/ /g, "_")}`, unidadActual.title)}
                            </h1>
                        </div>

                        {renderPlayer()}

                        <div className="detalle-curso-description">
                            <p>{unidadActual.descripcion}</p>
                            {tieneVideo && tienePdf && (
                                <a href={unidadActual.pdf} target="_blank" rel="noreferrer" className="detalle-curso-btn-download">
                                    <FaFilePdf /> {t("reproductor.descargar_pdf")}
                                </a>
                            )}
                        </div>
                    </main>

                    <aside className="detalle-curso-sidebar">
                        <div className="detalle-curso-sidebar-header">
                            <h3>{t("reproductor.contenido_titulo")}</h3>
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
                                            <span className="item-title">
                                                {index + 1}. {t(`cursos_db.${curso._id}.temario.${tema.title?.toLowerCase().replace(/ /g, "_")}`, tema.title)}
                                            </span>
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