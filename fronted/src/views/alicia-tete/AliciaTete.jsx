import { useEffect, useState } from "react";
import { useLoading } from "../../context/LoadingContext";
import ContactoFlotante from "../../components/ContactoFlotante";
// 🔥 Importamos el traductor
import { useTranslation } from 'react-i18next';

const AliciaTete = () => {
    const { hideLoader } = useLoading();
    const [videoLoading, setVideoLoading] = useState(true);
    // 🔥 Iniciamos el traductor
    const { t } = useTranslation("global");

    useEffect(() => {
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
                    <span className="biografia-subtitle">{t("biografia.subtitle")}</span>
                    <h1 className="biografia-title">Alicia Tete</h1>
                    <p className="biografia-intro">
                        {t("biografia.intro")}
                    </p>
                </div>

                {/* Contenedor del Video */}
                <div className="biografia-video-frame">
                    <div className="biografia-video-wrapper">

                        {videoLoading && (
                            <div className="biografia-loader-overlay">
                                <div className="biografia-spinner"></div>
                            </div>
                        )}

                        <iframe
                            className="biografia-iframe"
                            src="https://player.mediadelivery.net/embed/588203/aab8598d-deb3-48c8-93f9-809a8ee07a4e?autoplay=false"
                            title={t("biografia.video_title")}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={handleVideoLoad}
                        ></iframe>
                    </div>
                    <div className="biografia-glow"></div>
                </div>

                {/* Pie de video */}
                <div className="biografia-footer">
                    <p>“{t("biografia.quote")}”</p>
                </div>

            </div>
            <ContactoFlotante />
        </section>
    );
}

export default AliciaTete;