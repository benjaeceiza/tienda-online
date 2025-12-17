import { Link } from "react-router-dom";
import wts from "../assets/iconos/whatsapp.png";

const ContactoFlotante = () => {

    return (
        <>


            <div className="contactWtsFlotanteContainer">
                <Link to={""} className="linkImgFLotante" >
                    <img className="imgContactoFlotante" src={wts} alt="Icono whatsapp" />
                </Link>
            </div>

        </>
    )
}

export default ContactoFlotante;