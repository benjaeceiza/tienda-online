


import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getUser } from "../../services/getUser";
import { useAuth } from '../../context/AuthContext';
import userIcon from "../../assets/iconos/avatar.png";
import salir from "../../assets/logos/logout.png";
import ModalConfirm from "../ModalConfirm";

const NavbarDesktop = () => {
    const { user } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userLog, setUserLog] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const cursosOptions = [
        { label: "Rituales", path: "/cursos/rituales" },
        { label: "Artesanías mágicas", path: "/cursos/artesanias magicas" },
        { label: "Eric Barone", path: "/cursos/eric barone" },
        { label: "Sistema de sanación en camilla", path: "/cursos/sistema de sanacion en camilla" },
        { label: "Anexos", path: "/cursos/anexo" },
    ];

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
            <nav className="navbar-desktop">
                {/* Lado Izquierdo: Logo */}
                <div className="navbar-logo-desktop">
                    <NavLink to={"/"}><h2 className="logoText">SC</h2></NavLink>
                </div>

                {/* Lado Derecho: Menú */}
                <ul className="navbar-links-desktop">

                    {/* Dropdown de Cursos */}
                    <li
                        className="nav-item-desktop dropdown-desktop"
                        onMouseEnter={() => setDropdownOpen(true)}

                    >
                        <span className="nav-link-desktop cursor-pointer">
                            Cursos ▾
                        </span>

                        {dropdownOpen && (
                            <ul className="dropdown-menu-desktop" onMouseLeave={() => setDropdownOpen(false)}>
                                {cursosOptions.map((option, index) => (
                                    <li key={index} className="dropdown-item-desktop">
                                        <NavLink className='nav-link-desktop' to={option.path}>{option.label}</NavLink>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>

                    <li className="nav-item">
                        <NavLink to={"/contacto"} className="nav-link-desktop">Alicia tete</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to={"/contacto"} className="nav-link-desktop">Contacto</NavLink>
                    </li>

                    {
                        user ?
                            <>
                                <li className='nav-item'>
                                    <NavLink to={"/mis-cursos"} className="nav-link-desktop">Mis Cursos</NavLink>
                                </li>
                                <li className='nav-item-close'>
                                    <div className="userNameContainer">
                                        <img src={userIcon} className="navbarIcon" alt="User" />
                                        <p className="userName">{user?.nickname || userLog?.nickname}</p>
                                    </div>
                                    <img src={salir} alt="Cerrar sesion" onClick={() => { setShowModal(true); setIsVisible(false); }} className=" iconClose" />
                                </li>
                            </>
                            :
                            ""
                    }
                    {
                        !user ?
                            <>
                                <li className="nav-item">
                                    <NavLink to={"/login"} className="nav-link-desktop">Iniciar Sesión</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to={"/register"} className="nav-link-desktop btn-register">Registrarse</NavLink>
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