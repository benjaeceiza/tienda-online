import { useLoading } from "../../context/LoadingContext";

const Contacto = () => {

  const { hideLoader } = useLoading();
  hideLoader();

  return (
    <>
      <main>
        <div className="contactContainer">
          <div className="sectionContainer">
            <section className="socialMediaSection">
              <div className="listContainer">
                <h2>Contacto</h2>
                <ul className="contactList">
                  <li>Correo elecetronico</li>
                  <li>Numero de telefono</li>
                </ul>
              </div>
              <div className="listContainer">
                <h2>Nuestras Redes</h2>
                <ul className="socialMediaList">
                  <li>icono 1</li>
                  <li>icono 2</li>
                  <li>icono 3</li>
                  <li>icono 4</li>
                </ul>
              </div>
            </section>
            <section className="formContactSection">
              <div className="titleFormContainer glass">
                <h2 className="titleForm">Formulario de contacto</h2>
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