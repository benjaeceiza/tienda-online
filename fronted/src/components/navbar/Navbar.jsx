import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import userIcon from "../../assets/iconos/usuario-mob.png";
import { getUser } from "../../services/getUser";
import { useEffect, useState } from "react";
import buttonMenu from "../../assets/iconos/hamburguesa.png";
import logo from "../../assets/logos/logo-tete.png";
import ModalUser from "../modal-user/ModalUser";


const Navbar = () => {
  const { user, logout } = useAuth();
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

  // 🔥 VALIDACIÓN DE ROL: Chequeamos si es administrador
  const isAdmin = user?.rol === "admin" || user?.rol === "administrador" || userLog?.rol === "admin" || userLog?.rol === "administrador";

  return (
    <>
      <ModalUser
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        user={user}
        onLogout={logout}
      />

      {/* --- Header Container --- */}
      <nav className="headerMain">
        {/* 1. SECCIÓN IZQUIERDA: LOGO */}
        <div className="logoContainer">
          <Link to="/" className="logoLinkMob"><img className="logoText" src={logo} alt="logo" /></Link>
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
      </nav>

      {/* --- MENÚ LATERAL --- */}
      <div
        className={`navbarListContainer ${isVisible ? "show" : "hide"}`}
        onClick={() => setIsVisible(false)}
      >
        <ul
          className={`navbarList ${isVisible ? "slide-in" : "slide-out"}`}
          onClick={(e) => e.stopPropagation()}
        >

          {/* Links Públicos */}
          <li className="navbarItem">
            <NavLink to="/" className="navbarLinkMob" onClick={() => setIsVisible(false)}>Inicio</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/cursos/rituales" className="navbarLinkMob" onClick={() => setIsVisible(false)}>Rituales</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/cursos/artesanias magicas" className="navbarLinkMob" onClick={() => setIsVisible(false)}>Artesanias Mágicas</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/cursos/sistema de sanacion en camilla" className="navbarLinkMob" onClick={() => setIsVisible(false)}>Sist. Sanación en camilla</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/cursos/anexos" className="navbarLinkMob" onClick={() => setIsVisible(false)}>Anexos</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/cursos/eric barone" className="navbarLinkMob" onClick={() => setIsVisible(false)}>Eric Barone</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/alicia-tete" className="navbarLinkMob" onClick={() => setIsVisible(false)}>Alicia tete</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/contacto" className="navbarLinkMob" onClick={() => setIsVisible(false)}>Contacto</NavLink>
          </li>

          {/* Lógica de Usuario */}
          {user ? (
            <>


              <li className="navbarItem">
                <NavLink to="/mis-cursos" className="navbarLinkMob" onClick={() => setIsVisible(false)}>Mis cursos</NavLink>
              </li>
              {/* 🔥 BOTÓN DE ADMIN: Solo aparece si isAdmin es true */}
              {isAdmin && (
                <li className="navbarItem">
                  <NavLink
                    to="/admin"
                    className="navbarLinkMob"
                    onClick={() => setIsVisible(false)}
                    style={{ color: "#e040fb", fontWeight: "bold" }} // Fucsia para que destaque en el celu
                  >
                    Dashboard Admin
                  </NavLink>
                </li>
              )}
              <li className="closeSessionItem">
                <div className="userNameContainerMob" onClick={() => setShowModal(true)}>
                  <img src={userIcon} className="navbarIcon" alt="User" />
                  <p className="userNameMob">{user?.nickname || userLog?.nickname}</p>
                </div>
              </li>


            </>
          ) : (
            <li className="sessionItem">
              <NavLink to="/login" className="navbarLinkMob navbarSessionLink" onClick={() => setIsVisible(false)}>Iniciar Sesión</NavLink>
              <NavLink to="/register" className="navbarLinkMob navbarSessionLink" onClick={() => setIsVisible(false)}>Registrarse</NavLink>
            </li>
          )}

        </ul>
      </div>
    </>
  );
};

export default Navbar;