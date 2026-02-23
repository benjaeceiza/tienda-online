import { useState } from "react";
import { FaHeart, FaPlay } from "react-icons/fa";
// 🔥 Importamos el hook de traducción
import { useTranslation } from 'react-i18next';

const Agradecimiento = () => {
    // 🔥 Iniciamos el traductor
    const { t } = useTranslation("global");
    
    const [showVideo, setShowVideo] = useState(false);

    const bunnyVideoUrl = "https://player.mediadelivery.net/embed/588203/c9a80d08-b521-4280-ba6a-22c72c256e86?autoplay=true";

    return (
        <section className="agradecimiento-section fade-in">
            <div className="agradecimiento-container">
                
                <div className="agradecimiento-glass-card">
                    
                    <div className="agradecimiento-video-wrapper">
                        
                        {showVideo ? (
                            <iframe 
                                src={bunnyVideoUrl}
                                loading="lazy" 
                                style={{ border: 'none', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }} 
                                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" 
                                allowFullScreen="true"
                                title={t("agradecimiento.video_title")}
                            ></iframe>
                        ) : (
                            <div 
                                className="agradecimiento-thumbnail-container" 
                                onClick={() => setShowVideo(true)}
                            >
                                <img 
                                    src={"https://res.cloudinary.com/dmnksm3th/image/upload/v1770840321/fondo-miniatura_1_to39yg.webp"} 
                                    alt="Alicia Teté" 
                                    className="agradecimiento-thumbnail-img"
                                />
                                <div className="agradecimiento-thumbnail-overlay">
                                    <button className="agradecimiento-play-btn" aria-label={t("agradecimiento.play_label")}>
                                        <FaPlay className="agradecimiento-play-icon" />
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    <div className="agradecimiento-content">
                        <div className="agradecimiento-badge">
                            <FaHeart className="agradecimiento-icon" />
                            {/* 🔥 Traducciones */}
                            <span>{t("agradecimiento.badge")}</span>
                        </div>
                        
                        <h2 className="agradecimiento-title">
                            {t("agradecimiento.title")}
                        </h2>
                        
                        <p className="agradecimiento-text">
                            "{t("agradecimiento.text_1")}"
                        </p>
                        
                        <p className="agradecimiento-text">
                            "{t("agradecimiento.text_2")}"
                        </p>
                        
                        <p className="agradecimiento-text">
                            "{t("agradecimiento.text_3")}"
                        </p>

                        <div className="agradecimiento-signature">
                            Alicia Teté
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Agradecimiento;