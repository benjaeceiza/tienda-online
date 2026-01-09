
import fondoMeditaciones from "../../assets/fondos/intermedio.png";
import fondoNaturaleza from "../../assets/fondos/fondo_taller.jpg";
import fondoEricBarone from "../../assets/fondos/eric-barone.png";
import { useLoading } from "../../context/LoadingContext";
import { Link } from "react-router-dom";


const Cursos = () => {

    const { hideLoader } = useLoading();


    return (
        <>
            <section className="coursesContainerHome">
                <div className="coursesCardContainer">
                    <div className="textCoursesHome">
                        <h2 className="titleCourseHome">Rituales</h2>
                        <p className="subtitleCourseHome">La meditación no es una técnica nueva, es antigua; lo nuevo es lo que se genera al realizar estas meditaciones en cada uno de nosotros</p>
                    </div>
                    <Link to={"/cursos/rituales"}><div className="btnWrapper">
                        <svg className="ring" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                className="dashed-circle"
                            />
                        </svg>
                        <button className="btnHome">Ver<br></br>Cursos</button>
                    </div></Link>
                    <img className="bgCourseHome" src={fondoMeditaciones} alt="fondoCurso" onLoad={hideLoader} />
                </div>
                <div className="coursesCardContainer">
                    <div className="textCoursesHome">
                        <h2 className="titleCourseHome">Artesanias<br></br> magicas</h2>
                        <p className="subtitleCourseHome">La meditación no es una técnica nueva, es antigua; lo nuevo es lo que se genera al realizar estas meditaciones en cada uno de nosotros</p>
                    </div>
                    <Link to={"/cursos/artesanias magicas"}> <div className="btnWrapper">
                        <svg className="ring" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                className="dashed-circle"
                            />
                        </svg>
                        <button className="btnHome">Ver<br></br>Cursos</button>
                    </div></Link>
                    <img className="bgCourseHome" src={fondoNaturaleza} alt="fondoCurso" />
                </div>
                <div className="coursesCardContainer">
                    <div className="textCoursesHome">
                        <h2 className="titleCourseHome">ERIC BARONE</h2>
                        <p className="subtitleCourseHome">La meditación no es una técnica nueva, es antigua; lo nuevo es lo que se genera al realizar estas meditaciones en cada uno de nosotros</p>
                    </div>
                    <Link to="/cursos/eric barone"> <div className="btnWrapper">
                        <svg className="ring" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                className="dashed-circle"
                            />
                        </svg>
                        <button className="btnHome">Ver<br></br>Cursos</button>
                    </div></Link>
                    <img className="bgCourseHome" src={fondoEricBarone} alt="fondoCurso" />
                </div>
            </section>
        </>
    )
}

export default Cursos;