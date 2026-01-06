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

      {showModal
        ?
        <ModalConfirm setShowModal={setShowModal} />
        : null
      }
      <nav className="navbar">

        <div className="buttonNavContainerSession">
          {!user
            ?
            <NavLink to={"/login"}><button className="buttonIniciarSesionHome">Iniciar Sesion</button></NavLink>
            :
            ""
          }
          {/* Botón Flotante */}
          <div
            className="buttonMenuContainer"
            onClick={() => setIsVisible(true)}
          >
            <img className="buttonMenu" src={buttonMenu} alt="menu" />
          </div>
        </div>


        {/* Overlay oscuro (Fondo) */}
        <div
          className={`navbarListContainer ${isVisible ? "show" : "hide"}`}
          onClick={() => setIsVisible(false)}
        >
          {/* Menú Lateral */}
          <ul
            className={`navbarList ${isVisible ? "slide-in" : "slide-out"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* --- Links Públicos --- */}
            <li className="navbarItem">
              <NavLink to="/" className="navbarLink" onClick={() => setIsVisible(false)}>
                Inicio
              </NavLink>
            </li>
            <li className="navbarItem">
              <NavLink to="/cursos-gratuitos" className="navbarLink" onClick={() => setIsVisible(false)}>
                Eric Barone
              </NavLink>
            </li>
            <li className="navbarItem">
              <NavLink to="/cursos-pagos" className="navbarLink" onClick={() => setIsVisible(false)}>
                Rituales
              </NavLink>
            </li>
            {/* Nota: Tenías links repetidos apuntando a /cursos-pagos, revisa las rutas */}
            <li className="navbarItem">
              <NavLink to="/artesanias" className="navbarLink" onClick={() => setIsVisible(false)}>
                Artesanias Mágicas
              </NavLink>
            </li>
            <li className="navbarItem">
              <NavLink to="/sanaciones" className="navbarLink" onClick={() => setIsVisible(false)}>
                Sanaciones
              </NavLink>
            </li>

            {/* --- Lógica de Usuario Logueado --- */}
            {user ? (
              <>
                <li className="navbarItem">
                  <NavLink to="/mis-cursos" className="navbarLink" onClick={() => setIsVisible(false)}>
                    Mis cursos
                  </NavLink>
                </li>
                <li className="navbarItem">
                  <NavLink to="/contacto" className="navbarLink" onClick={() => setIsVisible(false)}>
                    Contacto
                  </NavLink>
                </li>

                {/* Footer del Menú: Usuario y Salir */}
                <li className="closeSessionItem">
                  <div className="userNameContainer">
                    <img src={userIcon} className="navbarIcon" alt="User" />
                    <p className="userName">{user?.nickname || userLog?.nickname}</p>
                  </div>

                  <img
                    src={salir}
                    alt="Cerrar sesion"
                    onClick={() => {
                      setShowModal(true);
                      setIsVisible(false);
                    }}
                    style={{ cursor: "pointer" }}
                    className="navbarIcon iconLogout"
                    title="Cerrar Sesión"
                  />
                </li>
              </>
            ) : (
              /* --- Lógica de Invitado --- */
              <>
                <li className="navbarItem">
                  <NavLink to="/login" className="navbarLink" onClick={() => setIsVisible(false)}>
                    Iniciar Sesión
                  </NavLink>
                </li>
                <li className="navbarItem">
                  <NavLink to="/register" className="navbarLink" onClick={() => setIsVisible(false)}>
                    Registrarse
                  </NavLink>
                </li>
                <li className="navbarItem">
                  <NavLink to="/contacto" className="navbarLink" onClick={() => setIsVisible(false)}>
                    Contacto
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;