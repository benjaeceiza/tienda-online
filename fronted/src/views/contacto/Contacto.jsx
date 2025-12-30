import { useLoading } from "../../context/LoadingContext";
import ig from "../../assets/iconos/instagram.png";
import fb from "../../assets/iconos/facebook.png";
import waContact from "../../assets/iconos/wtsContact.png";
import yt from "../../assets/iconos/youtube.png";
import { useEffect } from "react";
const Contacto = () => {

  const { hideLoader } = useLoading();

  useEffect(() => {
    hideLoader();
  }, []);

  return (
    <>
      <main className="mainContact">
        <div className="contactContainer">
          <div className="sectionContainer">
            <section className="socialMediaSection">
              <div className="listContainer">
                <h2>Nuestras Redes</h2>
                <ul className="socialMediaList">
                  <li><img className="iconSocialList" src={ig} alt="Instagram" /></li>
                  <li><img className="iconSocialList" src={fb} alt="Facebook" /></li>
                  <li><img className="iconSocialList" src={yt} alt="YouTube" /></li>
                </ul>
              </div>
              <div className="buttonWtsContainer">
                <button className="wtsButton">
                  <img src={waContact} alt="WhatsApp" /> WhatsApp
                </button>
              </div>
            </section>
            <section className="formContactSection">
              <div className="titleFormContainer glass">
                <h2 className="titleForm">Envianos un mensaje</h2>
                <form className="formContact">
                  <div className="formRow">
                    <input className="contactFormInput" type="text" placeholder="Nombre"
                    />
                    <input className="contactFormInput" type="text" placeholder="Apellido"
                    />
                  </div>

                  <div className="formRow">
                    <input className="contactFormInput" type="email" placeholder="Email"
                    />
                    <input className="contactFormInput" type="tel" placeholder="Teléfono"
                    />
                  </div>

                  {/* Mensaje (fila completa) */}
                  <textarea
                    className="contactFormTextarea"
                    placeholder="Escribí tu mensaje..."
                  />

                  {/* Botón independiente */}
                  <button type="submit" className="contactFormButton">
                    Enviar mensaje
                  </button>
                </form>
              </div>

            </section>
          </div>
        </div>
      </main>
    </>
  )

}

export default Contacto;