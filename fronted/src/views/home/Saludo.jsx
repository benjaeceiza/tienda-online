import { useState } from 'react';
// 🔥 Importamos el hook de traducción
import { useTranslation } from 'react-i18next';

const Saludo = () => {
    // 🔥 Iniciamos el traductor
    const { t } = useTranslation("global");
    
    // Estado para la carga del video
    const [loadingV1, setLoadingV1] = useState(true);

    return (
        <section className="saludo-section">
            <div className="saludo-container">
                <div className="saludo-grid">

                    {/* === COLUMNA DE TEXTO === */}
                    <div className="saludo-text-column">
                        {/* 🔥 Reemplazamos por variables de traducción */}
                        <span className="saludo-subtitle">{t("saludo.subtitle")}</span>
                        <h2 className="saludo-title">{t("saludo.title")}</h2>
                        <div className="saludo-divider"></div>
                        <p className="saludo-description">
                            {t("saludo.description")}
                        </p>
                    </div>

                    {/* === COLUMNA DE VIDEO === */}
                    <div className="saludo-video-column">
                        <div className="single-video-card">
                            <div className="saludo-video-wrapper">
                                
                                {loadingV1 && (
                                    <div className="saludo-video-loader">
                                        <div className="spinner"></div>
                                    </div>
                                )}

                                <iframe
                                    className="saludo-iframe"
                                    src="https://player.mediadelivery.net/embed/588203/c88f3541-fa1d-4def-8e14-29a6ded89b3b?autoplay=false"
                                    title="Video Bienvenida"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    onLoad={() => setLoadingV1(false)}
                                ></iframe>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Saludo;