import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { userLogin } from "../services/login";
import { Link } from "react-router-dom";
import cerrar from "../assets/iconos/cerrar.png";

const ModalLogin = ({ setIsVisible }) => {

    const [mensaje, setMensaje] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useAuth();


    const submitUser = (e) => {

        e.preventDefault();

        userLogin(email, password)
            .then((res) => {
                if (res.token) {
                    setUser({ email });
                    setIsVisible(false);
                    window.location.reload();

                } else {
                    setMensaje(res);
                }
            })
            .catch(err => console.error(err))


    }



    return (
        <>
            <section className="modalLoginContainer">
                <div className="modalLogin">
                    <div className="closeModalContainer">
                        <img className="closeModalIcon" src={cerrar} alt="Boton cerrar" onClick={() => setIsVisible(false)} />
                    </div>
                    <h2 className="modalTitle">Iniciar sesión</h2>
                    <form className="formAuth" id="loginForm" onSubmit={submitUser}>
                       
                        <input className="formInput inputEmailLogin inputIcon" type="email" name="email" id="email" placeholder="Correo" required autoComplete="email" onChange={(e) => setEmail(e.target.value)} />
                        <input className="formInput inputPasswordLogin inputIcon" type="password" name="password" id="password" placeholder="Contraseña" autoComplete="current-password" required onChange={(e) => setPassword(e.target.value)} />
                        <p className="messageErrorLogin">{mensaje}</p>
                        <input className="formInputButton" type="submit" value="Iniciar sesión" />
                    </form>
                    <Link className="notAccountLink">Olvidé mi Contraseña</Link>
                    <Link className="notAccountLink" to={"/register"}>¿No tienes una cuenta?<span className="registerLink">Registrarse</span></Link>
                </div>
            </section>
        </>
    )
}

export default ModalLogin;