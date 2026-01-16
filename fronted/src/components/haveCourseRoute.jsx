import { Navigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useLoading } from "../context/LoadingContext";
import { getFreeCourses } from "../services/getFreeCourses";

const HaveCourseRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const { hideLoader } = useLoading();
    const params = useParams();
    const courseIdFromUrl = params.cid || params.id || params.idCurso;

    const [freeCourses, setFreeCourses] = useState([]);
    // Agregamos un estado para saber si todavía estamos verificando datos
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Asumo que getFreeCourses podría ser asíncrono. 
                // Si es síncrono, quita el 'await'.
                const courses = await getFreeCourses(); 
                setFreeCourses(courses || []);
            } catch (error) {
                console.error("Error cargando cursos gratuitos", error);
            } finally {
                // Una vez que tenemos la data (o falló), dejamos de "checkear"
                setIsChecking(false);
                hideLoader();
            }
        };

        fetchData();
    }, [hideLoader]);

    if (!token) {
        return <Navigate to="/login" />;
    }

    // 1. MIENTRAS CARGAMOS LA INFO DE CURSOS GRATUITOS, NO MOSTRAMOS NADA (O UN SPINNER)
    // Esto evita que "parpadee" la pantalla de bloqueo
    if (isChecking) {
        return null; // O puedes retornar un <div>Cargando...</div>
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            localStorage.removeItem("token");
            return <Navigate to="/login" />;
        }

        if (decoded.rol === "admin") {
            return children;
        }

        // --- VALIDACIÓN 1: ¿LO TIENE COMPRADO? ---
        const misCursos = decoded.courses || [];
        const tieneCompra = misCursos.some(item => {
            const idEnToken = item.course || item;
            return String(idEnToken) === String(courseIdFromUrl);
        });

        // --- VALIDACIÓN 2: ¿ES GRATUITO? ---
        // Asumiendo que tus cursos gratuitos tienen propiedad _id o id
        const esGratuito = freeCourses.some(curso => {
            const idCurso = curso._id || curso.id; 
            return String(idCurso) === String(courseIdFromUrl);
        });

        // SI NO LO COMPRÓ Y NO ES GRATIS -> BLOQUEAMOS
        if (!tieneCompra && !esGratuito) {
            return (
                <div style={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#1a1a1a",
                    color: "white",
                    textAlign: "center"
                }}>
                    <h1 style={{ fontSize: "3rem" }}>🔒</h1>
                    <h1>Curso no disponible</h1>
                    {/* Mensaje amigable para el usuario */}
                    <p style={{ opacity: 0.7 }}>
                        No tienes acceso a este contenido. <br/>
                        ID: {courseIdFromUrl || "No detectado"}
                    </p>
                    <button
                        style={{
                            padding: "10px 20px", marginTop: "20px", cursor: "pointer",
                            background: "#007bff", color: "white", border: "none", borderRadius: "5px"
                        }}
                        onClick={() => window.location.href = "/"}
                    >
                        Volver al inicio
                    </button>
                </div>
            );
        }

        // Si pasa cualquiera de las dos validaciones, mostramos el contenido
        return children;

    } catch (error) {
        console.error("Error decodificando:", error);
        localStorage.removeItem("token");
        return <Navigate to="/login" />;
    }
};

export default HaveCourseRoute;