import { useState, useEffect } from "react";
import { FaTimes, FaGift, FaBookOpen } from "react-icons/fa";
import "./ModalAssignCourse.css"; 

const ModalAssignCourse = ({ isOpen, onClose, usuarioSeleccionado, onCursoAsignado }) => {
    const [cursosDisponibles, setCursosDisponibles] = useState([]);
    const [cursoElegido, setCursoElegido] = useState("");
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

    // Cuando se abre el modal, traemos los cursos y FILTRAMOS los que ya tiene
    useEffect(() => {
        if (isOpen && usuarioSeleccionado) {
            const fetchCursos = async () => {
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL_BACKEND}/courses`);
                    const data = await res.json();
                    
                    if (res.ok) {
                        const todosLosCursos = data.courses || [];
                        
                        // 1. Obtenemos un array solo con los IDs de los cursos que el usuario YA tiene
                        // (Manejamos la posibilidad de que venga el objeto populado o solo el ID)
                        const idsCursosComprados = usuarioSeleccionado.courses?.map(c => 
                            c.course?._id ? c.course._id.toString() : c.course.toString()
                        ) || [];

                        // 2. Filtramos: Nos quedamos solo con los cursos cuyo ID NO esté en la lista del usuario
                        const cursosFiltrados = todosLosCursos.filter(curso => 
                            !idsCursosComprados.includes(curso._id.toString())
                        );

                        setCursosDisponibles(cursosFiltrados);
                    }
                } catch (error) {
                    console.error("Error cargando cursos:", error);
                }
            };
            fetchCursos();
            setMensaje({ tipo: "", texto: "" });
            setCursoElegido("");
        }
    }, [isOpen, usuarioSeleccionado]); // Agregamos usuarioSeleccionado a las dependencias

    if (!isOpen || !usuarioSeleccionado) return null;

    const handleAsignarCurso = async (e) => {
        e.preventDefault();
        if (!cursoElegido) return;

        setLoading(true);
        setMensaje({ tipo: "", texto: "" });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL_BACKEND}/users/admin/assign-course`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ 
                    targetUserId: usuarioSeleccionado._id, 
                    courseId: cursoElegido 
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje({ tipo: "exito", texto: data.message });
                setCursoElegido("");
                
                // Esperamos 2 segundos para que lea el mensaje y cerramos
                setTimeout(() => {
                    onCursoAsignado(); // Recarga la tabla del dashboard
                    onClose();
                }, 2000);
            } else {
                setMensaje({ tipo: "error", texto: data.error || "Error al asignar" });
            }
        } catch (error) {
            setMensaje({ tipo: "error", texto: "Error de conexión." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-assign-overlay" onClick={onClose}>
            <div className="modal-assign-container" onClick={(e) => e.stopPropagation()}>
                
                <button className="modal-assign-close-btn" onClick={onClose}>
                    <FaTimes />
                </button>

                <div className="modal-assign-content modal-assign-fade-in">
                    <div className="modal-assign-header">
                        <FaGift className="modal-assign-icon" />
                        <h3 className="modal-assign-title">Regalar Curso</h3>
                        <p className="modal-assign-subtitle">
                            Asignar a: <strong>{usuarioSeleccionado.nombre || usuarioSeleccionado.nickname}</strong>
                        </p>
                    </div>

                    {mensaje.texto && (
                        <div className={`modal-assign-alert ${mensaje.tipo === "error" ? "modal-assign-alert-error" : "modal-assign-alert-success"}`}>
                            {mensaje.texto}
                        </div>
                    )}

                    <form className="modal-assign-form" onSubmit={handleAsignarCurso}>
                        <div className="modal-assign-inputGroup">
                            <label>Seleccionar Curso</label>
                            
                            {/* 🔥 Validación visual si ya tiene todos los cursos */}
                            {cursosDisponibles.length > 0 ? (
                                <select 
                                    value={cursoElegido} 
                                    onChange={(e) => setCursoElegido(e.target.value)}
                                    required
                                    className="modal-assign-select"
                                >
                                    <option value="" disabled>-- Elegí un curso --</option>
                                    {cursosDisponibles.map(curso => (
                                        <option key={curso._id} value={curso._id}>
                                            {curso.nombre} - ({curso.categoria})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div style={{ padding: "12px", background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", borderRadius: "10px", border: "1px solid rgba(34, 197, 94, 0.3)", textAlign: "center", fontSize: "0.9rem" }}>
                                    ¡Este usuario ya tiene todos los cursos de la plataforma!
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className="modal-assign-btn-save"
                            disabled={loading || !cursoElegido || cursosDisponibles.length === 0}
                        >
                            <FaBookOpen style={{ marginRight: "8px" }} />
                            {loading ? "Asignando..." : "Asignar Curso"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalAssignCourse;