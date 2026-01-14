
import { Link } from "react-router-dom"; // Asumo que usas react-router

// Importación de imágenes
import fc from "../assets/iconos/facebook.png";
import yt from "../assets/iconos/youtube.png";
import ig from "../assets/iconos/instagram.png";
// Ojo: en tus imports tenías cruzados telefono y email, revisa los nombres de tus archivos
// import email from "../assets/iconos/telefono.png"; 
// import telefono from "../assets/iconos/correo-electronico.png";

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-wrapper">

                {/* Columna Izquierda: Contacto */}
                {/* En móvil, queremos que esto vaya SEGUNDO */}
                <div className="footer-column contact-col">
                    <h3 className="footer-heading">Hablemos</h3>
                    <div className="contact-item">
                        <span className="icon">✉️</span>
                        <a href="mailto:sanaciones@gmail.com">sanaciones@gmail.com</a>
                    </div>
                    <div className="contact-item">
                        <span className="icon">📱</span>
                        <span>300 123 4567</span>
                    </div>
                </div>

                {/* Columna Central: La Marca */}
                {/* En móvil, queremos que esto vaya PRIMERO */}
                <div className="footer-column brand-col">
                    <h2 className="brand-title">SANACION<br />COSMOTELURICA</h2>
                    <span className="brand-line"></span>
                </div>

                {/* Columna Derecha: Navegación */}
                {/* En móvil, queremos que esto vaya TERCERO */}
                <div className="footer-column links-col">
                    <h3 className="footer-heading">Navegación</h3>
                    <ul className="footer-links">
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/cursos/sistema de sanacion cosmotelurica">Sistema de sanación cosmotelurica</Link></li>
                        <li><Link to="/cursos/rituales">Rituales</Link></li>
                        <li><Link to="/cursos/artesanias magicas">Artesanías mágicas</Link></li>
                        <li><Link to="/cursos/eric barone">Eric Barone</Link></li>
                    </ul>
                </div>
            </div>

            {/* Barra Inferior */}
            <div className="footer-bottom">
                <span className="powered-by">Powered by BE</span>
                <p>© 2026 Sanación Cosmotelúrica. Todos los derechos reservados.</p>
                <div className="social-links">
                    <a href="#" className="social-icon"><img src={ig} alt="Instagram" className="social-img" /></a>
                    <a href="#" className="social-icon"><img src={yt} alt="Youtube" className="social-img" /></a>
                    <a href="#" className="social-icon"><img src={fc} alt="Facebook" className="social-img" /></a>
                    {/* Si quieres WhatsApp aquí también */}
                    {/* <a href="#" className="social-icon"><img src={wts} alt="WhatsApp" className="social-img"/></a> */}
                </div>
            </div>
        </footer>
    );
};

export default Footer;