import { useEffect, useState, useRef } from 'react'; // 1. Importar useRef
import { NavLink, useLocation } from 'react-router-dom'; // 2. Importar useLocation
import { getUser } from "../../services/getUser";
import { useAuth } from '../../context/AuthContext';
import userIcon from "../../assets/iconos/avatar.png";
import ModalUser from '../modal-user/ModalUser';
import logo from "../../assets/logos/logo-tete.png";

const NavbarDesktop = () => {
    const { user } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userLog, setUserLog] = useState({});
    const [showModal, setShowModal] = useState(false);
    const { logout } = useAuth();

    // Referencia para el elemento del menú desplegable
    const dropdownRef = useRef(null);
    
    // Hook para saber en qué ruta estamos
    const location = useLocation();

    const cursosOptions = [
        { label: "Rituales", path: "/cursos/rituales" },
        { label: "Artesanías mágicas", path: "/cursos/artesanias magicas" },
        { label: "Eric Barone", path: "/cursos/eric barone" },
        { label: "Sistema de sanación en camilla", path: "/cursos/sistema de sanacion en camilla" },
        { label: "Anexos", path: "/cursos/anexos" },
    ];

    useEffect(() => {
        if (user) {
            const token = localStorage.getItem("token");
            getUser(token)
                .then((data) => setUserLog(data.user || {}))
                .catch((err) => console.error(err));
        }
    }, [user]);

    // LÓGICA PARA CERRAR EL MENÚ ---

    // 1. Cerrar cuando cambia la ruta (al hacer click en un link)
    useEffect(() => {
        setDropdownOpen(false);
    }, [location]);

    // 2. Cerrar cuando se hace click afuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Si el menú está abierto y el click NO fue dentro del elemento referenciado
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        // Agregamos el event listener al documento
        document.addEventListener("mousedown", handleClickOutside);
        
        // Limpiamos el listener cuando el componente se desmonta
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const onHandleDropDown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    return (
        <>
            <ModalUser
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                user={user}
                onLogout={logout}
            />
            <nav className="navbar-desktop">
                {/* Lado Izquierdo: Logo */}
                <div className="navbar-logo-desktop">
                    <NavLink to={"/"}><img className='logo-navbar' src={logo} alt='logo' /></NavLink>
                </div>

                {/* Lado Derecho: Menú */}
                <ul className="navbar-links-desktop">

                    {/* Dropdown de Cursos */}
                    {/* AGREGAMOS LA REF AQUÍ (ref={dropdownRef}) */}
                    <li
                        ref={dropdownRef} 
                        className="nav-item-desktop dropdown-desktop"
                        onClick={() => onHandleDropDown()}
                    >
                        <span className="nav-link-desktop cursor-pointer">
                            Cursos ▾
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
                        <NavLink to={"/contacto"} className="nav-link-desktop">Contacto</NavLink>
                    </li>

                    {
                        user ?
                            <>
                                <li className='nav-item'>
                                    <NavLink to={"/mis-cursos"} className="nav-link-desktop">Mis Cursos</NavLink>
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
                                    <NavLink to={"/login"} className="nav-link-desktop nav-btn-auth">Iniciar Sesión</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to={"/register"} className="nav-link-desktop nav-btn-auth">Registrarse</NavLink>
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