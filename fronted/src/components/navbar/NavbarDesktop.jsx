import { useEffect, useState, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getUser } from "../../services/getUser";
import { useAuth } from '../../context/AuthContext';
import userIcon from "../../assets/iconos/avatar.png";
import ModalUser from '../modal-user/ModalUser';
import logo from "../../assets/logos/logo-tete.png";
// 🔥 Ya tenías importado useTranslation, perfecto.
import { useTranslation } from 'react-i18next';

const NavbarDesktop = () => {
    const { user } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userLog, setUserLog] = useState({});
    const [showModal, setShowModal] = useState(false);
    const { logout } = useAuth();
    const { t, i18n } = useTranslation("global");

    const dropdownRef = useRef(null);
    const location = useLocation();

    // 🔥 Traducimos las opciones del dropdown
    const cursosOptions = [
        { label: t("navbar.cursos_rituales", "Rituales"), path: "/cursos/rituales" },
        { label: t("navbar.cursos_artesanias", "Artesanías mágicas"), path: "/cursos/artesanias magicas" },
        { label: t("navbar.cursos_eric", "Eric Barone"), path: "/cursos/eric barone" },
        { label: t("navbar.cursos_sanacion", "Sistema de sanación en camilla"), path: "/cursos/sistema de sanacion en camilla" },
        { label: t("navbar.cursos_anexos", "Anexos"), path: "/cursos/anexos" },
    ];

    useEffect(() => {
        if (user) {
            const token = localStorage.getItem("token");
            getUser(token)
                .then((data) => setUserLog(data.user || {}))
                .catch((err) => console.error(err));
        }
    }, [user]);

    useEffect(() => {
        setDropdownOpen(false);
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const onHandleDropDown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    const cambiarIdioma = (idioma) => {
        i18n.changeLanguage(idioma);
    };

    const isAdmin = user?.rol === "admin" || user?.rol === "administrador" || userLog?.rol === "admin" || userLog?.rol === "administrador";

    return (
        <>
            <ModalUser
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                user={user}
                onLogout={logout}
            />
            <nav className="navbar-desktop">
                <div className="navbar-logo-desktop">
                    <NavLink to={"/"}><img className='logo-navbar' src={logo} alt='logo' /></NavLink>
                </div>

                <ul className="navbar-links-desktop">

                    {/* 🔥 Agregamos el selector de idioma acá, queda sutil y prolijo */}
                    <li className="nav-item nav-lang-selector" style={{ display: 'flex', gap: '5px', marginRight: '15px' }}>
                        <button 
                            onClick={() => cambiarIdioma("es")} 
                            style={{ background: i18n.language === 'es' ? '#e040fb' : 'transparent', border: '1px solid #e040fb', color: 'black', padding: '3px 8px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            ES
                        </button>
                        <button 
                            onClick={() => cambiarIdioma("en")} 
                            style={{ background: i18n.language === 'en' ? '#e040fb' : 'transparent', border: '1px solid #e040fb', color: 'black', padding: '3px 8px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            EN
                        </button>
                    </li>

                    <li
                        ref={dropdownRef}
                        className="nav-item-desktop dropdown-desktop"
                        onClick={() => onHandleDropDown()}
                    >
                        <span className="nav-link-desktop cursor-pointer">
                            {/* 🔥 Reemplazamos "Cursos" fijo por la traducción */}
                            {t("navbar.cursos", "Cursos")} ▾
                        </span>

                        {dropdownOpen && (
                            <ul className="dropdown-menu-desktop" >
                                {cursosOptions.map((option, index) => (
                                    <li key={index} className="dropdown-item-desktop">
                                        <NavLink className='nav-link-desktop' to={option.path}>{option.label}</NavLink>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>

                    <li className="nav-item">
                        <NavLink to={"/alicia-tete"} className="nav-link-desktop">Alicia tete</NavLink>
                    </li>
                    <li className="nav-item">
                        {/* 🔥 Reemplazamos "Contacto" fijo por la traducción */}
                        <NavLink to={"/contacto"} className="nav-link-desktop">{t("navbar.contacto", "Contacto")}</NavLink>
                    </li>

                    {
                        user ?
                            <>
                                {isAdmin && (
                                    <li className='nav-item'>
                                        <NavLink
                                            to={"/admin"}
                                            className="nav-link-desktop"
                                            style={{ color: "#e040fb", fontWeight: "bold" }}
                                        >
                                            Dashboard
                                        </NavLink>
                                    </li>
                                )}

                                <li className='nav-item'>
                                    {/* 🔥 Traducción para "Mis Cursos" */}
                                    <NavLink to={"/mis-cursos"} className="nav-link-desktop">{t("navbar.mis_cursos", "Mis Cursos")}</NavLink>
                                </li>
                                <li className='nav-item-close'>
                                    <div className="userNameContainer" onClick={() => setShowModal(true)}>
                                        <img src={userIcon} className="navbarIcon" alt="User" />
                                        <p className="userName">{user?.nickname || userLog?.nickname}</p>
                                    </div>
                                </li>
                            </>
                            :
                            ""
                    }
                    {
                        !user ?
                            <>
                                <li className="nav-item">
                                    {/* 🔥 Traducción para Iniciar Sesión */}
                                    <NavLink to={"/login"} className="nav-link-desktop nav-btn-auth">{t("navbar.iniciar_sesion", "Iniciar Sesión")}</NavLink>
                                </li>
                                <li className="nav-item">
                                    {/* 🔥 Traducción para Registrarse */}
                                    <NavLink to={"/register"} className="nav-link-desktop nav-btn-auth">{t("navbar.registrarse", "Registrarse")}</NavLink>
                                </li>
                            </>
                            : ""
                    }
                </ul>
            </nav>
        </>
    );
};

export default NavbarDesktop;