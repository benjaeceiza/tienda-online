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

 

  const [mensaje, setMensaje] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recovery, setRecovery] = useState(false);

  // 🔥 1. ESTADO DE CARGA
  const [loading, setLoading] = useState(false);

  const submitUser = async (e) => {
    e.preventDefault();
    setMensaje("");

    // 🔥 2. ACTIVAMOS EL SPINNER
    setLoading(true);

    try {
      const res = await userLogin(email, password);

      if (res?.token) {
        login(res.token);
        navigate("/");
        // No hace falta setLoading(false) porque cambiamos de página
      } else {
        setMensaje(res || "Credenciales incorrectas");
        setLoading(false); // 🔥 APAGAMOS SI FALLA
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error al iniciar sesión");
      setLoading(false); // 🔥 APAGAMOS SI HAY ERROR
    }
  };

  return (
    <main className="page-login-main">
      <img
        className="page-login-bg"
        src={"https://res.cloudinary.com/dmnksm3th/image/upload/v1770840320/inicio_dycna6.webp"}
        alt="fondo"
        onLoad={hideLoader}
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

              {/* 🔥 3. CAMBIAMOS INPUT POR BUTTON PARA EL SPINNER */}
              <button
                className="page-login-btn-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? <div className="page-login-spinner"></div> : "Ingresar"}
              </button>

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