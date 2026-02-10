import { useLoading } from "../../context/LoadingContext";
import ig from "../../assets/iconos/instagram.png";
import fb from "../../assets/iconos/facebook.png";
import waContact from "../../assets/iconos/wtsContact.png";
import yt from "../../assets/iconos/youtube.png";
import { useEffect } from "react";


const Contacto = () => {
  const { hideLoader } = useLoading();

  useEffect(() => {
    setTimeout(() => {
      hideLoader();
    }, 1000);
  }, [hideLoader]);

  return (
    <main className="mainContact">
      {/* Contenedor Principal (La Tarjeta) */}
      <div className="contactCard">
        
        {/* --- COLUMNA IZQUIERDA: INFORMACIÓN Y REDES --- */}
        <div className="contactInfoSide">
          <div className="infoContent">
            <h2 className="infoTitle">Conectemos</h2>
            <p className="infoText">
              ¿Tienes alguna duda sobre los cursos o sesiones? Estoy aquí para acompañarte en tu proceso.
            </p>
            
            <div className="socialSection">
              <h3>Seguime en redes</h3>
              <div className="socialIcons">
                <a href="#" className="socialItem"><img src={ig} alt="Instagram" /></a>
                <a href="#" className="socialItem"><img src={fb} alt="Facebook" /></a>
                <a href="#" className="socialItem"><img src={yt} alt="YouTube" /></a>
              </div>
            </div>

            <div className="wtsContainer">
              <button className="wtsButton">
                <img src={waContact} alt="WhatsApp" /> Escribime al WhatsApp
              </button>
            </div>
          </div>
          
          {/* Decoración de fondo (Círculos) */}
          <div className="circleDecoration circle1"></div>
          <div className="circleDecoration circle2"></div>
        </div>

        {/* --- COLUMNA DERECHA: FORMULARIO --- */}
        <div className="contactFormSide">
          <h2 className="formTitle">Envianos un mensaje</h2>
          
          <form className="modernForm">
            <div className="inputGroup">
              <div className="inputBox">
                <input type="text" required />
                <span>Nombre</span>
              </div>
              <div className="inputBox">
                <input type="text" required />
                <span>Apellido</span>
              </div>
            </div>

            <div className="inputGroup">
              <div className="inputBox">
                <input type="email" required />
                <span>Email</span>
              </div>
              <div className="inputBox">
                <input type="tel" required />
                <span>Teléfono</span>
              </div>
            </div>

            <div className="inputBox textareaBox">
              <textarea required></textarea>
              <span>Tu mensaje...</span>
            </div>

            <button type="submit" className="sendButton">
              Enviar Mensaje
            </button>
          </form>
        </div>

      </div>
    </main>
  );
};

export default Contacto;