
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUserShield, FaGraduationCap, FaUserEdit, FaGift, FaReceipt, FaBan, FaTrash, FaEye } from "react-icons/fa";

import "./AdminDashboard.css"; // Crearemos este archivo ahora
import { useLoading } from "../../context/LoadingContext";
import { useAuth } from "../../context/AuthContext";
import ModalAdminReceipts from "../../components/modal-admin-recibos/ModalAdminReceipts";
import ModalAssignCourse from "../../components/modal-asignar-curso/ModalAssignCourse";

const AdminDashboard = () => {
    const { user } = useAuth();
    const { showLoader, hideLoader } = useLoading();
    const navigate = useNavigate();

    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [error, setError] = useState("");

    // 1. Verificación rápida de seguridad en el Frontend
    useEffect(() => {

        if (!user || (user.rol !== "admin" && user.rol !== "administrador")) {
            navigate("/"); // Si se cuela un usuario normal, lo pateamos al inicio
        }
    }, [user, navigate]);

    // 2. Traer los datos del Backend
    useEffect(() => {
        const fetchUsuarios = async () => {

            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${import.meta.env.VITE_API_URL_BACKEND}/users/admin/users`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setUsuarios(data.usuarios || []);
                } else {
                    setError(data.error || "Error al cargar usuarios");
                }
            } catch (err) {
                console.error(err);
                setError("Error de conexión con el servidor");
            } finally {
                hideLoader();
            }
        };

        if (user && (user.rol === "admin" || user.rol === "administrador")) {
            fetchUsuarios();
        }
    }, [user, showLoader, hideLoader]);

    // 3. Lógica del Buscador en tiempo real
    const usuariosFiltrados = usuarios.filter((u) => {
        const termino = busqueda.toLowerCase();
        const nombre = (u.nombre || u.nickname || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        return nombre.includes(termino) || email.includes(termino);
    });

    return (
        <main className="admin-dashboard-layout">
            <div className="admin-dashboard-container">

                {/* --- HEADER DEL PANEL --- */}
                <header className="admin-header">
                    <div>
                        <h1 className="admin-title">
                            <FaUserShield className="admin-icon-title" /> Panel de Administración
                        </h1>
                        <p className="admin-subtitle">Gestiona los accesos y cursos de tus alumnos.</p>
                    </div>

                    <div className="admin-search-wrapper">
                        <FaSearch className="admin-search-icon" />
                        <input
                            type="text"
                            className="admin-search-input"
                            placeholder="Buscar por nombre o email..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </header>

                {error && <div className="admin-alert-error">{error}</div>}

                {/* --- TABLA DE USUARIOS --- */}
                <div className="admin-glass-card">
                    <div className="admin-table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Cursos Activos</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosFiltrados.length > 0 ? (
                                    usuariosFiltrados.map((u) => (
                                        <tr key={u._id}>
                                            <td className="admin-td-user">
                                                <div className="admin-avatar-mini">
                                                    {(u.nombre || u.nickname || "U").charAt(0).toUpperCase()}
                                                </div>
                                                <span className="admin-user-name">{u.nombre || u.nickname || "Sin nombre"}</span>
                                            </td>
                                            <td className="admin-td-email">{u.email}</td>
                                            <td>
                                                <span className={`admin-badge-rol ${u.rol === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                                                    {u.rol || "user"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="admin-courses-count">
                                                    <FaGraduationCap className="admin-icon-course" />
                                                    {u.courses?.length || 0} cursos
                                                </div>
                                            </td>


                                            <td className="admin-td-actions">
                                                <div className="admin-actions-group">
                                                    {/* Botón: Ver Cursos y Recibos */}
                                                    <button
                                                        className="admin-btn-icon btn-info"
                                                        title="Ver Cursos y Recibos"
                                                        onClick={() => {
                                                            setUsuarioSeleccionado(u);
                                                            setIsReceiptModalOpen(true);
                                                        }}
                                                    >
                                                        <FaReceipt />
                                                    </button>

                                                    {/* Botón: Regalar Curso */}
                                                    <button
                                                        className="admin-btn-icon btn-gift"
                                                        title="Asignar Curso Manualmente"
                                                        onClick={() => {
                                                            setUsuarioSeleccionado(u);
                                                            setIsAssignModalOpen(true);
                                                        }}
                                                    >
                                                        <FaGift />
                                                    </button>

                                                    {/* Botón: Editar Usuario */}
                                                    <button
                                                        className="admin-btn-icon btn-edit"
                                                        title="Editar Perfil / Cambiar Rol"
                                                        onClick={() => alert(`Editando a ${u.nombre}`)}
                                                    >
                                                        <FaUserEdit />
                                                    </button>

                                                    <div className="admin-actions-divider"></div>

                                                    {/* Botón: Suspender/Bloquear */}
                                                    <button
                                                        className="admin-btn-icon btn-suspend"
                                                        title="Suspender Acceso"
                                                        onClick={() => alert(`Suspendiendo a ${u.nombre}`)}
                                                    >
                                                        <FaBan />
                                                    </button>

                                                    {/* Botón: Eliminar */}
                                                    <button
                                                        className="admin-btn-icon btn-delete"
                                                        title="Eliminar Cuenta"
                                                        onClick={() => alert(`Eliminando a ${u.nombre}`)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="admin-table-empty">
                                            No se encontraron usuarios con esa búsqueda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            {/* --- MODALES --- */}

            <ModalAssignCourse
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                usuarioSeleccionado={usuarioSeleccionado}
                onCursoAsignado={() => window.location.reload()} // Esto recarga la página para ver el cambio
            />
            <ModalAdminReceipts
                isOpen={isReceiptModalOpen}
                onClose={() => setIsReceiptModalOpen(false)}
                usuarioSeleccionado={usuarioSeleccionado}
            />
        </main>
    );
};

export default AdminDashboard;