import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCog, FaSignOutAlt, FaUserEdit, FaLock, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';


const ModalUser = ({ isOpen, onClose, user, onLogout }) => {
    const [view, setView] = useState('profile');
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (user) {
            setNickname(user.nickname || "");
            setEmail(user.email || "");
        }
    }, [user]);

    if (!isOpen) return null;

    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    const handleClose = () => {
        setView('profile');
        setMensaje({ tipo: "", texto: "" });
        onClose();
    };

    // 🔥 LOGICA DEL BOTÓN: Comparamos si los inputs actuales son distintos a los originales
    const isModified = nickname !== (user?.nickname || "") || email !== (user?.email || "");

    // El botón se deshabilita si está cargando o si NO hay modificaciones
    const isButtonDisabled = loading || !isModified;

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        // Medida de seguridad extra por si tocan el HTML
        if (!isModified) return;

        setLoading(true);
        setMensaje({ tipo: "", texto: "" });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL_BACKEND}/users/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                // 🔥 TRADUCCIÓN FRONT-BACK: El frontend maneja 'nickname', pero le mandamos 'nombre' al backend
                body: JSON.stringify({ nombre: nickname, email: email })
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje({ tipo: "exito", texto: "¡Tus datos se actualizaron correctamente!" });

                // 🔥 PISAMOS EL TOKEN VIEJO CON EL NUEVO QUE MANDÓ EL BACKEND
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }

                // Actualizamos el usuario en el estado global (Context)
                if (setUser) {
                    setUser({ ...data.user, nickname: data.user.nombre || nickname });
                }

                setTimeout(() => {
                    setView('profile');
                    setMensaje({ tipo: "", texto: "" });
                }, 2000);

            } else {
                setMensaje({ tipo: "error", texto: data.error || "Hubo un problema al actualizar." });
            }
        } catch (error) {
            console.error(error);
            setMensaje({ tipo: "error", texto: "Error de conexión con el servidor." });
        } finally {
            setLoading(false);
        }
    };


    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        // Validación local: verificamos que coincidan antes de pegarle al backend
        if (newPassword !== confirmPassword) {
            setMensaje({ tipo: "error", texto: "Las contraseñas no coinciden." });
            return;
        }

        if (newPassword.length < 6) {
            setMensaje({ tipo: "error", texto: "La contraseña debe tener al menos 6 caracteres." });
            return;
        }

        setLoading(true);
        setMensaje({ tipo: "", texto: "" });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL_BACKEND}/users/update-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ nuevaContrasena: newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje({ tipo: "exito", texto: "¡Contraseña actualizada con éxito!" });

                // Limpiamos los inputs
                setNewPassword("");
                setConfirmPassword("");

                // Volvemos al perfil después de 2 segundos
                setTimeout(() => {
                    setView('profile');
                    setMensaje({ tipo: "", texto: "" });
                }, 2000);

            } else {
                setMensaje({ tipo: "error", texto: data.error || "Hubo un problema al actualizar." });
            }
        } catch (error) {
            console.error(error);
            setMensaje({ tipo: "error", texto: "Error de conexión con el servidor." });
        } finally {
            setLoading(false);
        }
    };

    // Lógica para deshabilitar el botón si los campos están vacíos o no coinciden
    const isPasswordButtonDisabled = loading || !newPassword || !confirmPassword || (newPassword !== confirmPassword);


    return (
        <div className="userModal_overlay" onClick={handleClose}>
            <div className="userModal_container" onClick={handleContainerClick}>

                {view === 'profile' ? (
                    <button className="userModal_iconBtn_topRight" onClick={() => setView('editProfile')} title="Configuración">
                        <FaCog />
                    </button>
                ) : (
                    <button className="userModal_iconBtn_topRight" onClick={() => { setView('profile'); setMensaje({ tipo: "", texto: "" }); }} title="Volver">
                        <FaArrowLeft />
                    </button>
                )}

                {view === 'profile' && (
                    <div className="userModal_content fade-in">
                        <div className="userModal_header">
                            <div className="userModal_avatar">
                                {user?.nickname ? user.nickname.charAt(0).toUpperCase() : "U"}
                            </div>
                            <h3 className="userModal_name">{user?.nickname || "Usuario"}</h3>
                            <p className="userModal_email">{user?.email || "usuario@email.com"}</p>
                        </div>

                        <div className="userModal_actions_primary">
                            <button
                                className="userModal_btn_logout"
                                onClick={() => {
                                    onLogout();
                                    handleClose();
                                    navigate("/");
                                }}
                            >
                                <FaSignOutAlt className="userModal_btn_icon" /> Cerrar Sesión
                            </button>
                        </div>
                    </div>
                )}

                {view === 'editProfile' && (
                    <div className="userModal_content fade-in">
                        <div className="userModal_header_small">
                            <FaUserEdit className="userModal_header_icon" />
                            <h3 className="userModal_title">Editar Perfil</h3>
                            <p className="userModal_subtitle">Actualiza tus datos personales</p>
                        </div>

                        {mensaje.texto && (
                            <div className={`userModal_alert ${mensaje.tipo === "error" ? "userModal_alert_error" : "userModal_alert_success"}`}>
                                {mensaje.texto}
                            </div>
                        )}

                        <form className="userModal_form" onSubmit={handleUpdateProfile}>
                            <div className="userModal_inputGroup">
                                <label>Nombre o Nickname</label>
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    placeholder="Tu nombre"
                                    required
                                />
                            </div>
                            <div className="userModal_inputGroup">
                                <label>Correo Electrónico</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="correo@ejemplo.com"
                                    required
                                />
                            </div>

                            <button
                                type="button"
                                className="userModal_textBtn"
                                onClick={() => setView('password')}
                            >
                                <FaLock /> Cambiar Contraseña
                            </button>

                            {/* 🔥 BOTÓN DESHABILITADO: Le pasamos la variable isButtonDisabled */}
                            <button
                                type="submit"
                                className="userModal_btn_save"
                                disabled={isButtonDisabled}
                            >
                                {loading ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </form>
                    </div>
                )}

                {/* --- VISTA 3: CAMBIAR CONTRASEÑA --- */}
                {view === 'password' && (
                    <div className="userModal_content fade-in">
                        <div className="userModal_header_small">
                            <FaLock className="userModal_header_icon" />
                            <h3 className="userModal_title">Seguridad</h3>
                            <p className="userModal_subtitle">Elige una nueva contraseña</p>
                        </div>

                        {/* Mismo sistema de alertas que usamos en el perfil */}
                        {mensaje.texto && (
                            <div className={`userModal_alert ${mensaje.tipo === "error" ? "userModal_alert_error" : "userModal_alert_success"}`}>
                                {mensaje.texto}
                            </div>
                        )}

                        <form className="userModal_form" onSubmit={handleUpdatePassword}>
                            <input
                                type="email"
                                autoComplete="username"
                                value={user?.email || "usuario@ejemplo.com"}
                                style={{ display: "none" }}
                                readOnly
                            />
                            <div className="userModal_inputGroup">
                                <label>Nueva Contraseña</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="userModal_inputGroup">
                                <label>Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="userModal_btn_save"
                                disabled={isPasswordButtonDisabled}
                            >
                                {loading ? "Actualizando..." : "Actualizar Contraseña"}
                            </button>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ModalUser;