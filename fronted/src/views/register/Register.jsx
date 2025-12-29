import { useEffect, useState } from "react";
import { userRegister } from "../../services/register";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext";
import fondo from "../../assets/fondos/inicio.png";


const Register = () => {

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const { hideLoader } = useLoading()
  const { login } = useAuth();
  const navigate = useNavigate();

 useEffect(() => {
    hideLoader();
  }, []);

  const submitUser = (e) => {

    e.preventDefault();

    userRegister(nombre, apellido, email, password)
      .then((res) => {
        if (res?.token) {
          login(res.token);
          navigate("/");
          
        } else {
          setMensaje(res);
        }
      })
      .catch(err => console.error(err))


  }


  return (
    <>
      <main>
        <img className="bgRegister" src={fondo} alt="fondo" />
        <div className="registerContainer">
          <div className="modalLogin">
            <h2 className="modalTitle">Registrarse</h2>
            <form className="formAuth" onSubmit={submitUser}>
              <label className="labelForm">Nombre</label>
              <input className="formInput inputRegister" type="text" name="name" id="name" placeholder="Nombre" required autoComplete="given-name" onChange={(e) => setNombre(e.target.value)} />
              <label className="labelForm">Apellido</label>
              <input className="formInput inputRegister" type="text" name="lastname" id="lastname" placeholder="Apellido" required autoComplete="family-name" onChange={(e) => setApellido(e.target.value)} />
              <label className="labelForm">Corre Electronico</label>
              <input className="formInput inputRegister" type="email" name="email" id="email" placeholder="Correo" required autoComplete="email" onChange={(e) => setEmail(e.target.value)} />
              <label className="labelForm">Contraseña</label>
              <input className="formInput inputRegister" type="password" name="password" id="password" placeholder="Contraseña" required autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} />
              <input className="formInputButton" type="submit" value="Registrarse" />
            </form>
            <p id="mensaje" className="messageErrorLogin">{mensaje}</p>
            <Link className="linkLogin" to={"/login"}><p className="linkLoginP">¿Ya tienes una cuenta?<span className="registerLink">Iniciar Sesión</span></p></Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default Register;