import {  useState } from "react";
import { userLogin } from "../../services/login";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import Recovery from "../recovery-password/Recovery";
// 🔥 Importamos i18next
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation("global"); // 🔥 Iniciamos el traductor
  const { hideLoader } = useLoading();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mensaje, setMensaje] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recovery, setRecovery] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitUser = async (e) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    try {
      const res = await userLogin(email, password);

      if (res?.token) {
        login(res.token);
        navigate("/");
      } else {
        // 🔥 Traducción dinámica del error
        const errorKey = res === "Email o Contraseña inválido" ? "login.error_credenciales" : "login.error_general";
        setMensaje(t(errorKey));
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setMensaje(t("login.error_conexion"));
      setLoading(false);
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
              <h2 className="page-login-title">{t("login.titulo")}</h2>
              <p className="page-login-subtitle">{t("login.subtitulo")}</p>
              <div className="page-login-divider"></div>
            </div>

            <form className="page-login-form" onSubmit={submitUser}>
              <div className="page-login-input-group">
                <label className="page-login-label">{t("login.label_email")}</label>
                <input
                  className="page-login-input"
                  type="email"
                  placeholder={t("login.placeholder_email")}
                  required
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="page-login-input-group">
                <label className="page-login-label">{t("login.label_password")}</label>
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

              <button
                className="page-login-btn-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? <div className="page-login-spinner"></div> : t("login.btn_ingresar")}
              </button>
            </form>

            <div className="page-login-footer">
              <button
                className="page-login-link-btn"
                onClick={() => setRecovery(true)}
              >
                {t("login.olvido_pass")}
              </button>

              <div className="page-login-register-area">
                <span>{t("login.no_cuenta")}</span>
                <Link className="page-login-link-highlight" to="/register">
                  {t("login.registrate_aca")}
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