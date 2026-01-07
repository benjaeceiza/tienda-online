import { useParams } from "react-router-dom";
import { getCourse } from "../../services/getCourse";
import { useEffect, useState } from "react";
import { useLoading } from "../../context/LoadingContext";


const Curso = () => {

    const { cid } = useParams();
    const [curso, setCurso] = useState({})
    const [error,setError] = useState(null);
    const {hideLoader} = useLoading();

    useEffect(() => {
        hideLoader();
        getCourse(cid)
            .then(data => setCurso(data || {}))
            .catch(err => setError(err))
    }, [cid])

    

    return (
        <>
            <header>
                <section className="encabezado">
                    <img className="fondoEncabezado" src={curso.thumbnail} alt="fondo encabezado" />
                    <div className="dataEncabezado">
                        <h1 className="titleEncabezado">{curso.nombre}</h1>
                    </div>
                </section>
            </header>
            <main className="main">

            </main>
        </>
    )
}

export default Curso;