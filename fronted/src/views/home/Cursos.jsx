import { useState } from "react"; // Importamos useState
import { useLoading } from "../../context/LoadingContext";
import { Link } from "react-router-dom";


const Cursos = () => {
    const { hideLoader } = useLoading();
    
    // Estado para saber qué video se está reproduciendo actualmente. 
    // Guardamos el ID del curso. Si es null, ninguno se reproduce.
    const [activeVideoId, setActiveVideoId] = useState(null);

    const coursesList = [
        {
            id: "rituales",
            title: "Rituales",
            subtitle: "Espacios sagrados para intencionar, sanar y transformar.",
            image: "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840320/fondo-rituales_peo2hl.webp",
            link: "/cursos/rituales",
            // NOTA: En la URL original dice autoplay=false. 
            // Abajo en la lógica lo cambiaremos a true cuando el usuario de click.
            videoUrl: "https://player.mediadelivery.net/embed/588203/abfac55d-7f41-4f2c-a2b0-a82534eba7af" 
        },
        {
            id: "artesanias",
            title: "Artesanías",
            subtitle: "Objetos creados con intención, conciencia y energía.",
            image: "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840319/fondo-artesanias_wwdtgn.webp",
            link: "/cursos/artesanias magicas",
            videoUrl: "https://player.mediadelivery.net/embed/588203/c3be099c-fdb5-4dcd-a40c-27de36a0ca97"
        },
        {
            id: "sanacion",
            title: "Sist. de Sanación",
            subtitle: "Acompañamiento energético profundo para armonizar los cuerpos.",
            image: "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840320/fondo-intermedio_ymrtyu.webp",
            link: "/cursos/sistema de sanacion en camilla",
            videoUrl: "https://player.mediadelivery.net/embed/588203/65bd85fe-37f1-4439-83bb-99d32aebe751"
        },
        {
            id: "anexos",
            title: "Anexos",
            subtitle: "Material complementario que profundiza los fundamentos.",
            image: "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840324/anexos_hrkifd_c9s65n.webp",
            link: "/cursos/anexos",
            videoUrl: "https://player.mediadelivery.net/embed/588203/7bcbe6a6-5422-4da6-9e82-c32e82c90d18"
        },
        {
            id: "barone",
            title: "Eric Barone",
            subtitle: "Aportes escritos para nutrir la ciencia y la comprensión.",
            image: "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840318/eric-barone_x7w3ut.webp",
            link: "/cursos/eric barone",
            videoUrl: "https://player.mediadelivery.net/embed/588203/24f9cf75-6423-46cd-8532-1c1fe090599d"
        }
    ];

    return (
        <section className="coursesContainerHome">
            {coursesList.map((curso) => (
                <div className="coursesCardContainer" key={curso.id}>
                    
                    {/* IMAGEN DE FONDO */}
                    <img 
                        className="bgCourseHome" 
                        src={curso.image} 
                        alt={curso.title} 
                        onLoad={hideLoader} 
                    />

                    {/* === GRUPO IZQUIERDO === */}
                    <div className="infoLeftColumn">
                        <div className="textCoursesHome">
                            <h2 className="titleCourseHome">{curso.title}</h2>
                            <p className="subtitleCourseHome">{curso.subtitle}</p>
                        </div>

                        <Link to={curso.link} className="btnLinkWrapper">
                            <div className="btnWrapper">
                                <svg className="ring" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" className="dashed-circle" />
                                </svg>
                                <button className="btnHome">Ver<br />Cursos</button>
                            </div>
                        </Link>
                    </div>

                    {/* === GRUPO DERECHO (VIDEO OPTIMIZADO) === */}
                    <div className="mediaWrapperHome">
                        <div className="videoPreviewHome">
                            
                            {/* LÓGICA DE CARGA: ¿Está activo este video? */}
                            {activeVideoId === curso.id ? (
                                // A) SI ESTÁ ACTIVO: Renderizamos el Iframe real con Autoplay
                                <iframe 
                                    src={`${curso.videoUrl}?autoplay=true`} // Forzamos autoplay al cargar
                                    title={`Video ${curso.title}`}
                                    className="iframeHome"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                // B) NO ESTÁ ACTIVO: Mostramos la "Fachada" (Imagen + Botón Play)
                                <div 
                                    className="videoFacade" 
                                    onClick={() => setActiveVideoId(curso.id)}
                                >
                                    {/* Usamos la misma imagen del curso como miniatura */}
                                    <img src={curso.image} alt="Cover" className="facadeImage" />
                                    
                                    {/* Capa oscura */}
                                    <div className="facadeOverlay"></div>
                                    
                                    {/* Botón de Play Fachero */}
                                    <div className="facadePlayBtn">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="playIconSvg">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                    <span className="facadeText">Ver Introducción</span>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            ))}
        </section>
    );
};

export default Cursos;