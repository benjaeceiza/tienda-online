
import { Link } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaEnvelope, FaHeart } from "react-icons/fa";


const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-main-wrapper">
            {/* Efecto de cristal oscuro sobre el footer */}
            <div className="footer-glass-layer">
                <div className="footer-container">

                    <div className="footer-grid">
                        {/* COLUMNA 1: Marca y Descripción */}
                        <div className="footer-column footer-brand-col">
                            <h2 className="footer-logo-text">Sanación Cosmotelúrica</h2>
                            <p className="footer-description">
                                Acompañándote en tu proceso de evolución y bienestar.
                                Descubrí herramientas para equilibrar tu energía y transformar tu vida.
                            </p>
                        </div>

                        {/* COLUMNA 2: Accesos Rápidos */}
                        <div className="footer-column">
                            <h3 className="footer-title">Explorar</h3>
                            <ul className="footer-links-list">
                                <li><Link to="/" className="footer-link">Inicio</Link></li>
                                <li><Link to="/cursos/rituales" className="footer-link">Rituales</Link></li>
                                <li><Link to="/cursos/artesanias magicas" className="footer-link">Artesanías Mágicas</Link></li>
                                <li><Link to="/cursos/sistema de sanacion en camilla" className="footer-link">Sist.Sanación en camilla</Link></li>
                                <li><Link to="/cursos/anexos" className="footer-link">Anexos</Link></li>
                                <li><Link to="/cursos/eric barone" className="footer-link">Eric Barone</Link></li>
                                <li><Link to="/alicia-tete" className="footer-link">Alicia Teté</Link></li>
                                <li><Link to="/contacto" className="footer-link">Contacto</Link></li>
                            </ul>
                        </div>

                        {/* COLUMNA 3: Soporte y Legales */}
                        <div className="footer-column">
                            <h3 className="footer-title">Ayuda</h3>
                            <ul className="footer-links-list">
                                <li><Link to="#" className="footer-link">Preguntas Frecuentes</Link></li>
                                <li><Link to="#" className="footer-link">Términos y Condiciones</Link></li>
                                <li><Link to="#" className="footer-link">Política de Privacidad</Link></li>
                            </ul>
                        </div>

                        {/* COLUMNA 4: Contacto y Redes */}
                        <div className="footer-column footer-contact-col">
                            <h3 className="footer-title">Conectemos</h3>
                            <div className="footer-contact-item">
                                <FaEnvelope className="footer-icon" />
                                <span>contacto@tuweb.com</span>
                            </div>
                            <div className="footer-contact-item">
                                <FaWhatsapp className="footer-icon" />
                                <span>+54 9 2657 54-7597</span>
                            </div>

                            <div className="footer-social-wrapper">
                                <a href="https://www.instagram.com/sanacioncosmotelurica/" target="_blank" rel="noreferrer" className="footer-social-btn">
                                    <FaInstagram />
                                </a>
                                <a href="https://wa.me/+5492657547597" target="_blank" rel="noreferrer" className="footer-social-btn">
                                    <FaWhatsapp />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* LÍNEA DIVISORIA Y COPYRIGHT */}
                    <div className="footer-bottom-bar">
                        <p className="footer-copyright">
                            &copy; {currentYear} Sanación Cosmotelúrica. Todos los derechos reservados.
                        </p>
                        <p className="footer-made-with">
                            Desarrollado con <FaHeart className="footer-heart-icon" /> para tu bienestar.
                        </p>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;