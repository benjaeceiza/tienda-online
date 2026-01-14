import { Navigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import { useEffect } from "react";
import { useLoading } from "../context/LoadingContext";

const HaveCourseRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const { hideLoader } = useLoading();
    
    // 1. OBTENCIÓN DEL ID
    // Intenta obtener 'cid', si no existe, intenta 'id' (por si acaso te equivocaste en App.jsx)
    const params = useParams();
    const courseIdFromUrl = params.cid || params.id || params.idCurso;

    // 2. USEEFFECT CORRECTO (Siempre arriba)
    useEffect(() => {
        // Ocultamos el loader apenas se monta este componente de seguridad
        hideLoader();
    }, [hideLoader]);

    if (!token) {
        return <Navigate to="/login" />;
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

        const misCursos = decoded.courses || [];


        
        // Verificamos que misCursos no sea un array de strings, sino de objetos
        const tieneAcceso = misCursos.some(item => {
            // A veces el ID viene dentro de 'item.course', a veces 'item' es el ID directo.
            // Verificamos ambas posibilidades para que no falle.
            const idEnToken = item.course || item; 
            return idEnToken === courseIdFromUrl;
        });


        if (!tieneAcceso) {
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
                    <h1 style={{fontSize: "3rem"}}>🔒</h1>
                    <h1>Curso no disponible</h1>
                    <p>ID Buscado: {courseIdFromUrl || "Indefinido"}</p>
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

        return children;

    } catch (error) {
        console.error("Error decodificando:", error);
        localStorage.removeItem("token");
        return <Navigate to="/login" />;
    }
};

export default HaveCourseRoute;