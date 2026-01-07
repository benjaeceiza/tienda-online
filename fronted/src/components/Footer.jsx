import { Link } from "react-router-dom";
import fc from "../assets/iconos/facebook.png";
import yt from "../assets/iconos/youtube.png";
import wts from "../assets/iconos/wts.png";
import ig from "../assets/iconos/instagram.png";
import email from "../assets/iconos/telefono.png";
import telefono from "../assets/iconos/correo-electronico.png";

const Footer = () => {

    return (
        <>
            <footer className="footer">
                <div className="upperFooter"> 
                    <div className="informatioFooterContainer">
                        <ul className="footerListInformation">
                            <li className="footerItemInformation"><img src={email} alt="Email" /><p>sanaciones@gmail.com</p></li>
                            <li className="footerItemInformation"><img src={telefono} alt="Telefono" /><p>300 123 4567</p></li>
                        </ul>
                    </div>
                    <div className="titleFooterContainer">
                        <h3 className="titleFooter">SANACIONES COSMOSTELURICAS</h3>

                    </div>
                    <div className="linksViewsFooter">
                        <ul className="footerListViews">
                            <li className="footerItemView"><Link to={"/"} className="footerLinkView">Inicio</Link></li>
                            <li className="footerItemView"><Link to={"/cursos-gratuitos"} className="footerLinkView">Cursos Gratuitos</Link></li>
                            <li className="footerItemView"><Link to={"/cursos-pagos"} className="footerLinkView">Cursos Pagos</Link></li>
                            <li className="footerItemView"><Link to={"/contacto"} className="footerLinkView">Contacto</Link></li>
                        </ul>
                    </div>

                </div>
                <div className="underFooter">
                    <p className="textUnderFooter">Powered by BE</p>
                    <p className="textUnderFooter">© 2024 Sanaciones Cosmosteluricas. Todos los derechos reservados.</p>
                    <ul className="footerListMedia">
                        <li className="footerItemMedia"><Link to={""}className="footerItemMediaLink" ><img className="iconItemMedia" src={ig} alt="Instagram" /></Link></li>
                        <li className="footerItemMedia"><Link to={""}className="footerItemMediaLink" ><img className="iconItemMedia" src={fc} alt="Facebook" /></Link></li>
                        <li className="footerItemMedia"><Link to={""}className="footerItemMediaLink" ><img className="iconItemMedia" src={wts} alt="Whatsapp" /></Link></li>
                        <li className="footerItemMedia"><Link to={""}className="footerItemMediaLink" ><img className="iconItemMedia" src={yt} alt="Youtube" /></Link></li>
                    </ul>
                </div>
            </footer>
        </>
    )
}

export default Footer;  