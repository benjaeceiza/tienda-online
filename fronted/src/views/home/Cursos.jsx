import { useState } from "react";
import { useLoading } from "../../context/LoadingContext";
import { Link } from "react-router-dom";
// 🔥 Importamos el hook de traducción
import { useTranslation } from 'react-i18next';

const Cursos = () => {
    const { hideLoader } = useLoading();
    // 🔥 Iniciamos el traductor
    const { t } = useTranslation("global");
    
    const [activeVideoId, setActiveVideoId] = useState(null);

    // 🔥 Traducimos los elementos del array directamente
    const coursesList = [
        {
            id: "rituales",
            title: t("cursos_home.rituales.title"),
            subtitle: t("cursos_home.rituales.subtitle"),
            image: "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840320/fondo-rituales_peo2hl.webp",
            link: "/cursos/rituales",
            videoUrl: "https://player.mediadelivery.net/embed/588203/abfac55d-7f41-4f2c-a2b0-a82534eba7af" 
        },
        {
            id: "artesanias",
            title: t("cursos_home.artesanias.title"),
            subtitle: t("cursos_home.artesanias.subtitle"),
            image: "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840319/fondo-artesanias_wwdtgn.webp",
            link: "/cursos/artesanias magicas",
            videoUrl: "https://player.mediadelivery.net/embed/588203/c3be099c-fdb5-4dcd-a40c-27de36a0ca97"
        },
        {
            id: "sanacion",
            title: t("cursos_home.sanacion.title"),
            subtitle: t("cursos_home.sanacion.subtitle"),
            image: "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840320/fondo-intermedio_ymrtyu.webp",
            link: "/cursos/sistema de sanacion en camilla",
            videoUrl: "https://player.mediadelivery.net/embed/588203/65bd85fe-37f1-4439-83bb-99d32aebe751"
        },
        {
            id: "anexos",
            title: t("cursos_home.anexos.title"),
            subtitle: t("cursos_home.anexos.subtitle"),
            image: "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840324/anexos_hrkifd_c9s65n.webp",
            link: "/cursos/anexos",
            videoUrl: "https://player.mediadelivery.net/embed/588203/7bcbe6a6-5422-4da6-9e82-c32e82c90d18"
        },
        {
            id: "barone",
            title: t("cursos_home.barone.title"),
            subtitle: t("cursos_home.barone.subtitle"),
            image: "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840318/eric-barone_x7w3ut.webp",
            link: "/cursos/eric barone",
            videoUrl: "https://player.mediadelivery.net/embed/588203/24f9cf75-6423-46cd-8532-1c1fe090599d"
        }
    ];

    return (
        <section className="coursesContainerHome">
            {coursesList.map((curso) => (
                <div className="coursesCardContainer" key={curso.id}>
                    
                    <img 
                        className="bgCourseHome" 
                        src={curso.image} 
                        alt={curso.title} 
                        onLoad={hideLoader} 
                    />

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
                                {/* 🔥 Traducción del botón */}
                                <button className="btnHome">{t("cursos_home.btn_ver_1")}<br />{t("cursos_home.btn_ver_2")}</button>
                            </div>
                        </Link>
                    </div>

                    <div className="mediaWrapperHome">
                        <div className="videoPreviewHome">
                            
                            {activeVideoId === curso.id ? (
                                <iframe 
                                    src={`${curso.videoUrl}?autoplay=true`} 
                                    title={`Video ${curso.title}`}
                                    className="iframeHome"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div 
                                    className="videoFacade" 
                                    onClick={() => setActiveVideoId(curso.id)}
                                >
                                    <img src={curso.image} alt="Cover" className="facadeImage" />
                                    <div className="facadeOverlay"></div>
                                    <div className="facadePlayBtn">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="playIconSvg">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                    {/* 🔥 Traducción del texto de la fachada */}
                                    <span className="facadeText">{t("cursos_home.ver_introduccion")}</span>
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