import { useEffect, useState } from "react";
import { userRegister } from "../../services/register";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  
  // 🔥 NUEVO ESTADO PARA EL SPINNER
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
        setMensaje("Las contraseñas no coinciden");
        return;
    }

    // 🔥 ACTIVAMOS EL SPINNER
    setLoading(true);

    const nombreFinal = formatName(nombre);
    const apellidoFinal = formatName(apellido);

    userRegister(nombreFinal, apellidoFinal, email, password)
      .then((res) => {
        if (res?.token) {
          login(res.token);
          navigate("/");
          // No hace falta setLoading(false) porque nos vamos de la página
        } else {
          setMensaje(res || "Error al registrarse");
          setLoading(false); // 🔥 APAGAMOS SI HAY ERROR
        }
      })
      .catch(err => {
        console.error(err);
        setMensaje("Ocurrió un error inesperado");
        setLoading(false); // 🔥 APAGAMOS SI HAY ERROR
      });
  }

  return (
    <main className="register-page-main">
      <img className="register-page-bg" src={"https://res.cloudinary.com/dmnksm3th/image/upload/v1770840320/inicio_dycna6.webp"} alt="fondo" />

      <section className="register-page-container">
        <div className="register-page-card">
            
            <div className="register-page-header">
                <h2 className="register-page-title">Crear Cuenta</h2>
                <p className="register-page-subtitle">Únete a nuestra comunidad</p>
                <div className="register-page-divider"></div>
            </div>

            <form className="register-page-form" onSubmit={submitUser}>
                
                <div className="register-page-row">
                    <div className="register-page-input-group">
                        <label className="register-page-label">Nombre</label>
                        <input className="register-page-input" type="text" placeholder="Juan" required autoComplete="given-name" onChange={(e) => setNombre(e.target.value)} />
                    </div>
                    <div className="register-page-input-group">
                        <label className="register-page-label">Apellido</label>
                        <input className="register-page-input" type="text" placeholder="Pérez" required autoComplete="family-name" onChange={(e) => setApellido(e.target.value)} />
                    </div>
                </div>

                <div className="register-page-input-group">
                    <label className="register-page-label">Correo Electrónico</label>
                    <input className="register-page-input" type="email" placeholder="ejemplo@email.com" required autoComplete="email" onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="register-page-input-group">
                    <label className="register-page-label">Contraseña</label>
                    <input className="register-page-input" type="password" placeholder="••••••••" required autoComplete="new-password" onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="register-page-input-group">
                    <label className="register-page-label">Confirmar Contraseña</label>
                    <input className="register-page-input" type="password" placeholder="••••••••" required autoComplete="new-password" onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                {mensaje && (
                    <div className="register-page-error-box"><p>{mensaje}</p></div>
                )}

                {/* 🔥 CAMBIAMOS INPUT POR BUTTON PARA PODER PONER EL SPINNER ADENTRO */}
                <button 
                    className="register-page-btn-submit" 
                    type="submit" 
                    disabled={loading} // Deshabilitar mientras carga
                >
                    {loading ? <div className="register-page-spinner"></div> : "Registrarse"}
                </button>

            </form>

            <div className="register-page-footer">
                <span>¿Ya tienes una cuenta?</span>
                <Link className="register-page-link-highlight" to="/login">Inicia Sesión</Link>
            </div>

        </div>
      </section>
    </main>
  );
}

export default Register;