import { useEffect } from "react";
import fondoMeditaciones from "../../assets/fondos/intermedio.png";
import fondoNaturaleza from "../../assets/fondos/naturaleza.jpg";
import { useLoading } from "../../context/LoadingContext";


const Cursos = () => {

   const {hideLoader} = useLoading();


    return (
        <>
            <section className="coursesContainerHome">
                <div className="coursesCardContainer">
                    <div className="textCoursesHome">
                        <h2 className="titleCourseHome">Meditaciones.</h2>
                        <p className="subtitleCourseHome">La meditación no es una técnica nueva, es antigua; lo nuevo es lo que se genera al realizar estas meditaciones en cada uno de nosotros</p>
                    </div>
                    <div className="btnWrapper">
                        <svg className="ring" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                className="dashed-circle"
                            />
                        </svg>
                        <button className="btnHome">Ver<br></br>Cursos</button>
                    </div>
                    <img className="bgCourseHome" src={fondoMeditaciones} alt="fondoCurso" onLoad={hideLoader} />
                </div>
                <div className="coursesCardContainer">
                    <div className="textCoursesHome">
                        <h2 className="titleCourseHome">CURSOS.</h2>
                        <p className="subtitleCourseHome">La meditación no es una técnica nueva, es antigua; lo nuevo es lo que se genera al realizar estas meditaciones en cada uno de nosotros</p>
                    </div>
                    <div className="btnWrapper">
                        <svg className="ring" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                className="dashed-circle"
                            />
                        </svg>
                        <button className="btnHome">Ver<br></br>Cursos</button>
                    </div>
                     <img className="bgCourseHome" src={fondoNaturaleza} alt="fondoCurso" />
                </div>
            </section>
        </>
    )
}

export default Cursos;