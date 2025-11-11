import { useEffect, useState } from "react";
import { getPaidCourses } from "../../services/getPaidCourses";
import CardCourse from "./CardCourse"


const CursosPagos = () => {

  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    getPaidCourses()
      .then(data => setCursos(data.courses || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

  }, []);
  

  return (
    <>
      <main className="main">
        <h1 className="title">Cursos Pagos</h1>
        <section className="coursesSection">
            {loading ? <p>Cargando Cursos</p> : <CardCourse cursos={cursos} />}
        </section>
      </main>
    </>
  )
}

export default CursosPagos;