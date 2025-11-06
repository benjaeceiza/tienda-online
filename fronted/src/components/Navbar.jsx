import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <>
            <nav className="Navbar">
                <NavLink className="NavbarLink"><img src={""} alt="" /></NavLink>
                <ul className="NavbarList">
                    <li className="NavbarItem"><NavLink className="NavbarLink">Inicio</NavLink></li>
                    <li className="NavbarItem"><NavLink className="NavbarLink">Cursos gratuitos</NavLink></li>
                    <li className="NavbarItem"><NavLink className="NavbarLink">Cursos Pagos</NavLink></li>
                    <li className="NavbarItem"><NavLink className="NavbarLink">Información</NavLink></li>
                </ul>
                <p className="NavUser">User</p>
            </nav>
        </>
    )
}
export default Navbar;