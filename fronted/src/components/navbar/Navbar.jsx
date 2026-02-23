import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import userIcon from "../../assets/iconos/usuario-mob.png";
import { getUser } from "../../services/getUser";
import { useEffect, useState } from "react";
import buttonMenu from "../../assets/iconos/hamburguesa.png";
import logo from "../../assets/logos/logo-tete.png";
import ModalUser from "../modal-user/ModalUser";
// 🔥 Importamos el traductor
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [userLog, setUserLog] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // 🔥 Iniciamos el hook de traducción
  const { t, i18n } = useTranslation("global");

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token");
      getUser(token)
        .then((data) => setUserLog(data.user || {}))
        .catch((err) => console.error(err));
    }
  }, [user]);

  const isAdmin = user?.rol === "admin" || user?.rol === "administrador" || userLog?.rol === "admin" || userLog?.rol === "administrador";

  // Función para cambiar idioma
  const cambiarIdioma = (idioma) => {
    i18n.changeLanguage(idioma);
  };

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
        <div className="logoContainer">
          <Link to="/" className="logoLinkMob"><img className="logoText" src={logo} alt="logo" /></Link>
        </div>

        <div className="actionsContainer" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* 🔥 SELECTOR DE IDIOMA MOBILE */}
          <div className="lang-selector-mob" style={{ display: 'flex', gap: '5px' }}>
            <button 
                onClick={() => cambiarIdioma("es")} 
                style={{ background: i18n.language === 'es' ? '#e040fb' : 'transparent', border: '1px solid #e040fb', color: 'black', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}
            >
                ES
            </button>
            <button 
                onClick={() => cambiarIdioma("en")} 
                style={{ background: i18n.language === 'en' ? '#e040fb' : 'transparent', border: '1px solid #e040fb', color: 'black', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}
            >
                EN
            </button>
          </div>

          {!user && (
            <NavLink to={"/login"}>
              <button className="buttonIniciarSesionHome">{t("navbar.iniciar_sesion")}</button>
            </NavLink>
          )}

          <div className="buttonMenuContainer" onClick={() => setIsVisible(true)}>
            <img className="buttonMenu" src={buttonMenu} alt="menu" />
          </div>
        </div>
      </nav>

      <div className={`navbarListContainer ${isVisible ? "show" : "hide"}`} onClick={() => setIsVisible(false)}>
        <ul className={`navbarList ${isVisible ? "slide-in" : "slide-out"}`} onClick={(e) => e.stopPropagation()}>

          <li className="navbarItem">
            <NavLink to="/" className="navbarLinkMob" onClick={() => setIsVisible(false)}>{t("navbar.inicio")}</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/cursos/rituales" className="navbarLinkMob" onClick={() => setIsVisible(false)}>{t("navbar.cursos_rituales")}</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/cursos/artesanias magicas" className="navbarLinkMob" onClick={() => setIsVisible(false)}>{t("navbar.cursos_artesanias")}</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/cursos/sistema de sanacion en camilla" className="navbarLinkMob" onClick={() => setIsVisible(false)}>{t("navbar.cursos_sanacion")}</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/cursos/anexos" className="navbarLinkMob" onClick={() => setIsVisible(false)}>{t("navbar.cursos_anexos")}</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/cursos/eric barone" className="navbarLinkMob" onClick={() => setIsVisible(false)}>{t("navbar.cursos_eric")}</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/alicia-tete" className="navbarLinkMob" onClick={() => setIsVisible(false)}>{t("navbar.alicia_tete")}</NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to="/contacto" className="navbarLinkMob" onClick={() => setIsVisible(false)}>{t("navbar.contacto")}</NavLink>
          </li>

          {user ? (
            <>
              <li className="navbarItem">
                <NavLink to="/mis-cursos" className="navbarLinkMob" onClick={() => setIsVisible(false)}>{t("navbar.mis_cursos")}</NavLink>
              </li>
              {isAdmin && (
                <li className="navbarItem">
                  <NavLink to="/admin" className="navbarLinkMob" onClick={() => setIsVisible(false)} style={{ color: "#e040fb", fontWeight: "bold" }}>
                    {t("navbar.admin_dashboard", "Dashboard Admin")}
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
              <NavLink to="/login" className="navbarLinkMob navbarSessionLink" onClick={() => setIsVisible(false)}>{t("navbar.iniciar_sesion")}</NavLink>
              <NavLink to="/register" className="navbarLinkMob navbarSessionLink" onClick={() => setIsVisible(false)}>{t("navbar.registrarse")}</NavLink>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;