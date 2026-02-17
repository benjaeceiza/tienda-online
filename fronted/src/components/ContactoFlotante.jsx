import wts from "../assets/iconos/whatsapp.png";

const ContactoFlotante = () => {

    
    const numeroTelefono = "5492657547597"; 

    // 2. El mensaje predeterminado (opcional)
    const mensaje = "Hola! Me gustaría recibir más información sobre los cursos.";

    // Creamos el link automático
    const linkWhatsapp = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`;

    return (
        <div className="contactWtsFlotanteContainer">
            {/* Usamos <a> para links externos */}
            <a 
                href={linkWhatsapp} 
                className="linkImgFLotante" 
                target="_blank" 
                rel="noopener noreferrer"
            >
                <img className="imgContactoFlotante" src={wts} alt="Icono whatsapp" />
            </a>
        </div>
    )
}

export default ContactoFlotante;