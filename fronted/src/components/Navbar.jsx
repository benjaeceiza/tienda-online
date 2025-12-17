import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logos/logo.png";
import salir from "../assets/logos/logout.png";
import { getUser } from "../services/getUser";
import { useEffect, useState } from "react";
import buttonMenu from "../assets/iconos/hamburguesa.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [userLog, setUserLog] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token");
      getUser(token)
        .then((data) => setUserLog(data.user || {}))
        .catch((err) => console.error(err));
    }
  }, [user]);

  const closeSession = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">

        <div
          className="buttonMenuContainer"
          onClick={() => setIsVisible(true)}
        >
          <img className="buttonMenu" src={buttonMenu} alt="boton menu" />
        </div>

        <div
          className={`navbarListContainer ${isVisible ? "show" : "hide"}`}
          onClick={() => setIsVisible(false)}
        >
          <ul
            className={`navbarList ${isVisible ? "slide-in" : "slide-out"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <li className="navbarItem">
              <NavLink
                to="/"
                className="navbarLink"
                onClick={() => setIsVisible(false)}
              >
                Inicio
              </NavLink>
            </li>
            <li className="navbarItem">
              <NavLink
                to="/cursos-gratuitos"
                className="navbarLink"
                onClick={() => setIsVisible(false)}
              >
                Cursos gratuitos
              </NavLink>
            </li>
            <li className="navbarItem">
              <NavLink
                to="/cursos-pagos"
                className="navbarLink"
                onClick={() => setIsVisible(false)}
              >
                Cursos Pagos
              </NavLink>
            </li>
             
          
            {user ? (
              <>
                <li className="navbarItem">
                  <NavLink
                    to="/mis-cursos"
                    className="navbarLink"
                    onClick={() => setIsVisible(false)}
                  >
                    Mis cursos
                  </NavLink>
                </li>
              
               <li className="navbarItem">
                  <NavLink
                    to="/contacto"
                    className="navbarLink"
                    onClick={() => setIsVisible(false)}
                  >
                    CONTACTO
                  </NavLink>
                </li>
                <li className="navbarItem">
                  <img
                    src={salir}
                    alt="Cerrar sesion"
                    onClick={() => {
                      closeSession();
                      setIsVisible(false);
                    }}
                    style={{ cursor: "pointer" }} 
                  />
                </li>

                
              </>
            ) : (
              <>
                <li className="navbarItem">
                  <NavLink
                    to="/login"
                    className="navbarLink"
                    onClick={() => setIsVisible(false)}
                  >
                    Iniciar Sesion
                  </NavLink>
                </li>
                <li className="navbarItem">
                  <NavLink
                    to="/register"
                    className="navbarLink"
                    onClick={() => setIsVisible(false)}
                  >
                    Registrarse
                  </NavLink>
                </li>
                <li className="navbarItem">
                  <NavLink
                    to="/contacto"
                    className="navbarLink"
                    onClick={() => setIsVisible(false)}
                  >
                    CONTACTO
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