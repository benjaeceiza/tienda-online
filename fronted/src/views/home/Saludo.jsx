import { useState } from 'react';

const Saludo = () => {
    // Estado para la carga del video
    const [loadingV1, setLoadingV1] = useState(true);

    return (
        <section className="saludo-section">
            <div className="saludo-container">
                <div className="saludo-grid">

                    {/* === COLUMNA DE TEXTO === */}
                    <div className="saludo-text-column">
                        <span className="saludo-subtitle">Bienvenidos a mi espacio</span>
                        <h2 className="saludo-title">Sanaciones Cosmotelúricas</h2>
                        <div className="saludo-divider"></div>
                        <p className="saludo-description">
                            Un espacio para explorar, sentir y acompañar tu propio proceso de sanación y conciencia.
                            Aquí encontrarás herramientas y guías para tu evolución personal.
                        </p>
                    </div>

                    {/* === COLUMNA DE VIDEO (SOLO UNO) === */}
                    <div className="saludo-video-column">
                        <div className="single-video-card">
                            <div className="saludo-video-wrapper">
                                
                                {/* LOADER */}
                                {loadingV1 && (
                                    <div className="saludo-video-loader">
                                        <div className="spinner"></div>
                                    </div>
                                )}

                                {/* IFRAME */}
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