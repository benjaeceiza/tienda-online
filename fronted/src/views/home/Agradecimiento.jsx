import { useState } from "react"; // 🔥 Importamos useState
import { FaHeart, FaPlay } from "react-icons/fa"; // 🔥 Importamos el ícono de Play


const Agradecimiento = () => {
    // Estado para controlar si se muestra el video o la portada
    const [showVideo, setShowVideo] = useState(false);

    // URL del video de Bunny (la que me pasaste)
    // Agregamos ?autoplay=true para que arranque ni bien se cargue el iframe
    const bunnyVideoUrl = "https://player.mediadelivery.net/embed/588203/c9a80d08-b521-4280-ba6a-22c72c256e86?autoplay=true";

    return (
        <section className="agradecimiento-section fade-in">
            <div className="agradecimiento-container">
                
                <div className="agradecimiento-glass-card">
                    
                    {/* --- ZONA DEL VIDEO --- */}
                    <div className="agradecimiento-video-wrapper">
                        
                        {/* 🔥 Lógica condicional: ¿Mostramos el video o la portada? */}
                        {showVideo ? (
                            // SI showVideo es true, mostramos el iframe real
                            <iframe 
                                src={bunnyVideoUrl}
                                loading="lazy" 
                                style={{ border: 'none', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }} 
                                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" 
                                allowFullScreen="true"
                                title="Mensaje de agradecimiento de Alicia"
                            ></iframe>
                        ) : (
                            // SI showVideo es false, mostramos la portada con el botón de play
                            // Al hacer click en este div, cambiamos el estado a true
                            <div 
                                className="agradecimiento-thumbnail-container" 
                                onClick={() => setShowVideo(true)}
                            >
                                {/* Imagen de fondo */}
                                <img 
                                    src={"https://res.cloudinary.com/dmnksm3th/image/upload/v1770840321/fondo-miniatura_1_to39yg.webp"} 
                                    alt="Alicia Teté" 
                                    className="agradecimiento-thumbnail-img"
                                />
                                {/* Capa oscura con el botón de play */}
                                <div className="agradecimiento-thumbnail-overlay">
                                    <button className="agradecimiento-play-btn" aria-label="Reproducir video">
                                        <FaPlay className="agradecimiento-play-icon" />
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* --- ZONA DEL TEXTO (Mitad Derecha) --- */}
                    <div className="agradecimiento-content">
                        <div className="agradecimiento-badge">
                            <FaHeart className="agradecimiento-icon" />
                            <span>Un sueño hecho realidad</span>
                        </div>
                        
                        <h2 className="agradecimiento-title">
                            Gracias por ser parte de este camino
                        </h2>
                        
                        <p className="agradecimiento-text">
                            "Esta plataforma era mi proyecto desde hace mucho tiempo. Sentía que no era el momento de concretarlo porque no encontraba a las personas adecuadas, aquellas que me acompañaran desde el corazón."
                        </p>
                        
                        <p className="agradecimiento-text">
                            "Reconozco mis limitaciones con la informática, pero encontré a un equipo maravilloso de jóvenes (Rocío, Guadalupe, Ariel y Benjamín) que trabajaron con una dedicación fantástica."
                        </p>
                        
                        <p className="agradecimiento-text">
                            "Juntos logramos hacer accesibles todos estos conocimientos, y mi mayor deseo es que este espacio te sea tan útil y transformador como nosotros soñamos."
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