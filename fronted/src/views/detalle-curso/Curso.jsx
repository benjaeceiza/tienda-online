import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourse } from "../../services/getCourse";
import { useLoading } from "../../context/LoadingContext";
import {
    FaPlay, FaFilePdf, FaHeadphones, FaCheckCircle, FaArrowLeft, FaDownload
} from "react-icons/fa";


const Curso = () => {
    const { cid } = useParams();
    const [curso, setCurso] = useState(null);
    const { hideLoader } = useLoading();
    const [activeUnitIndex, setActiveUnitIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        getCourse(cid)
            .then(data => { setCurso(data || {}); hideLoader(); })
            .catch(err => { console.error(err); hideLoader(); });
    }, [cid, hideLoader]);

    // Helpers
    const temario = curso?.temario || [];
    const unidadActual = temario[activeUnitIndex] || {};

    // Detección de tipos
    const tieneVideo = unidadActual?.video && unidadActual.video.length > 0;
    const tienePdf = unidadActual?.pdf && unidadActual.pdf.length > 0;
    const rawAudio = unidadActual?.audio;
    const listaAudios = Array.isArray(rawAudio) ? rawAudio : (rawAudio ? [rawAudio] : []);
    const tieneAudio = listaAudios.length > 0;

    // --- RENDERIZADO DEL REPRODUCTOR (Solo el player, sin titulo) ---
    const renderPlayer = () => {
        if (tieneVideo) {
            return (
                <div className="detalle-curso-video-wrapper">
                    <iframe
                        className="detalle-curso-video-frame"
                        src={unidadActual.video}
                        title="Video Player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            );
        }
        if (tieneAudio) {
            return (
                <div className="detalle-curso-audio-stage">
                    <div className="detalle-curso-audio-icon"><FaHeadphones /></div>

                    {/* Título general del reproductor */}
                    <h3 style={{ margin: "0 0 20px 0", fontWeight: 300, fontSize: "1.5rem" }}>
                        Reproductor de Meditaciones
                    </h3>

                    <div className="detalle-curso-audio-playlist">
                        {listaAudios.map((item, idx) => {
                            // Detectamos si es un objeto nuevo o un string viejo
                            const url = typeof item === 'string' ? item : item.url;
                            const nombre = typeof item === 'string' ? `Pista ${idx + 1}` : item.titulo;

                            return (
                                <div key={idx} className="detalle-curso-audio-track">
                                    {/* Información del track */}
                                    <div className="track-info" style={{ marginBottom: '5px' }}>
                                        <span style={{ fontWeight: 'bold', color: 'var(--accent-color)', marginRight: '8px' }}>
                                            {idx + 1}.
                                        </span>
                                        <span style={{ fontWeight: 500 }}>{nombre}</span>
                                    </div>

                                    {/* El reproductor */}
                                    <audio controls className="track-player" style={{ width: '100%' }}>
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
                    <iframe src={`${unidadActual.pdf}#toolbar=0`} title="Visor PDF" width="100%" height="100%" />
                </div>
            );
        }
        return <div style={{ padding: '40px', textAlign: 'center', color: '#aaa' }}>Selecciona una unidad del temario</div>;
    };

    if (!curso) return null;

    return (
        <div className="detalle-curso-page">
            {/* 1. CAPA DE FONDO (Usa la imagen del curso desenfocada) */}
            <div
                className="detalle-curso-background-layer"
                style={{ backgroundImage: `url(${curso.thumbnail || 'https://via.placeholder.com/1500'})` }}
            ></div>

            {/* 2. HEADER SIMPLE */}
            <header className="detalle-curso-header">
                <div className="header-content-wrapper">
                    {/* Bloque de Títulos agrupados */}
                    <div className="header-titles-block">
                        {/* Categoría (Ej: "SISTEMA DE SANACIÓN...") */}
                        <span className="header-category">
                            {curso.categoria || "Categoría General"}
                        </span>
                        {/* Nombre del Curso (Ej: "Nivel I") */}
                        <h1 className="header-course-title">
                            {curso.nombre}
                        </h1>
                    </div>

                </div>
            </header>

            {/* 3. GRID PRINCIPAL */}
            <div className="detalle-curso-container">
                <div className="detalle-curso-grid">

                    {/* ZONA CENTRAL: TARJETA BLANCA */}
                    <main className="detalle-curso-main-card">

                        {/* A. TÍTULO DE LA UNIDAD (ARRIBA) */}
                        <div className="detalle-curso-unit-header">
                            <div className="detalle-curso-unit-meta">
                                Unidad {activeUnitIndex + 1}
                            </div>
                            <h1 className="detalle-curso-unit-title">
                                {unidadActual.title || "Introducción"}
                            </h1>
                        </div>

                        {/* B. EL REPRODUCTOR (VIDEO/AUDIO/PDF) */}
                        {renderPlayer()}

                        {/* C. DESCRIPCIÓN Y DESCARGAS (ABAJO) */}
                        <div className="detalle-curso-description">
                            <p>{unidadActual.descripcion}</p>

                            {tieneVideo && tienePdf && (
                                <a href={unidadActual.pdf} target="_blank" rel="noreferrer" className="detalle-curso-btn-download">
                                    <FaFilePdf /> Descargar Material PDF
                                </a>
                            )}
                        </div>
                    </main>

                    {/* ZONA LATERAL: TEMARIO */}
                    <aside className="detalle-curso-sidebar">
                        <div className="detalle-curso-sidebar-header">
                            <h3>Contenido del Curso</h3>
                        </div>
                        <ul className="detalle-curso-list">
                            {temario.map((tema, index) => {
                                const isActive = index === activeUnitIndex;
                                let Icono = FaCheckCircle;
                                if (tema.video) Icono = FaPlay;
                                else if (tema.audio) Icono = FaHeadphones;
                                else if (tema.pdf) Icono = FaFilePdf;

                                return (
                                    <li
                                        key={index}
                                        className={`detalle-curso-item ${isActive ? 'active' : ''}`}
                                        onClick={() => setActiveUnitIndex(index)}
                                    >
                                        <div className="detalle-curso-item-icon"><Icono /></div>
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