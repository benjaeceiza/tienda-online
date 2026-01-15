import { Link } from "react-router-dom";

const CardCourse = ({ cursos }) => {
    
    return (
        <>
            {cursos.map((c) => (
                <article className="card" key={c.course?._id || Math.random() }>
                    <div className="card-inner">
                        <div className="card-head">
                            <h3>{c.course?.nombre}</h3>
                            <p>{c.course?.descripcion}</p>
                        </div>

                        <img className="thumb bgCoursesContainer" src={c.course?.thumbnail} aria-label="Imagen del curso"/>

                        <div className="actions">
                            <span className="badge">Acceso: Activo</span>
                            <Link to={"/curso/"+c.course?._id} className="btn">IR A CURSO</Link>
                        </div>
                    </div>
                </article>
            ))}
        </>
    );
};

export default CardCourse;