import { Navigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useLoading } from "../context/LoadingContext";
import { getFreeCourses } from "../services/getFreeCourses";
// 🔥 Importamos el traductor
import { useTranslation } from 'react-i18next';

const HaveCourseRoute = ({ children }) => {
    const { t } = useTranslation("global"); // 🔥 Hook de traducción
    const token = localStorage.getItem("token");
    const { hideLoader } = useLoading();
    const params = useParams();
    const courseIdFromUrl = params.cid || params.id || params.idCurso;

    const [freeCourses, setFreeCourses] = useState([]);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courses = await getFreeCourses(); 
                setFreeCourses(courses || []);
            } catch (error) {
                console.error("Error cargando cursos gratuitos", error);
            } finally {
                setIsChecking(false);
                hideLoader();
            }
        };

        fetchData();
    }, [hideLoader]);

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (isChecking) {
        return null; 
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            localStorage.removeItem("token");
            return <Navigate to="/login" />;
        }

        if (decoded.rol === "admin" || decoded.rol === "administrador") {
            return children;
        }

        const misCursos = decoded.courses || [];
        const tieneCompra = misCursos.some(item => {
            const idEnToken = item.course || item;
            return String(idEnToken) === String(courseIdFromUrl);
        });

        const esGratuito = freeCourses.some(curso => {
            const idCurso = curso._id || curso.id; 
            return String(idCurso) === String(courseIdFromUrl);
        });

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
                    padding: "20px",
                    textAlign: "center",
                    fontFamily: "sans-serif"
                }}>
                    <h1 style={{ fontSize: "4rem", marginBottom: "10px" }}>🔒</h1>
                    {/* 🔥 Títulos traducidos */}
                    <h1 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>{t("bloqueo.titulo")}</h1>
                    
                    <p style={{ opacity: 0.7, maxWidth: "400px", lineHeight: "1.5" }}>
                        {t("bloqueo.mensaje")} <br/>
                        <span style={{ fontSize: "0.8rem" }}>ID: {courseIdFromUrl || "N/A"}</span>
                    </p>

                    <button
                        style={{
                            padding: "12px 25px", 
                            marginTop: "30px", 
                            cursor: "pointer",
                            background: "#e040fb", // Usando el fucsia de tu paleta
                            color: "white", 
                            border: "none", 
                            borderRadius: "8px",
                            fontWeight: "bold",
                            transition: "transform 0.2s"
                        }}
                        onClick={() => window.location.href = "/"}
                    >
                        {t("mis_cursos.btn_volver")}
                    </button>
                </div>
            );
        }

        return children;

    } catch (error) {
        console.error("Error decodificando:", error);
        localStorage.removeItem("token");
        return <Navigate to="/login" />;
    }
};

export default HaveCourseRoute;