import { useEffect, useState } from "react";
import { userLogin } from "../../services/login";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import Recovery from "../recovery-password/Recovery";


const Login = () => {
  const { hideLoader } = useLoading();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    hideLoader();
  }, []);

  const [mensaje, setMensaje] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recovery, setRecovery] = useState(false);

  const submitUser = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await userLogin(email, password);

      if (res?.token) {
        login(res.token);
        navigate("/");
      } else {
        setMensaje(res || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error al iniciar sesión");
    }
  };

  return (
    <main className="page-login-main">
      {/* Fondo fijo */}
      <img 
        className="page-login-bg" 
        src={"https://res.cloudinary.com/dmnksm3th/image/upload/v1770840320/inicio_dycna6.webp"} 
        alt="fondo" 
      />

      {recovery ? (
        <Recovery setRecovery={setRecovery} />
      ) : (
        <section className="page-login-container">
          
          <div className="page-login-card">
            
            <div className="page-login-header">
              <h2 className="page-login-title">Bienvenido</h2>
              <p className="page-login-subtitle">Inicia sesión para continuar</p>
              <div className="page-login-divider"></div>
            </div>

            <form className="page-login-form" onSubmit={submitUser}>
              
              <div className="page-login-input-group">
                <label className="page-login-label">Correo Electrónico</label>
                <input
                  className="page-login-input"
                  type="email"
                  placeholder="ejemplo@email.com"
                  required
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="page-login-input-group">
                <label className="page-login-label">Contraseña</label>
                <input
                  className="page-login-input"
                  placeholder="••••••••"
                  type="password"
                  required
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {mensaje && (
                <div className="page-login-error-box">
                  <p>{mensaje}</p>
                </div>
              )}

              <input
                className="page-login-btn-submit"
                type="submit"
                value="Ingresar"
              />
            </form>

            <div className="page-login-footer">
              <button 
                className="page-login-link-btn" 
                onClick={() => setRecovery(true)}
              >
                ¿Olvidaste tu contraseña?
              </button>

              <div className="page-login-register-area">
                <span>¿No tienes cuenta?</span>
                <Link className="page-login-link-highlight" to="/register">
                   Regístrate aquí
                </Link>
              </div>
            </div>

          </div>
        </section>
      )}
    </main>
  );
};

export default Login;