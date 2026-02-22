import { FaTimes, FaReceipt, FaCalendarAlt, FaCreditCard } from "react-icons/fa";
import "./ModalAdminReceipts.css"; // 🔥 Ahora usa su propio archivo CSS

const ModalAdminReceipts = ({ isOpen, onClose, usuarioSeleccionado }) => {
    
    if (!isOpen || !usuarioSeleccionado) return null;

    // Función para formatear la fecha
    const formatearFecha = (fechaString) => {
        if (!fechaString) return "Fecha desconocida";
        const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(fechaString).toLocaleDateString('es-AR', opciones);
    };

    return (
        <div className="modal-receips-overlay" onClick={onClose}>
            <div className="modal-receips-container" onClick={(e) => e.stopPropagation()}>
                
                <button className="modal-receips-close-btn" onClick={onClose}>
                    <FaTimes />
                </button>

                <div className="modal-receips-content modal-receips-fade-in">
                    <div className="modal-receips-header">
                        <FaReceipt className="modal-receips-icon" />
                        <h3 className="modal-receips-title">Historial de Compras</h3>
                        <p className="modal-receips-subtitle">
                            Recibos de <strong>{usuarioSeleccionado.nombre || usuarioSeleccionado.nickname}</strong>
                        </p>
                    </div>

                    <div className="modal-receips-list">
                        {usuarioSeleccionado.courses && usuarioSeleccionado.courses.length > 0 ? (
                            <table className="modal-receips-table">
                                <thead>
                                    <tr>
                                        <th>Curso</th>
                                        <th>Fecha</th>
                                        <th>Método / ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarioSeleccionado.courses.map((item, index) => (
                                        <tr key={index}>
                                            <td className="modal-receips-td-course">
                                                {item.course?.nombre || "Curso no disponible"}
                                            </td>
                                            <td className="modal-receips-td-date">
                                                <div className="modal-receips-flex-center">
                                                    <FaCalendarAlt /> {formatearFecha(item.fechaCompra)}
                                                </div>
                                            </td>
                                            <td className="modal-receips-td-method">
                                                <div className="modal-receips-method-col">
                                                    <span className="modal-receips-method-name">
                                                        <FaCreditCard /> {item.metodoPago || "Manual/Beca"}
                                                    </span>
                                                    <span className="modal-receips-method-ref">
                                                        Ref: {item.idTransaccion || "N/A"}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="modal-receips-empty">
                                Este usuario aún no tiene cursos activos ni historial de compras.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalAdminReceipts;