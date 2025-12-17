import { Link } from "react-router-dom";
import fc from "../assets/iconos/facebook.png";
import yt from "../assets/iconos/youtube.png";
import wts from "../assets/iconos/wts.png";
import ig from "../assets/iconos/instagram.png";

const Footer = () => {

    return (
        <>
            <footer className="footer">
                <div className="informatioFooterContainer">
                    <ul className="footerListInformation">
                        <li className="footerItemInformation">email</li>
                        <li className="footerItemInformation">telefono</li>
                    </ul>
                </div>
                <div className="titleFooterContainer">
                    <h3 className="titleFooter">SANACIONES COSMOSTELURICAS</h3>
                    <ul className="footerListMedia">
                        <li className="footerItemMedia"><Link to={""}><img className="iconItemMedia" src={ig} alt="Instagram" /></Link></li>
                        <li className="footerItemMedia"><Link to={""}><img className="iconItemMedia" src={fc} alt="Facebook" /></Link></li>
                        <li className="footerItemMedia"><Link to={""}><img className="iconItemMedia" src={wts} alt="Whatsapp" /></Link></li>
                        <li className="footerItemMedia"><Link to={""}><img className="iconItemMedia" src={yt} alt="Youtube" /></Link></li>
                    </ul>
                </div>
                <div className="linksViewsFooter">
                    <ul className="footerListViews">
                        <li className="footerItemView"><Link to={"/"} className="footerLinkView">Inicio</Link></li>
                        <li className="footerItemView"><Link to={"/cursos-gratuitos"} className="footerLinkView">Cursos Gratuitos</Link></li>
                        <li className="footerItemView"><Link to={"/cursos-pagos"} className="footerLinkView">Cursos Pagos</Link></li>
                        <li className="footerItemView"><Link to={"/contacto"} className="footerLinkView">Contacto</Link></li>
                    </ul>
                </div>
            </footer>
        </>
    )
}

export default Footer;  