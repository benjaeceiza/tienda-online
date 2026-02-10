import { useState } from 'react';

const Saludo = () => {
    // Estado independiente para cada video (así cargan a su propio ritmo)
    const [loadingV1, setLoadingV1] = useState(true);
    const [loadingV2, setLoadingV2] = useState(true);

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

                    {/* === COLUMNA DE VIDEOS (GRID DUAL) === */}
                    <div className="saludo-video-column">
                        
                        {/* Contenedor para los dos videos */}
                        <div className="videos-dual-container">

                            {/* VIDEO 1 */}
                            <div className="single-video-card">
                                <div className="saludo-video-wrapper">
                                    {loadingV1 && (
                                        <div className="saludo-video-loader">
                                            <div className="spinner"></div>
                                        </div>
                                    )}
                                    <iframe
                                        className="saludo-iframe"
                                        src="https://player.mediadelivery.net/embed/588203/041d4595-6348-434d-b15d-663a3ff7fd6a?autoplay=false"
                                        title="Video Bienvenida 1"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        onLoad={() => setLoadingV1(false)}
                                    ></iframe>
                                </div>
                            </div>

                            {/* VIDEO 2 */}
                            <div className="single-video-card">
                                <div className="saludo-video-wrapper">
                                    {loadingV2 && (
                                        <div className="saludo-video-loader">
                                            <div className="spinner"></div>
                                        </div>
                                    )}
                                    <iframe
                                        className="saludo-iframe"
                                        src="https://player.mediadelivery.net/embed/588203/aa0fdfc0-a092-4384-972a-971b0505267a?autoplay=false"
                                        title="Video Bienvenida 2"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        onLoad={() => setLoadingV2(false)}
                                    ></iframe>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Saludo;