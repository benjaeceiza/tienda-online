import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserCourses } from "../../services/getUserCourses";
import CardCourse from "./CardCourse";

const MisCursos = () => {
    const { user } = useAuth();
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const token = localStorage.getItem("token");

        getUserCourses(token)
            .then(data => setCursos(data.courses || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

    }, [user]);




    return (

        <main className="main">
            <h1 className="title">Mis cursos</h1>
            <section className="coursesSection">
                {loading ? <p>Cargando Cursos</p> : <CardCourse cursos={cursos} />}
            </section>
        </main>
    );
}

export default MisCursos;