import { useEffect, useState } from "react";
import { userLogin } from "../../services/login";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import fondo from "../../assets/fondos/fondo-violeta.jpg";
import Recovery from "../recovery-password/Recovery";

const Login = () => {
  const { hideLoader } = useLoading();
  const { login } = useAuth(); // 👈 CAMBIO CLAVE
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

      /**
       * ⬇️ userLogin DEBE devolver algo así:
       * { token: "eyJhbGciOi..." }
       */
      if (res?.token) {
        login(res.token);   // 🔥 ESTO actualiza el navbar
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
    <main>
      <img className="bgLogin" src={fondo} alt="fondo" />

      {recovery ? (
        <Recovery setRecovery={setRecovery} />
      ) : (
        <section className="loginContainer">
          <div className="modalLogin">
            <h2 className="modalTitle">Iniciar sesión</h2>

            <form className="formAuth" onSubmit={submitUser}>
              <label className="labelForm">Correo Electronico</label>
              <input
                className="formInput"
                type="email"
                required
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="labelForm">Contraseña</label>
              <input
                className="formInput"
                type="password"
                required
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />

              {mensaje && (
                <p className="messageErrorLogin">{mensaje}</p>
              )}

              <input
                className="formInputButton"
                type="submit"
                value="Iniciar Sesión"
              />
            </form>

            <p className="notAccountLink" onClick={() => setRecovery(true)}>
              Olvidé mi Contraseña
            </p>

            <Link className="notAccountLink" to="/register">
              ¿No tienes una cuenta?
              <span className="registerLink"> Registrarse</span>
            </Link>
          </div>
        </section>
      )}
    </main>
  );
};

export default Login;
