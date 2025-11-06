import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logos/logo.png";

const Navbar = () => {
    const { user, logout, login } = useAuth();


    return (
        <>  {
            user
                ?
                <nav className="Navbar">
                    <NavLink to={"/"} className="NavbarLink"><img className="NavbarLogo" src={logo} alt="Logo" /></NavLink>
                    <ul className="NavbarList">
                        <li className="NavbarItem"><NavLink to={"/"} className="NavbarLink">Inicio</NavLink></li>
                        <li className="NavbarItem"><NavLink to={"/cursos-gratuitos"} className="NavbarLink">Cursos gratuitos</NavLink></li>
                        <li className="NavbarItem"><NavLink to={"/cursos-pagos"} className="NavbarLink">Cursos Pagos</NavLink></li>
                        <li className="NavbarItem"><NavLink to={"/mis-cursos"} className="NavbarLink">Mis cursos</NavLink></li>
                    </ul>
                    <p className="NavUser">User</p>
                </nav>
                :
                <nav className="Navbar">
                    <NavLink className="NavbarLink"><img className="NavbarLogo" src={logo} alt="Logo" /></NavLink>
                    <ul className="NavbarList">
                        <li className="NavbarItem"><NavLink to={"/"} className="NavbarLink">Inicio</NavLink></li>
                        <li className="NavbarItem"><NavLink to={"/cursos-gratuitos"} className="NavbarLink">Cursos gratuitos</NavLink></li>
                        <li className="NavbarItem"><NavLink to={"/cursos-pagos"} className="NavbarLink">Cursos Pagos</NavLink></li>
                        <li className="NavbarItem"><NavLink to={"/login"} className="NavbarLink">Iniciar Sesion</NavLink></li>
                        <li className="NavbarItem"><NavLink to={"/register"} className="NavbarLink">Registrarse</NavLink></li>
                    </ul>
                </nav>
        }
        </>
    )
}
export default Navbar;