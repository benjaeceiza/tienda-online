import { useState, useEffect } from "react";
import { FaTimes, FaUserEdit, FaSave } from "react-icons/fa";
import "./ModalAdminEditUser.css"; 

const ModalAdminEditUser = ({ isOpen, onClose, usuarioSeleccionado, onUserUpdated }) => {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [rol, setRol] = useState("user");
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

    // Cuando se abre el modal, rellenamos los inputs con los datos del usuario elegido
    useEffect(() => {
        if (isOpen && usuarioSeleccionado) {
            setNombre(usuarioSeleccionado.nombre || usuarioSeleccionado.nickname || "");
            setEmail(usuarioSeleccionado.email || "");
            setRol(usuarioSeleccionado.rol || "user");
            setMensaje({ tipo: "", texto: "" });
        }
    }, [isOpen, usuarioSeleccionado]);

    if (!isOpen || !usuarioSeleccionado) return null;

    const handleActualizar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje({ tipo: "", texto: "" });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL_BACKEND}/users/admin/edit-user`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ 
                    targetUserId: usuarioSeleccionado._id, 
                    nombre: nombre,
                    email: email,
                    rol: rol
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje({ tipo: "exito", texto: "¡Usuario actualizado con éxito!" });
                
                // Esperamos 1.5 seg para que lea el mensaje y recargamos
                setTimeout(() => {
                    onUserUpdated();
                    onClose();
                }, 1500);
            } else {
                setMensaje({ tipo: "error", texto: data.error || "Error al actualizar." });
            }
        } catch (error) {
            setMensaje({ tipo: "error", texto: "Error de conexión." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-edit-user-overlay" onClick={onClose}>
            <div className="modal-edit-user-container" onClick={(e) => e.stopPropagation()}>
                
                <button className="modal-edit-user-close-btn" onClick={onClose}>
                    <FaTimes />
                </button>

                <div className="modal-edit-user-content modal-edit-user-fade-in">
                    <div className="modal-edit-user-header">
                        <FaUserEdit className="modal-edit-user-icon" />
                        <h3 className="modal-edit-user-title">Editar Usuario</h3>
                        <p className="modal-edit-user-subtitle">
                            Modificando a: <strong>{usuarioSeleccionado.nombre || usuarioSeleccionado.nickname}</strong>
                        </p>
                    </div>

                    {mensaje.texto && (
                        <div className={`modal-edit-user-alert ${mensaje.tipo === "error" ? "modal-edit-user-alert-error" : "modal-edit-user-alert-success"}`}>
                            {mensaje.texto}
                        </div>
                    )}

                    <form className="modal-edit-user-form" onSubmit={handleActualizar}>
                        <div className="modal-edit-user-inputGroup">
                            <label>Nombre</label>
                            <input 
                                type="text" 
                                value={nombre} 
                                onChange={(e) => setNombre(e.target.value)} 
                                required 
                                className="modal-edit-user-input"
                            />
                        </div>

                        <div className="modal-edit-user-inputGroup">
                            <label>Email</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="modal-edit-user-input"
                            />
                        </div>

                        <div className="modal-edit-user-inputGroup">
                            <label>Rol en la plataforma</label>
                            <select 
                                value={rol} 
                                onChange={(e) => setRol(e.target.value)}
                                className="modal-edit-user-input"
                            >
                                <option value="user">Usuario normal (Alumno)</option>
                                <option value="admin">Administrador (Jefe)</option>
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            className="modal-edit-user-btn-save"
                            disabled={loading}
                        >
                            <FaSave style={{ marginRight: "8px" }} />
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalAdminEditUser;