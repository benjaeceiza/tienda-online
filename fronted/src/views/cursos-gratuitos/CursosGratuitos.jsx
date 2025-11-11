import { useEffect, useState } from "react";
import { getFreeCourses } from "../../services/getFreeCourses";
import CardCourse from "./CardCourse";

const CursosGratuitos = () => {

    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        getFreeCourses()
            .then(data => setCursos(data.courses || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

    }, []);


    return (
        <>
            <main className="main">
                <h1 className="title">Cursos Gratuitos</h1>
                <section className="coursesSection">
                    {loading ? <p>Cargando Cursos</p> : <CardCourse cursos={cursos} />}
                </section>
            </main>
        </>
    )
}

export default CursosGratuitos;