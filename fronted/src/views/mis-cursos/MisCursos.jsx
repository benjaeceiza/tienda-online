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
        <main className="main-container">
            {/* Overlay oscuro para mejorar lectura sobre el fondo cósmico */}
            <div className="overlay"></div>
            
            <div className="content-wrapper">
                <h1 className="page-title">Mis Cursos</h1>
                
                <section className="courses-grid">
                    {/* Pasamos los cursos. Si no hay, podrías mostrar un mensaje */}
                    {cursos.length > 0 ? (
                        <CardCourse cursos={cursos} />
                    ) : (
                        <p style={{textAlign: 'center', width: '100%', opacity: 0.7}}>
                            Aún no tienes cursos en tu biblioteca estelar.
                        </p>
                    )}
                </section>
            </div>
        </main>
    );
}

export default MisCursos;