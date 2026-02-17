import { useEffect, useState } from "react";
import { useLoading } from "../../context/LoadingContext";
import ContactoFlotante from "../../components/ContactoFlotante";

const AliciaTete = () => {
    const { hideLoader } = useLoading();
    const [videoLoading, setVideoLoading] = useState(true);

    useEffect(() => {
        // Ocultamos el loader global de la página apenas monta el componente
        hideLoader();
    }, [hideLoader]);

    const handleVideoLoad = () => {
        setVideoLoading(false);
    };

    return (
        <section className="biografia-section">
            <div className="biografia-container">

                {/* Cabecera sutil */}
                <div className="biografia-header">
                    <span className="biografia-subtitle">Conoce mi historia</span>
                    <h1 className="biografia-title">Alicia Tete</h1>
                    <p className="biografia-intro">
                        Un recorrido por el camino de la sanación, el aprendizaje y la conexión espiritual.
                    </p>
                </div>

                {/* Contenedor del Video (El protagonista) */}
                <div className="biografia-video-frame">
                    <div className="biografia-video-wrapper">

                        {/* Loader específico del video */}
                        {videoLoading && (
                            <div className="biografia-loader-overlay">
                                <div className="biografia-spinner"></div>
                            </div>
                        )}

                        <iframe
                            className="biografia-iframe"
                            src="https://player.mediadelivery.net/embed/588203/aab8598d-deb3-48c8-93f9-809a8ee07a4e?autoplay=false"
                            title="Biografía de Alicia Tete"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={handleVideoLoad}
                        ></iframe>
                    </div>
                    {/* Detalles decorativos (Brillos) */}
                    <div className="biografia-glow"></div>
                </div>

                {/* Pie de video (Opcional, una frase o firma) */}
                <div className="biografia-footer">
                    <p>“La sanación comienza cuando nos permitimos escuchar nuestra propia voz interior.”</p>
                </div>

            </div>
            <ContactoFlotante />
        </section>
    );
}

export default AliciaTete;