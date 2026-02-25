import { useState } from "react";
import { FaExclamationTriangle, FaTrash } from "react-icons/fa";
import "./ModalAdminDelete.css"; // <-- ¡Importante!

const ModalAdminDeleteUser = ({ isOpen, onClose, usuarioSeleccionado, onUserDeleted }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen || !usuarioSeleccionado) return null;

    const handleDelete = async () => {
        setIsDeleting(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            
            const response = await fetch(`${import.meta.env.VITE_API_URL_BACKEND}/users/admin/users/${usuarioSeleccionado._id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                onUserDeleted(usuarioSeleccionado._id); 
                onClose();
            } else {
                const data = await response.json();
                setError(data.message || data.error || "Error al eliminar el usuario.");
            }
        } catch (err) {
            console.error("Error al eliminar:", err);
            setError("Error de conexión con el servidor.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="modal-admin-delete-overlay">
            <div className="modal-admin-delete-content">
                <button className="modal-admin-delete-close" onClick={onClose} disabled={isDeleting}>
                    &times;
                </button>
                
                <div className="modal-admin-delete-header">
                    <FaExclamationTriangle size={42} color="#e74c3c" />
                    <h2>Eliminar Usuario</h2>
                </div>

                <div className="modal-admin-delete-body">
                    <p>
                        ¿Estás seguro de que querés eliminar a <br/>
                        <strong>{usuarioSeleccionado.nombre || usuarioSeleccionado.nickname || "este usuario"}</strong>?
                    </p>
                    <div className="modal-admin-delete-warning">
                        Esta acción no se puede deshacer y el usuario perderá el acceso a todos sus cursos.
                    </div>
                    
                    {error && <div className="admin-alert-error" style={{ marginTop: "15px" }}>{error}</div>}
                </div>

                <div className="modal-admin-delete-footer">
                    <button 
                        className="modal-admin-delete-btn-cancel" 
                        onClick={onClose} 
                        disabled={isDeleting}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="modal-admin-delete-btn-confirm" 
                        onClick={handleDelete} 
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Eliminando..." : <><FaTrash /> Sí, eliminar</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAdminDeleteUser;