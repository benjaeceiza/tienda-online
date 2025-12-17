import { Link } from "react-router-dom";

const CardCourse = ({ cursos }) => {



    return (
        <>
            {
                cursos.map(c => (
                    <div key={Math.random()} className="cardCourse">
                        <img className="cardBackground" src={c.course.thumbnail} alt="Fondo Curso" />
                        <div className="cardData">
                            <h2 className="titleCardCourse">{c.course.nombre}</h2>
                            <p className="cardDescription"></p>
                            <Link to={"/curso/" + c.course._id } className={"cardButton"}>Ver curso</Link>
                        </div>
                    </div>
                ))
            }
        </>
    )

}

export default CardCourse;