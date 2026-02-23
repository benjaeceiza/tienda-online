import { Link } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaEnvelope, FaHeart } from "react-icons/fa";
// 🔥 Importamos el traductor
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation("global");
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-main-wrapper">
            <div className="footer-glass-layer">
                <div className="footer-container">

                    <div className="footer-grid">
                        {/* COLUMNA 1: Marca y Descripción */}
                        <div className="footer-column footer-brand-col">
                            <h2 className="footer-logo-text">Sanación Cosmotelúrica</h2>
                            <p className="footer-description">
                                {t("footer.descripcion")}
                            </p>
                        </div>

                        {/* COLUMNA 2: Accesos Rápidos (Reutilizamos las keys de Navbar) */}
                        <div className="footer-column">
                            <h3 className="footer-title">{t("footer.explorar")}</h3>
                            <ul className="footer-links-list">
                                <li><Link to="/" className="footer-link">{t("navbar.inicio")}</Link></li>
                                <li><Link to="/cursos/rituales" className="footer-link">{t("navbar.cursos_rituales")}</Link></li>
                                <li><Link to="/cursos/artesanias magicas" className="footer-link">{t("navbar.cursos_artesanias")}</Link></li>
                                <li><Link to="/cursos/sistema de sanacion en camilla" className="footer-link">{t("navbar.cursos_sanacion")}</Link></li>
                                <li><Link to="/cursos/anexos" className="footer-link">{t("navbar.cursos_anexos")}</Link></li>
                                <li><Link to="/cursos/eric barone" className="footer-link">{t("navbar.cursos_eric")}</Link></li>
                                <li><Link to="/alicia-tete" className="footer-link">{t("navbar.alicia_tete")}</Link></li>
                                <li><Link to="/contacto" className="footer-link">{t("navbar.contacto")}</Link></li>
                            </ul>
                        </div>

                        {/* COLUMNA 3: Soporte y Legales */}
                        <div className="footer-column">
                            <h3 className="footer-title">{t("footer.ayuda")}</h3>
                            <ul className="footer-links-list">
                                <li><Link to="#" className="footer-link">{t("footer.faq")}</Link></li>
                                <li><Link to="#" className="footer-link">{t("footer.terminos")}</Link></li>
                                <li><Link to="#" className="footer-link">{t("footer.privacidad")}</Link></li>
                            </ul>
                        </div>

                        {/* COLUMNA 4: Contacto y Redes */}
                        <div className="footer-column footer-contact-col">
                            <h3 className="footer-title">{t("footer.conectemos")}</h3>
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
                            &copy; {currentYear} Sanación Cosmotelúrica. {t("footer.derechos")}
                        </p>
                        <p className="footer-made-with">
                            {t("footer.desarrollado")} <FaHeart className="footer-heart-icon" /> {t("footer.bienestar")}
                        </p>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;