import { Link } from "react-router-dom";

const CardCourse = ({ cursos }) => {
    return (
        <>
            {cursos.map((c) => (
                <article key={c.course._id || c._id} className="card-course">
                    <div className="card-image-container">
                        <img 
                            className="card-img" 
                            src={c.course.thumbnail} 
                            alt={`Portada del curso ${c.course.nombre}`} 
                        />
                    </div>
                    
                    <div className="card-data">
                        <h2 className="card-title">{c.course.nombre}</h2>
                        {/* Si tienes descripción, descomenta esto */}
                        {/* <p className="card-description">{c.course.description}</p> */}
                        
                        <Link 
                            to={"/curso/" + c.course._id} 
                            className="card-btn"
                        >
                            Ingresar al curso
                        </Link>
                    </div>
                </article>
            ))}
        </>
    );
};

export default CardCourse;