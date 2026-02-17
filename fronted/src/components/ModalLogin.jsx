import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Asumo que este path es correcto desde components/
import { userLogin } from "../services/login";
import { Link } from "react-router-dom";

const ModalLogin = ({ setIsVisible }) => {

    const [mensaje, setMensaje] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // 🔥 ESTADO DE CARGA
    const { login } = useAuth(); // Usamos login() del contexto si está disponible, sino setUser como tenías

    const submitUser = async (e) => {
        e.preventDefault();
        setMensaje("");
        setLoading(true); // 🔥 ACTIVAMOS SPINNER

        try {
            const res = await userLogin(email, password);

            if (res?.token) {
                // Si tu contexto tiene la función login, úsala. Si no, usa setUser como antes.
                // login(res.token); 
                
                // Mantenemos tu lógica original de recarga:
                localStorage.setItem("token", res.token); // Guardamos token manualmente si no usas login()
                setIsVisible(false);
                window.location.reload(); // 🔄 RECARGA LA PÁGINA
            } else {
                setMensaje(res || "Credenciales incorrectas");
                setLoading(false); // 🔥 APAGAMOS SI FALLA
            }
        } catch (err) {
            console.error(err);
            setMensaje("Error al iniciar sesión");
            setLoading(false); // 🔥 APAGAMOS SI HAY ERROR
        }
    }

    // Cerramos el modal si hacen click fuera de la tarjeta (en el fondo oscuro)
    const handleBackgroundClick = (e) => {
        if (e.target.className === "modal-login-overlay") {
            setIsVisible(false);
        }
    };

    return (
        <section className="modal-login-overlay" onClick={handleBackgroundClick}>
            
            <div className="modal-login-card">
                
                {/* Botón Cerrar (X) */}
                <button className="modal-login-close-btn" onClick={() => setIsVisible(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="modal-login-header">
                    <h2 className="modal-login-title">Bienvenido</h2>
                    <p className="modal-login-subtitle">Inicia sesión para continuar</p>
                    <div className="modal-login-divider"></div>
                </div>

                <form className="modal-login-form" onSubmit={submitUser}>
                    
                    <div className="modal-login-input-group">
                        <label className="modal-login-label">Correo Electrónico</label>
                        <input 
                            className="modal-login-input" 
                            type="email" 
                            placeholder="ejemplo@email.com" 
                            required 
                            autoComplete="email" 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>

                    <div className="modal-login-input-group">
                        <label className="modal-login-label">Contraseña</label>
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

                    {/* BOTÓN CON SPINNER */}
                    <button 
                        className="modal-login-btn-submit" 
                        type="submit" 
                        disabled={loading}
                    >
                        {loading ? <div className="modal-login-spinner"></div> : "Iniciar Sesión"}
                    </button>

                </form>

                <div className="modal-login-footer">
                    <Link to="/login" className="modal-login-link-btn">
                        ¿Olvidaste tu contraseña?
                    </Link>

                    <div className="modal-login-register-area">
                        <span>¿No tienes cuenta?</span>
                        <Link className="modal-login-link-highlight" to="/register">
                            Regístrate aquí
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default ModalLogin;