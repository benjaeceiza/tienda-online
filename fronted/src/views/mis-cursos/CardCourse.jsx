import { Link } from "react-router-dom";

const CardCourse = ({ cursos }) => {
    return (
        <>
            {cursos.map((c) => (
                <article className="course-card" key={c.course?._id || Math.random()}>
                    
                    {/* Imagen / Thumbnail */}
                    <div className="card-thumb-container">
                        <img 
                            src={c.course?.thumbnail || "https://via.placeholder.com/300"} 
                            alt={c.course?.nombre} 
                            className="card-thumb"
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
                </article>
            ))}
        </>
    );
};

export default CardCourse;