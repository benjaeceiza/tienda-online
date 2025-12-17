import { useEffect, useState } from "react";
import { userLogin } from "../../services/login";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import fondo from "../../assets/fondos/inicio.png";
import Recovery from "../recovery-password/Recovery";

const Login = () => {
  const { hideLoader } = useLoading();


      hideLoader();


  const [mensaje, setMensaje] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [recovery, setRecovery] = useState(false);

  const submitUser = (e) => {

    e.preventDefault();

    userLogin(email, password)
      .then((res) => {
        if (res.includes("success")) {
          navigate("/");
          setUser({ email });
        } else {
          setMensaje(res);
        }
      })
      .catch(err => console.error(err))


  }




  return (
    <>

      <main>
        <img className="bgLogin" src={fondo} alt="fondo" />
        {recovery ? <Recovery setRecovery={setRecovery} />
          :
          <section className="loginContainer">
            <div className="modalLogin">
              <h2 className="modalTitle">Iniciar sesión</h2>
              <form className="formAuth" id="loginForm" onSubmit={submitUser}>
                <label className="labelForm">Correo Electronico</label>
                <input className="formInput" type="email" name="email" id="email" placeholder="Correo" required autoComplete="email" onChange={(e) => setEmail(e.target.value)} />
                <label className="labelForm">Contraseña</label>
                <input className="formInput" type="password" name="password" id="password" placeholder="Contraseña" autoComplete="current-password" required onChange={(e) => setPassword(e.target.value)} />
                <p className="messageErrorLogin">{mensaje}</p>
                <input className="formInputButton" type="submit" value="Iniciar Sesion" />
              </form>
              <p className="notAccountLink" onClick={() => setRecovery(true)}>Olvidé mi Contraseña</p>
              <Link className="notAccountLink" to={"/register"}>¿No tienes una cuenta?<span className="registerLink">Registrarse</span></Link>
            </div>
          </section>
        }

      </main>
    </>
  )
}

export default Login;