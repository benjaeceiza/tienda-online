import { useState } from "react";
import { Link } from "react-router-dom";
// 🔥 Importamos el traductor
import { useTranslation } from 'react-i18next';

const CourseItem = ({ c }) => {
    const { t } = useTranslation("global");
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <article className="course-card" style={{ position: "relative" }}>
            
            {!isLoaded && (
                <div className="card-skeleton-overlay">
                    <div className="skeleton-thumb"></div>
                    <div className="card-content">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-desc"></div>
                        <div className="skeleton-btn"></div>
                    </div>
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, opacity: isLoaded ? 1 : 0, transition: "opacity 0.4s ease" }}>
                
                <div className="card-thumb-container">
                    <img 
                        src={c.course?.thumbnail || "https://via.placeholder.com/300"} 
                        alt={c.course?.nombre} 
                        className="card-thumb"
                        onLoad={() => setIsLoaded(true)}
                        onError={() => setIsLoaded(true)}
                    />
                    {/* 🔥 Etiqueta de estado traducida */}
                    <span className="status-badge">{t("mis_cursos.tag_activo")}</span>
                </div>

                <div className="card-content">
                    {/* 🔥 Nombre traducido por ID */}
                    <h3 className="card-title">
                        {t(`cursos_db.${c.course?._id}.nombre`, c.course?.nombre)}
                    </h3>
                    
                  
                    
                    <Link to={"/curso/" + c.course?._id} className="btn-acceder">
                        {t("mis_cursos.btn_ingresar")}
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