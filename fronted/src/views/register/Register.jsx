import { useEffect, useState } from "react";
import { userRegister } from "../../services/register";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext";
// 🔥 Importamos i18next
import { useTranslation } from 'react-i18next';

const Register = () => {
  const { t } = useTranslation("global"); // 🔥 Hook de traducción
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const { hideLoader } = useLoading();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    hideLoader();
  }, []);

  const formatName = (text) => {
    if (!text) return "";
    return text.trim().toLowerCase().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const submitUser = (e) => {
    e.preventDefault();
    setMensaje("");

    if (password !== confirmPassword) {
        setMensaje(t("register.error_match"));
        return;
    }

    setLoading(true);

    const nombreFinal = formatName(nombre);
    const apellidoFinal = formatName(apellido);

    userRegister(nombreFinal, apellidoFinal, email, password)
      .then((res) => {
        if (res?.token) {
          login(res.token);
          navigate("/");
        } else {
          // 🔥 Traducción de errores comunes del backend
          const errorMsg = res === "Error al registrarse" ? t("register.error_general") : res;
          setMensaje(errorMsg);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setMensaje(t("register.error_inesperado"));
        setLoading(false);
      });
  }

  return (
    <main className="register-page-main">
      <img className="register-page-bg" src={"https://res.cloudinary.com/dmnksm3th/image/upload/v1770840320/inicio_dycna6.webp"} alt="fondo" />

      <section className="register-page-container">
        <div className="register-page-card">
            
            <div className="register-page-header">
                <h2 className="register-page-title">{t("register.titulo")}</h2>
                <p className="register-page-subtitle">{t("register.subtitulo")}</p>
                <div className="register-page-divider"></div>
            </div>

            <form className="register-page-form" onSubmit={submitUser}>
                
                <div className="register-page-row">
                    <div className="register-page-input-group">
                        <label className="register-page-label">{t("contacto.label_nombre")}</label>
                        <input className="register-page-input" type="text" placeholder="Juan" required autoComplete="given-name" onChange={(e) => setNombre(e.target.value)} />
                    </div>
                    <div className="register-page-input-group">
                        <label className="register-page-label">{t("contacto.label_apellido")}</label>
                        <input className="register-page-input" type="text" placeholder="Pérez" required autoComplete="family-name" onChange={(e) => setApellido(e.target.value)} />
                    </div>
                </div>

                <div className="register-page-input-group">
                    <label className="register-page-label">Email</label>
                    <input className="register-page-input" type="email" placeholder="ejemplo@email.com" required autoComplete="email" onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="register-page-input-group">
                    <label className="register-page-label">{t("login.label_password")}</label>
                    <input className="register-page-input" type="password" placeholder="••••••••" required autoComplete="new-password" onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="register-page-input-group">
                    <label className="register-page-label">{t("recovery.label_confirmar")}</label>
                    <input className="register-page-input" type="password" placeholder="••••••••" required autoComplete="new-password" onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                {mensaje && (
                    <div className="register-page-error-box"><p>{mensaje}</p></div>
                )}

                <button 
                    className="register-page-btn-submit" 
                    type="submit" 
                    disabled={loading}
                >
                    {loading ? <div className="register-page-spinner"></div> : t("navbar.registrarse")}
                </button>

            </form>

            <div className="register-page-footer">
                <span>{t("register.ya_cuenta")}</span>
                <Link className="register-page-link-highlight" to="/login">{t("login.btn_ingresar")}</Link>
            </div>

        </div>
      </section>
    </main>
  );
}

export default Register;