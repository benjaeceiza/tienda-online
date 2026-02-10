import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPaidCourses } from "../../services/getPaidCourses";
import { useAuth } from "../../context/AuthContext";
import { getUserCourses } from "../../services/getUserCourses";
import { useLoading } from "../../context/LoadingContext";
import ButtonsCourses from "./ButtonsCourses";
import ContactoFlotante from "../../components/ContactoFlotante";
import ModalLogin from "../../components/ModalLogin";

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [usuarioCursos, setUsuarioCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [fondoCurso, setFondoCurso] = useState("");

  // Loaders
  const [videoLoading, setVideoLoading] = useState(true); // Loader para curso específico
  const [generalVideoLoading, setGeneralVideoLoading] = useState(true); // Loader para video general

  const { user } = useAuth();
  const { hideLoader } = useLoading();
  const { categoria } = useParams();
  const navigate = useNavigate();

  // URLs de Fondos
  const fondoArtesanias = "https://i.postimg.cc/CKCGt1Rt/fondo_artesanias.png";
  const fondoRituales = "https://i.postimg.cc/q7csYRNP/fondo_rituales.png";
  const fondoEricBarone = "https://res.cloudinary.com/dmnksm3th/image/upload/v1769627595/barone_ghq6za.png";
  const fondoSistemaSanacion = "https://i.postimg.cc/FR9yQ4c7/fondo_intermedio.png";
  const fondoAnexo = "https://i.postimg.cc/JnLNYjq8/fondo-anexo.png";

  // --- NUEVA CONFIGURACIÓN: VIDEOS GENERALES POR CATEGORÍA ---

  const videosGenerales = {
    "rituales": "https://player.mediadelivery.net/embed/588203/2b26a1a9-1ceb-4034-b949-5b5dcd53d0de",
    "artesanias magicas": "https://player.mediadelivery.net/embed/588203/abfac55d-7f41-4f2c-a2b0-a82534eba7af?autoplay=false",
    "sistema de sanacion en camilla": "https://player.mediadelivery.net/embed/588203/65bd85fe-37f1-4439-83bb-99d32aebe751?autoplay=false",
    "eric barone": "https://player.mediadelivery.net/embed/588203/24f9cf75-6423-46cd-8532-1c1fe090599d?autoplay=false"
    // "anexos" se ha eliminado intencionalmente.
  };

  const videoGeneralActual = videosGenerales[categoria];

  useEffect(() => {
    const fondos = {
      "artesanias magicas": fondoArtesanias,
      "rituales": fondoRituales,
      "eric barone": fondoEricBarone,
      "sistema de sanacion en camilla": fondoSistemaSanacion,
      "anexos": fondoAnexo,
      "anexo": fondoAnexo
    };

    if (!fondos[categoria]) {
      console.warn(`Categoría "${categoria}" no existe.`);
      navigate("/");
      return;
    }

    setFondoCurso(fondos[categoria]);

    // Reseteamos el loader del video general al cambiar de categoría
    setGeneralVideoLoading(true);

    if (user) {
      const token = localStorage.getItem("token");
      getUserCourses(token)
        .then((data) => setUsuarioCursos(data.courses || []))
        .catch((err) => console.error(err));
    }

    getPaidCourses(categoria)
      .then((data) => {
        const cursosApi = data.courses || [];
        setCursos(cursosApi);
        if (cursosApi.length > 0) {
          setCursoSeleccionado(cursosApi[0]);
        }
      })
      .catch((err) => console.error(err));

  }, [categoria, user, navigate]);

  // RESET LOADER WHEN SPECIFIC COURSE CHANGES
  useEffect(() => {
    if (cursoSeleccionado) {
      setVideoLoading(true);
    }
  }, [cursoSeleccionado]);

  const esAnexo = cursoSeleccionado?.categoria?.toLowerCase().includes("anexo");
  const tieneAlgunaCompra = usuarioCursos.length > 0;
  const yaComprado = cursoSeleccionado && usuarioCursos.some((e) => e.course?._id === cursoSeleccionado._id);

  return (
    <main className="bgCourseContainer">
      {fondoCurso && (
        <img src={fondoCurso} alt="background" className="bgCourseImage" onLoad={hideLoader} />
      )}

      {isVisible && <ModalLogin setIsVisible={setIsVisible} />}

      {/* --- NUEVA SECCIÓN: VIDEO GENERAL DE BIENVENIDA --- */}
      {/* Solo se renderiza si videoGeneralActual tiene valor (es decir, no es anexos) */}
      {videoGeneralActual && (
        <section className="generalVideoSection">
          <div className="generalVideoCard">
            <h2 className="generalVideoTitle">Bienvenida a {categoria}</h2>
            <div className="generalVideoDivider"></div>
            <div className="videoWrapper" style={{ position: 'relative', minHeight: '300px' }}>
              {generalVideoLoading && (
                <div className="video-loader-overlay">
                  <div className="spinner-course"></div>
                </div>
              )}
              <iframe
                src={`${videoGeneralActual}?autoplay=false`}
                title={`Introducción a ${categoria}`}
                className="iframeVideo"
                allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;"
                allowFullScreen={true}
                onLoad={() => setGeneralVideoLoading(false)}
                style={{ opacity: generalVideoLoading ? 0 : 1, transition: 'opacity 0.3s ease' }}
              ></iframe>
            </div>
          </div>
        </section>
      )}

      <div className="contenedorVideoBotonCursos">
        <section className="columnLeft">
          <div className="videoCard">
            <div className="titleHeaderInside">
              <div className="categoryBadge">
                <span className="value">
                  {cursoSeleccionado?.categoria || "Cargando..."}
                </span>
              </div>
              <h1 className="courseTitle slide-right" key={cursoSeleccionado?._id}>
                {cursoSeleccionado?.nombre}
              </h1>
            </div>

            {/* VIDEO WRAPPER DEL CURSO ESPECÍFICO */}
            <div className="videoWrapper" style={{ position: 'relative', minHeight: '300px' }}>
              {videoLoading && (
                <div className="video-loader-overlay">
                  <div className="spinner-course"></div>
                </div>
              )}
              {cursoSeleccionado?.videoIntroduccion && (
                <iframe
                  key={cursoSeleccionado?.videoIntroduccion}
                  src={`${cursoSeleccionado?.videoIntroduccion}?autoplay=false`}
                  title="Video del curso"
                  className="iframeVideo"
                  allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;"
                  allowFullScreen={true}
                  onLoad={() => setVideoLoading(false)}
                  style={{ opacity: videoLoading ? 0 : 1, transition: 'opacity 0.3s ease' }}
                ></iframe>
              )}
            </div>

            <div className="descriptionArea">
              <p className="descriptionText">{cursoSeleccionado?.descripcion}</p>
            </div>

            <div className="actionButtonsArea">
              {esAnexo ? (
                tieneAlgunaCompra ? (
                  <Link to={`/curso/${cursoSeleccionado?._id}`} className="ctaButton">
                    Ver Anexos
                  </Link>
                ) : (
                  <div className="lockMessage">
                    🔒 Compra un curso para desbloquear anexos
                  </div>
                )
              ) : cursoSeleccionado?.tipo === "Gratuito" || yaComprado ? (
                <Link to={`/curso/${cursoSeleccionado?._id}`} className="ctaButton">
                  Ingresar al Curso
                </Link>
              ) : (
                <button
                  className="ctaButton buyButton"
                  onClick={() => {
                    if (!user) {
                      setIsVisible(true);
                      return;
                    }
                    navigate(`/payment/${user.id}/${cursoSeleccionado._id}`);
                  }}
                >
                  COMPRAR ARS ${cursoSeleccionado?.precio}
                </button>
              )}
            </div>
          </div>
        </section>

        {cursos.length <= 1 ? "" : (
          <section className="columnRight">
            <ButtonsCourses
              cursos={cursos}
              setCursoSeleccionado={setCursoSeleccionado}
            />
          </section>
        )}
      </div>

      <ContactoFlotante />
    </main>
  );
};

export default Cursos;