import { useLoading } from "../../context/LoadingContext";
import ig from "../../assets/iconos/instagram.png";
import fb from "../../assets/iconos/facebook.png";
import waContact from "../../assets/iconos/wtsContact.png";
import yt from "../../assets/iconos/youtube.png";
// 🔥 Importamos el traductor
import { useTranslation } from 'react-i18next';

const Contacto = () => {
  const { hideLoader } = useLoading();
  // 🔥 Iniciamos el traductor
  const { t } = useTranslation("global");

  const backgroundImage = "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840323/fondo-contacto_gcwfzw_lzppb7.webp";

  return (
    <main className="page-contact_main">
      <img
        src={backgroundImage}
        alt="Fondo Contacto"
        className="page-contact_bg_real"
        onLoad={hideLoader}
      />

      <div className="page-contact_background_glow"></div>

      <div className="page-contact_container">

        {/* --- COLUMNA IZQUIERDA: INFO --- */}
        <div className="page-contact_info_col">
          <div className="page-contact_header">
            <span className="page-contact_subtitle">{t("contacto.subtitle")}</span>
            <h2 className="page-contact_title">{t("contacto.title_1")}<br />{t("contacto.title_2")}</h2>
            <div className="page-contact_divider"></div>
          </div>

          <p className="page-contact_text">
            {t("contacto.description")}
          </p>

          <div className="page-contact_socials">
            <h3>{t("contacto.social_title")}</h3>
            <div className="page-contact_icons_grid">
              <a href="https://www.instagram.com/sanacioncosmotelurica/" target="_blank" className="page-contact_social_link" aria-label="Instagram">
                <img src={ig} alt="Instagram" />
              </a>
              <a href="#" className="page-contact_social_link" aria-label="Facebook">
                <img src={fb} alt="Facebook" />
              </a>
              <a href="https://www.youtube.com/@aliciatete" target="_blank" className="page-contact_social_link" aria-label="YouTube">
                <img src={yt} alt="YouTube" />
              </a>
            </div>
          </div>

          <a
            href="https://wa.me/5492657547597?text=Hola!"
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
          <form className="page-contact_form" onSubmit={(e) => e.preventDefault()}>
            <h3 className="page-contact_form_title">{t("contacto.form_title")}</h3>

            <div className="page-contact_row">
              <div className="page-contact_input_group">
                <input type="text" required className="page-contact_input" />
                <label className="page-contact_label">{t("contacto.label_nombre")}</label>
              </div>
              <div className="page-contact_input_group">
                <input type="text" required className="page-contact_input" />
                <label className="page-contact_label">{t("contacto.label_apellido")}</label>
              </div>
            </div>

            <div className="page-contact_input_group">
              <input type="email" required className="page-contact_input" />
              <label className="page-contact_label">Email</label>
            </div>

            <div className="page-contact_input_group">
              <input type="tel" required className="page-contact_input" />
              <label className="page-contact_label">{t("contacto.label_telefono")}</label>
            </div>

            <div className="page-contact_input_group">
              <textarea required className="page-contact_input page-contact_textarea"></textarea>
              <label className="page-contact_label">{t("contacto.label_mensaje")}</label>
            </div>

            <button type="submit" className="page-contact_submit_btn">
              {t("contacto.btn_enviar")}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
};

export default Contacto;