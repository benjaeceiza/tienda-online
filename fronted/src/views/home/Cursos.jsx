


import fondoEricBarone from "../../assets/fondos/eric-barone.png";
import { useLoading } from "../../context/LoadingContext";
import { Link } from "react-router-dom";


const Cursos = () => {

    const { hideLoader } = useLoading();
    const fondoRituales = "https://i.postimg.cc/q7csYRNP/fondo_rituales.png";
    const fondoArtesanias = "https://i.postimg.cc/CKCGt1Rt/fondo_artesanias.png";
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
                    <img className="bgCourseHome" src={fondoRituales} alt="fondoCurso" onLoad={hideLoader} />
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
                    <img className="bgCourseHome" src={fondoArtesanias} alt="fondoCurso" />
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