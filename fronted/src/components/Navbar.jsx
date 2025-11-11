import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logos/logo.png";
import salir from "../assets/logos/logout.png";
import { getUser } from "../services/getUser";
import { useEffect, useState } from "react";

const Navbar = () => {
    const { user, logout, login } = useAuth();
    const [userLog, setUserLog] = useState({})

    useEffect(() => {
        if (user) {
            const token = localStorage.getItem("token");
            getUser(token)
                .then(data => setUserLog(data.user || {}))
                .catch(err => console.error(err))
        }

    }, [user]);





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
                    <p className="NavUser">{userLog.nombre} {userLog.apellido}</p>
                    <img src={salir} alt="Cerrar sesion" onClick={() => logout()}/>
                </nav>
                :
                <nav className="Navbar">
                    <NavLink to={"/"} className="NavbarLink"><img className="NavbarLogo" src={logo} alt="Logo" /></NavLink>
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