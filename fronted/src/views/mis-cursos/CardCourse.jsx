import { useState } from "react";
import { Link } from "react-router-dom";

// Creamos un sub-componente para manejar el estado de carga individual de cada tarjeta
const CourseItem = ({ c }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        // Le agregamos position relative para que el loader absoluto se quede adentro de la tarjeta
        <article className="course-card" style={{ position: "relative" }}>
            
            {/* --- LOADER SKELETON (Se muestra por encima mientras carga) --- */}
            {!isLoaded && (
                <div className="card-skeleton-overlay">
                    <div className="skeleton-thumb"></div>
                    {/* Reutilizamos tu clase card-content para que los márgenes sean idénticos */}
                    <div className="card-content">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-desc"></div>
                        <div className="skeleton-btn"></div>
                    </div>
                </div>
            )}

            {/* --- CONTENIDO ORIGINAL --- */}
            {/* Sigue renderizado para descargar la foto, pero oculto con opacidad hasta estar listo */}
            <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, opacity: isLoaded ? 1 : 0, transition: "opacity 0.4s ease" }}>
                
                {/* Imagen / Thumbnail */}
                <div className="card-thumb-container">
                    <img 
                        src={c.course?.thumbnail || "https://via.placeholder.com/300"} 
                        alt={c.course?.nombre} 
                        className="card-thumb"
                        onLoad={() => setIsLoaded(true)}  // 🔥 La magia: saca el loader cuando la imagen carga
                        onError={() => setIsLoaded(true)} // Si la imagen falla, muestra la tarjeta igual
                    />
                    <span className="status-badge">Activo</span>
                </div>

                {/* Contenido */}
                <div className="card-content">
                    <h3 className="card-title">{c.course?.nombre}</h3>
                    <p className="card-desc">
                        {c.course?.descripcion 
                            ? c.course.descripcion.substring(0, 80) + "..." 
                            : "Sin descripción disponible."}
                    </p>
                    
                    <Link to={"/curso/" + c.course?._id} className="btn-acceder">
                        INGRESAR AL CURSO
                    </Link>
                </div>
            </div>

        </article>
    );
};

const CardCourse = ({ cursos }) => {
    return (
        <>
            {cursos.map((c) => (
                <CourseItem key={c.course?._id || Math.random()} c={c} />
            ))}
        </>
    );
};

export default CardCourse;