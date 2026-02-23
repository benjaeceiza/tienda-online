import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCog, FaSignOutAlt, FaUserEdit, FaLock, FaArrowLeft, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
// 🔥 Importamos el traductor
import { useTranslation } from 'react-i18next';

const ModalUser = ({ isOpen, onClose, user, onLogout }) => {
    const { t } = useTranslation("global"); // 🔥 Hook de traducción
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

    const isModified = nickname !== (user?.nickname || "") || email !== (user?.email || "");
    const isButtonDisabled = loading || !isModified;

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
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
                body: JSON.stringify({ nombre: nickname, email: email })
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje({ tipo: "exito", texto: t("user_modal.exito_perfil") });

                if (data.token) {
                    localStorage.setItem("token", data.token);
                }

                if (setUser) {
                    setUser({ ...data.user, nickname: data.user.nombre || nickname });
                }

                setTimeout(() => {
                    setView('profile');
                    setMensaje({ tipo: "", texto: "" });
                }, 2000);

            } else {
                setMensaje({ tipo: "error", texto: data.error || t("admin_modal.error_update") });
            }
        } catch (error) {
            console.error(error);
            setMensaje({ tipo: "error", texto: t("recovery.error_conexion") });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMensaje({ tipo: "error", texto: t("recovery.error_match") });
            return;
        }

        if (newPassword.length < 8) {
            setMensaje({ tipo: "error", texto: t("user_modal.error_pass_length") });
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
                setMensaje({ tipo: "exito", texto: t("recovery.exito_cambio") });
                setNewPassword("");
                setConfirmPassword("");

                setTimeout(() => {
                    setView('profile');
                    setMensaje({ tipo: "", texto: "" });
                }, 2000);

            } else {
                setMensaje({ tipo: "error", texto: data.error || t("admin_modal.error_update") });
            }
        } catch (error) {
            console.error(error);
            setMensaje({ tipo: "error", texto: t("recovery.error_conexion") });
        } finally {
            setLoading(false);
        }
    };

    const isPasswordButtonDisabled = loading || !newPassword || !confirmPassword || (newPassword !== confirmPassword);

    return (
        <div className="userModal_overlay" onClick={handleClose}>
            <div className="userModal_container" onClick={handleContainerClick}>

                <button className="userModal_iconBtn_topRight" onClick={handleClose} title={t("user_modal.cerrar")}>
                    <FaTimes />
                </button>

                {view === 'profile' ? (
                    <button className="userModal_iconBtn_topLeft" onClick={() => setView('editProfile')} title={t("user_modal.config")}>
                        <FaCog />
                    </button>
                ) : (
                    <button className="userModal_iconBtn_topLeft" onClick={() => { setView('profile'); setMensaje({ tipo: "", texto: "" }); }} title={t("user_modal.volver")}>
                        <FaArrowLeft />
                    </button>
                )}

                {view === 'profile' && (
                    <div className="userModal_content fade-in">
                        <div className="userModal_header">
                            <div className="userModal_avatar">
                                {user?.nickname ? user.nickname.charAt(0).toUpperCase() : "U"}
                            </div>
                            <h3 className="userModal_name">{user?.nickname || t("user_modal.usuario_anonimo")}</h3>
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
                                <FaSignOutAlt className="userModal_btn_icon" /> {t("navbar.cerrar_sesion", "Cerrar Sesión")}
                            </button>
                        </div>
                    </div>
                )}

                {view === 'editProfile' && (
                    <div className="userModal_content fade-in">
                        <div className="userModal_header_small">
                            <FaUserEdit className="userModal_header_icon" />
                            <h3 className="userModal_title">{t("admin_modal.titulo")}</h3>
                            <p className="userModal_subtitle">{t("admin_modal.sub_perfil", "Actualiza tus datos personales")}</p>
                        </div>

                        {mensaje.texto && (
                            <div className={`userModal_alert ${mensaje.tipo === "error" ? "userModal_alert_error" : "userModal_alert_success"}`}>
                                {mensaje.texto}
                            </div>
                        )}

                        <form className="userModal_form" onSubmit={handleUpdateProfile}>
                            <div className="userModal_inputGroup">
                                <label>{t("user_modal.label_nick")}</label>
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    placeholder={t("contacto.label_nombre")}
                                    required
                                />
                            </div>
                            <div className="userModal_inputGroup">
                                <label>Email</label>
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
                                <FaLock /> {t("login.olvido_pass")}
                            </button>

                            <button
                                type="submit"
                                className="userModal_btn_save"
                                disabled={isButtonDisabled}
                            >
                                {loading ? t("recovery.guardando") : t("admin_modal.btn_guardar")}
                            </button>
                        </form>
                    </div>
                )}

                {view === 'password' && (
                    <div className="userModal_content fade-in">
                        <div className="userModal_header_small">
                            <FaLock className="userModal_header_icon" />
                            <h3 className="userModal_title">{t("user_modal.seguridad")}</h3>
                            <p className="userModal_subtitle">{t("recovery.sub_pass")}</p>
                        </div>

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
                                <label>{t("recovery.label_nueva")}</label>
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
                                <label>{t("recovery.label_confirmar")}</label>
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
                                {loading ? t("recovery.guardando") : t("recovery.btn_cambiar")}
                            </button>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ModalUser;