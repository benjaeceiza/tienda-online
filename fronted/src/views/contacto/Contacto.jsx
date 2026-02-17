import { useLoading } from "../../context/LoadingContext";
import ig from "../../assets/iconos/instagram.png";
import fb from "../../assets/iconos/facebook.png";
import waContact from "../../assets/iconos/wtsContact.png";
import yt from "../../assets/iconos/youtube.png";



const Contacto = () => {
  const { hideLoader } = useLoading();

  // URL de tu imagen de fondo (Cámbiala por la tuya si tienes una específica)
  // Esta es una imagen abstracta luminosa/etérea que combina con el estilo
  const backgroundImage = "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840323/fondo-contacto_gcwfzw_lzppb7.webp";

  return (
    <main className="page-contact_main">

      {/* --- IMAGEN DE FONDO REAL (Controla el Loader) --- */}
      <img
        src={backgroundImage}
        alt="Fondo Contacto"
        className="page-contact_bg_real"
        onLoad={hideLoader} // <--- AQUÍ ESTÁ LA MAGIA
      />

      {/* Glow decorativo (Opcional, se suma a la imagen) */}
      <div className="page-contact_background_glow"></div>

      <div className="page-contact_container">

        {/* --- COLUMNA IZQUIERDA: INFO --- */}
        <div className="page-contact_info_col">
          <div className="page-contact_header">
            <span className="page-contact_subtitle">Hablemos</span>
            <h2 className="page-contact_title">Comunicáte con<br />Nosotros</h2>
            <div className="page-contact_divider"></div>
          </div>

          <p className="page-contact_text">
            ¿Tienes dudas sobre los cursos o sientes el llamado a iniciar un proceso personal?
            Estoy aquí para escucharte y acompañarte en tu camino.
          </p>

          <div className="page-contact_socials">
            <h3>Encuéntrame en:</h3>
            <div className="page-contact_icons_grid">
              <a href="#" className="page-contact_social_link" aria-label="Instagram">
                <img src={ig} alt="Instagram" />
              </a>
              <a href="#" className="page-contact_social_link" aria-label="Facebook">
                <img src={fb} alt="Facebook" />
              </a>
              <a href="#" className="page-contact_social_link" aria-label="YouTube">
                <img src={yt} alt="YouTube" />
              </a>
            </div>
          </div>

          <a
            href="https://wa.me/5492657547597?text=Hola!%20Me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20cursos."
            className="page-contact_wts_btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={waContact} alt="WhatsApp" />
            <span>Whatsapp</span>
          </a>
        </div>

        {/* --- COLUMNA DERECHA: FORMULARIO --- */}
        <div className="page-contact_form_col">
          <form className="page-contact_form">
            <h3 className="page-contact_form_title">Envíame un mensaje</h3>

            <div className="page-contact_row">
              <div className="page-contact_input_group">
                <input type="text" required className="page-contact_input" />
                <label className="page-contact_label">Nombre</label>
              </div>
              <div className="page-contact_input_group">
                <input type="text" required className="page-contact_input" />
                <label className="page-contact_label">Apellido</label>
              </div>
            </div>

            <div className="page-contact_input_group">
              <input type="email" required className="page-contact_input" />
              <label className="page-contact_label">Email</label>
            </div>

            <div className="page-contact_input_group">
              <input type="tel" required className="page-contact_input" />
              <label className="page-contact_label">Teléfono (Opcional)</label>
            </div>

            <div className="page-contact_input_group">
              <textarea required className="page-contact_input page-contact_textarea"></textarea>
              <label className="page-contact_label">¿En qué puedo ayudarte?</label>
            </div>

            <button type="submit" className="page-contact_submit_btn">
              Enviar Consulta
            </button>
          </form>
        </div>

      </div>
    </main>
  );
};

export default Contacto;