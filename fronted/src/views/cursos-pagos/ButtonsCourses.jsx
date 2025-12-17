

const ButtonsCourses = ({ cursos, setCursoSeleccionado }) => {



    return (
        <>
            {
                cursos.map(c => (
                    <div key={c._id} className="buttonNameContainer" onClick={() => setCursoSeleccionado(c)}>
                        <div className="btnWrapper">
                            <svg className="ring-courses" viewBox="0 0 120 120">
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="45"
                                    className="dashed-circle"
                                />
                            </svg>
                            <button className="btnCourses">
                                <svg className="icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M8 17c2-2 6-2 8 0M8 12c2-2 6-2 8 0M8 7c2-2 6-2 8 0" />
                                </svg></button>
                        </div>
                        <p className="buttonTitleCourse">{c.nombre}</p>
                    </div>

                ))
            }
        </>
    )

}

export default ButtonsCourses;