import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { userLogin } from "../services/login";
import { Link } from "react-router-dom";
// 🔥 Importamos el traductor
import { useTranslation } from 'react-i18next';

const ModalLogin = ({ setIsVisible }) => {
    const { t } = useTranslation("global"); // 🔥 Hook de traducción
    const [mensaje, setMensaje] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const submitUser = async (e) => {
        e.preventDefault();
        setMensaje("");
        setLoading(true);

        try {
            const res = await userLogin(email, password);

            if (res?.token) {
                localStorage.setItem("token", res.token);
                setIsVisible(false);
                window.location.reload(); 
            } else {
                // 🔥 Traducción dinámica del error
                const errorKey = res === "Credenciales incorrectas" ? "login.error_credenciales" : "login.error_general";
                setMensaje(t(errorKey));
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setMensaje(t("login.error_conexion"));
            setLoading(false);
        }
    }

    const handleBackgroundClick = (e) => {
        if (e.target.className === "modal-login-overlay") {
            setIsVisible(false);
        }
    };

    return (
        <section className="modal-login-overlay" onClick={handleBackgroundClick}>
            
            <div className="modal-login-card">
                
                <button className="modal-login-close-btn" onClick={() => setIsVisible(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="modal-login-header">
                    <h2 className="modal-login-title">{t("login.titulo")}</h2>
                    <p className="modal-login-subtitle">{t("login.subtitulo")}</p>
                    <div className="modal-login-divider"></div>
                </div>

                <form className="modal-login-form" onSubmit={submitUser}>
                    
                    <div className="modal-login-input-group">
                        <label className="modal-login-label">{t("login.label_email")}</label>
                        <input 
                            className="modal-login-input" 
                            type="email" 
                            placeholder={t("login.placeholder_email")} 
                            required 
                            autoComplete="email" 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>

                    <div className="modal-login-input-group">
                        <label className="modal-login-label">{t("login.label_password")}</label>
                        <input 
                            className="modal-login-input" 
                            type="password" 
                            placeholder="••••••••" 
                            required 
                            autoComplete="current-password" 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    {mensaje && (
                        <div className="modal-login-error-box">
                            <p>{mensaje}</p>
                        </div>
                    )}

                    <button 
                        className="modal-login-btn-submit" 
                        type="submit" 
                        disabled={loading}
                    >
                        {loading ? <div className="modal-login-spinner"></div> : t("login.btn_ingresar")}
                    </button>

                </form>

                <div className="modal-login-footer">
                    <Link to="/login" className="modal-login-link-btn">
                        {t("login.olvido_pass")}
                    </Link>

                    <div className="modal-login-register-area">
                        <span>{t("login.no_cuenta")}</span>
                        <Link className="modal-login-link-highlight" to="/register">
                            {t("login.registrate_aca")}
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default ModalLogin;