import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserCourses } from "../../services/getUserCourses";
import CardCourse from "./CardCourse";
import { useLoading } from "../../context/LoadingContext";


const MisCursos = () => {
    const { user } = useAuth();
    const [cursos, setCursos] = useState([]);
    const { hideLoader } = useLoading();

    useEffect(() => {
        if (!user) return;
        const token = localStorage.getItem("token");

        getUserCourses(token)
            .then(data => setCursos(data.courses || []))
            .catch(err => console.error(err))
            .finally(() => hideLoader());

    }, [user]);

    return (
        <>

            <main className="main-container">
                {cursos.length > 0 ? (
                    <div className="content-wrapper">
                        <div className="titleMisCursos">
                            <h1>MIS CURSOS</h1>
                            <p>Acá vas a encontrar los cursos que ya adquiriste. Tocá “IR A CURSO” para entrar directo al contenido.</p>
                        </div>
                        <section className="courses-grid">
                            <CardCourse cursos={cursos} />
                        </section>
                    </div>)
                    : (
                        <div className="noCoursesContainer">
                            <h2 className="noCoursesTitle">No has adquirido ningún curso aún.</h2>
                            <p className="noCoursesSub">Explorá nuestra tienda y encontrá el curso perfecto para vos.</p>
                        </div>

                    )}
            </main>
        </>
    );
}

export default MisCursos;