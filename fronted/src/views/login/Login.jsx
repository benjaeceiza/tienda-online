import { useEffect, useState } from "react";
import { userLogin } from "../../services/login";


const Login = () => {

  const [mensaje, setMensaje] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitUser = (e) => {

    e.preventDefault();
    
    userLogin(email, password)
      .then(data => setMensaje(data || ""))
      .catch(err => console.error(err))

   console.log(mensaje);
   
  }




  return (
    <>

      <main className="main">
        <h1 className="title">LOGIN</h1>
        <section className="sectionCourses">
          <form className="formLogin" id="loginForm" onSubmit={submitUser}>
            <input className="formInput" type="email" name="email" id="email" placeholder="Correo" required onChange={(e) => setEmail(e.target.value)} />
            <input className="formInput" type="password" name="password" id="password" placeholder="Contraseña" required onChange={(e) => setPassword(e.target.value)} />
            <input className="formInput" type="submit" value="Iniciar Sesion"/>
          </form>
          <p id="mensaje">{mensaje}</p>
        </section>
      </main>
    </>
  )
}

export default Login;