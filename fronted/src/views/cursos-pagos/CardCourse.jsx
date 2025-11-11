
const CardCourse = ({ cursos }) => {



    return (
        <>
            {
                cursos.map(c => (
                    <div key={Math.random()} className="cardCourse">
                        <img className="cardBackground" src={c.thumbnail} alt="" />
                        <div className="cardData">
                            <h2 className="titleCardCourse">{c.nombre}</h2>
                            <p className="cardDescription"></p>
                            <p className="cardButton">Ver Curso</p>
                        </div>
                    </div>
                ))
            }
        </>
    )

}

export default CardCourse;