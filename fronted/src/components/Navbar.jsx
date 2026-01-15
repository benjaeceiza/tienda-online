import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import userIcon from "../assets/iconos/avatar.png";
import salir from "../assets/logos/logout.png";
import { getUser } from "../services/getUser";
import { useEffect, useState } from "react";
import buttonMenu from "../assets/iconos/hamburguesa.png";
import ModalConfirm from "./ModalConfirm";

const Navbar = () => {
  const { user } = useAuth();
  const [userLog, setUserLog] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token");
      getUser(token)
        .then((data) => setUserLog(data.user || {}))
        .catch((err) => console.error(err));
    }
  }, [user]);

  return (
    <>
      {showModal ? <ModalConfirm setShowModal={setShowModal} /> : null}

      {/* --- CAMBIO: Header Container --- */}
      <header className="headerMain">

        {/* 1. SECCIÓN IZQUIERDA: LOGO */}
        <div className="logoContainer">
          {/* Aquí puedes poner tu etiqueta <img src={tuLogo} /> */}
          <h2 className="logoText">SC</h2>
        </div>

        {/* 2. SECCIÓN DERECHA: BOTONES */}
        <div className="actionsContainer">
          {!user ? (
            <NavLink to={"/login"}>
              <button className="buttonIniciarSesionHome">Iniciar Sesión</button>
            </NavLink>
          ) : (
            ""
          )}

          {/* Botón Hamburguesa */}
          <div
            className="buttonMenuContainer"
            onClick={() => setIsVisible(true)}
          >
            <img className="buttonMenu" src={buttonMenu} alt="menu" />
          </div>
        </div>
      </header>

      {/* --- EL RESTO DEL MENÚ LATERAL SE MANTIENE IGUAL --- */}
      <div
        className={`navbarListContainer ${isVisible ? "show" : "hide"}`}
        onClick={() => setIsVisible(false)}
      >
        <ul
          className={`navbarList ${isVisible ? "slide-in" : "slide-out"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ... Todo tu código de la lista del menú sigue aquí igual ... */}
          {/* He resumido esta parte para no ocupar espacio, ya que no cambia */}

          {/* Links Públicos */}
          <li className="navbarItem">
            <NavLink to="/" className="navbarLink" onClick={() => setIsVisible(false)}>Inicio</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/cursos/eric barone" className="navbarLink" onClick={() => setIsVisible(false)}>Eric Barone</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/cursos/rituales" className="navbarLink" onClick={() => setIsVisible(false)}>Rituales</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/cursos/artesanias magicas" className="navbarLink" onClick={() => setIsVisible(false)}>Artesanias Mágicas</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/cursos/sistema de sanacion cosmotelurica" className="navbarLink" onClick={() => setIsVisible(false)}>Sist. Sanacion</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/contacto" className="navbarLink" onClick={() => setIsVisible(false)}>Contacto</NavLink>
          </li>

          {/* Lógica de Usuario */}
          {user ? (
            <>
              <li className="navbarItem">
                <NavLink to="/mis-cursos" className="navbarLink" onClick={() => setIsVisible(false)}>Mis cursos</NavLink>
              </li>
              <li className="closeSessionItem">
                <div className="userNameContainer">
                  <img src={userIcon} className="navbarIcon" alt="User" />
                  <p className="userName">{user?.nickname || userLog?.nickname}</p>
                </div>
                <img src={salir} alt="Cerrar sesion" onClick={() => { setShowModal(true); setIsVisible(false); }} className="navbarIcon iconLogout" />
              </li>
            </>
          ) : (
            <li className="sessionItem">
              <NavLink to="/login" className="navbarLink navbarSessionLink" onClick={() => setIsVisible(false)}>Iniciar Sesión</NavLink>
              <NavLink to="/register" className="navbarLink navbarSessionLink" onClick={() => setIsVisible(false)}>Registrarse</NavLink>
            </li>
          )}

        </ul>
      </div>
    </>
  );
};

export default Navbar;