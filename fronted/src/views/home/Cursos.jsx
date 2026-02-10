import { useLoading } from "../../context/LoadingContext";
import { Link } from "react-router-dom";


const Cursos = () => {
    const { hideLoader } = useLoading();

    // LISTA DE DATOS (Edita aquí textos, imágenes y videos)
    const coursesList = [
        {
            id: "rituales",
            title: "Rituales",
            subtitle: "Espacios sagrados para intencionar, sanar y transformar.",
            image: "https://i.postimg.cc/q7csYRNP/fondo_rituales.png",
            link: "/cursos/rituales",
            videoUrl: "https://player.mediadelivery.net/embed/588203/abfac55d-7f41-4f2c-a2b0-a82534eba7af?autoplay=false" 
        },
        {
            id: "artesanias",
            title: "Artesanías",
            subtitle: "Objetos creados con intención, conciencia y energía.",
            image: "https://i.postimg.cc/CKCGt1Rt/fondo_artesanias.png",
            link: "/cursos/artesanias magicas",
            videoUrl: "https://player.mediadelivery.net/embed/588203/c3be099c-fdb5-4dcd-a40c-27de36a0ca97?autoplay=false"
        },
        {
            id: "sanacion",
            title: "Sist. de Sanación",
            subtitle: "Acompañamiento energético profundo para armonizar los cuerpos.",
            image: "https://i.postimg.cc/FR9yQ4c7/fondo_intermedio.png",
            link: "/cursos/sistema de sanacion en camilla",
            videoUrl: "https://player.mediadelivery.net/embed/588203/65bd85fe-37f1-4439-83bb-99d32aebe751?autoplay=false"
        },
        {
            id: "anexos",
            title: "Anexos",
            subtitle: "Material complementario que profundiza los fundamentos.",
            image: "https://res.cloudinary.com/dmnksm3th/image/upload/v1769628078/anexos_hrkifd.png",
            link: "/cursos/anexos",
            videoUrl: "https://player.mediadelivery.net/embed/588203/7bcbe6a6-5422-4da6-9e82-c32e82c90d18?autoplay=false"
        },
        {
            id: "barone",
            title: "Eric Barone",
            subtitle: "Aportes escritos para nutrir la ciencia y la comprensión.",
            image: "https://res.cloudinary.com/dmnksm3th/image/upload/v1769627595/barone_ghq6za.png",
            link: "/cursos/eric barone",
            videoUrl: "https://player.mediadelivery.net/embed/588203/24f9cf75-6423-46cd-8532-1c1fe090599d?autoplay=false"
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

                    {/* === GRUPO IZQUIERDO (Texto + Botón) === */}
                    <div className="infoLeftColumn">
                        
                        {/* 1. TEXTO */}
                        <div className="textCoursesHome">
                            <h2 className="titleCourseHome">{curso.title}</h2>
                            <p className="subtitleCourseHome">{curso.subtitle}</p>
                        </div>

                        {/* 3. BOTÓN (En PC queda abajo del texto) */}
                        <Link to={curso.link} className="btnLinkWrapper">
                            <div className="btnWrapper">
                                <svg className="ring" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" className="dashed-circle" />
                                </svg>
                                <button className="btnHome">Ver<br />Cursos</button>
                            </div>
                        </Link>

                    </div>

                    {/* === GRUPO DERECHO (Solo Video) === */}
                    {/* 2. VIDEO */}
                    <div className="mediaWrapperHome">
                        <div className="videoPreviewHome">
                            <iframe 
                                src={curso.videoUrl}
                                title={`Video ${curso.title}`}
                                className="iframeHome"
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>

                </div>
            ))}
        </section>
    );
};

export default Cursos;