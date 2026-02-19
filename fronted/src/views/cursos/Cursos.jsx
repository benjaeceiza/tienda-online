import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPaidCourses } from "../../services/getPaidCourses";
import { useAuth } from "../../context/AuthContext";
import { getUserCourses } from "../../services/getUserCourses";
import { useLoading } from "../../context/LoadingContext";
import ContactoFlotante from "../../components/ContactoFlotante";
import ModalLogin from "../../components/ModalLogin";

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [usuarioCursos, setUsuarioCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [fondoCurso, setFondoCurso] = useState("");

  const [isPlayingGeneral, setIsPlayingGeneral] = useState(false);
  const [isPlayingCourse, setIsPlayingCourse] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [generalVideoLoading, setGeneralVideoLoading] = useState(true);

  const { user } = useAuth();
  const { hideLoader } = useLoading();
  const { categoria } = useParams();
  const navigate = useNavigate();

  // URLs de Fondos
  const fondoArtesanias = "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840319/fondo-artesanias_wwdtgn.webp";
  const fondoRituales = "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840320/fondo-rituales_peo2hl.webp";
  const fondoEricBarone = "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840318/eric-barone_x7w3ut.webp";
  const fondoSistemaSanacion = "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840320/fondo-intermedio_ymrtyu.webp";
  const fondoAnexo = "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840324/anexos_hrkifd_c9s65n.webp";

  const videosGenerales = {
    "rituales": "https://player.mediadelivery.net/embed/588203/2b26a1a9-1ceb-4034-b949-5b5dcd53d0de",
    "artesanias magicas": "https://player.mediadelivery.net/embed/588203/70ae5c9a-c2e9-4140-934b-b41a1f399d6b",
    "sistema de sanacion en camilla": "https://player.mediadelivery.net/embed/588203/5d7fa29b-76df-4745-b2be-9a16e1a05105",
    "eric barone": "https://player.mediadelivery.net/embed/588203/24f9cf75-6423-46cd-8532-1c1fe090599d"
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
    setGeneralVideoLoading(true);
    setIsPlayingGeneral(false);

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

  useEffect(() => {
    if (cursoSeleccionado) {
      setVideoLoading(true);
      setIsPlayingCourse(false);
    }
  }, [cursoSeleccionado]);

  const esAdmin = user?.rol === "admin" || user?.rol === "administrador";
  const esAnexo = cursoSeleccionado?.categoria?.toLowerCase().includes("anexo");
  const tieneAlgunaCompra = usuarioCursos.length > 0;
  const yaComprado = esAdmin || (cursoSeleccionado && usuarioCursos.some((e) => e.course?._id === cursoSeleccionado._id));

  const VideoFacade = ({ image, onClick, label = "Ver Video" }) => (
    <div className="course-select-video-facade" onClick={onClick}>
      <img src={"https://res.cloudinary.com/dmnksm3th/image/upload/v1770840321/fondo-miniatura_1_to39yg.webp"} alt="Portada Video" className="course-select-facade-image" />
      <div className="course-select-facade-overlay"></div>
      <div className="course-select-play-btn">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <span className="course-select-facade-text">{label}</span>
    </div>
  );

  return (
    <main className="course-select-main-container">
      {fondoCurso && (
        <img src={fondoCurso} alt="background" className="course-select-bg-image" onLoad={hideLoader} />
      )}

      {isVisible && <ModalLogin setIsVisible={setIsVisible} />}

      {/* --- HEADER / VIDEO GENERAL --- */}
      {videoGeneralActual && (
        <section className="course-select-hero-section">
          <div className="course-select-glass-card course-select-hero-card">
            <h2 className="course-select-hero-title">Bienvenida a {categoria}</h2>
            <div className="course-select-divider"></div>

            <div className="course-select-video-wrapper">
              {!isPlayingGeneral ? (
                <VideoFacade
                  image={fondoCurso}
                  onClick={() => setIsPlayingGeneral(true)}
                  label="Ver Bienvenida"
                />
              ) : (
                <>
                  {generalVideoLoading && (
                    <div className="course-select-loader-overlay">
                      <div className="course-select-spinner"></div>
                    </div>
                  )}
                  <iframe
                    src={`${videoGeneralActual}?autoplay=true`}
                    title={`Introducción a ${categoria}`}
                    className="course-select-iframe"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
                    allowFullScreen={true}
                    onLoad={() => setGeneralVideoLoading(false)}
                    style={{ opacity: generalVideoLoading ? 0 : 1 }}
                  ></iframe>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="course-select-content-grid">
        
        {/* COLUMNA IZQUIERDA: DETALLE CURSO */}
        <section className="course-select-detail-column">
          <div className="course-select-glass-card course-select-detail-card">
            
            <div className="course-select-header-inside">
              <div className="course-select-badge">
                <span>{cursoSeleccionado?.categoria || "Cargando..."}</span>
              </div>
              <h1 className="course-select-title" key={cursoSeleccionado?._id}>
                {cursoSeleccionado?.nombre}
              </h1>
            </div>

            <div className="course-select-video-wrapper">
              {cursoSeleccionado?.videoIntroduccion && (
                !isPlayingCourse ? (
                  <VideoFacade
                    image={fondoCurso}
                    onClick={() => setIsPlayingCourse(true)}
                    label="Ver Introducción"
                  />
                ) : (
                  <>
                    {videoLoading && (
                      <div className="course-select-loader-overlay">
                        <div className="course-select-spinner"></div>
                      </div>
                    )}
                    <iframe
                      key={cursoSeleccionado?.videoIntroduccion}
                      src={`${cursoSeleccionado?.videoIntroduccion}?autoplay=true`}
                      title="Video del curso"
                      className="course-select-iframe"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
                      allowFullScreen={true}
                      onLoad={() => setVideoLoading(false)}
                      style={{ opacity: videoLoading ? 0 : 1 }}
                    ></iframe>
                  </>
                )
              )}
            </div>

            <div className="course-select-description-area">
              <p className="course-select-description">{cursoSeleccionado?.descripcion}</p>
            </div>

            <div className="course-select-actions">
              {esAnexo ? (
                tieneAlgunaCompra ? (
                  <Link to={`/curso/${cursoSeleccionado?._id}`} className="course-select-btn course-select-btn-primary">
                    Ver Anexos
                  </Link>
                ) : (
                  <div className="course-select-lock-msg">
                    🔒 Compra un curso para desbloquear anexos
                  </div>
                )
              ) : cursoSeleccionado?.tipo === "Gratuito" || yaComprado ? (
                <Link to={`/curso/${cursoSeleccionado?._id}`} className="course-select-btn course-select-btn-primary">
                  Ingresar al Curso
                </Link>
              ) : (
                <button
                  className="course-select-btn course-select-btn-buy"
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

        {/* COLUMNA DERECHA: LISTA DE CURSOS */}
        {cursos.length > 0 && (
          <section className="course-select-list-column">
             <ButtonsCourses
              cursos={cursos}
              setCursoSeleccionado={setCursoSeleccionado}
              cursoSeleccionado={cursoSeleccionado} // Pasamos el seleccionado para marcarlo activo
            />
          </section>
        )}
      </div>

      <ContactoFlotante />
    </main>
  );
};

// COMPONENTE BOTONES (MODIFICADO PARA RECIBIR SELECCIONADO)
const ButtonsCourses = ({ cursos, setCursoSeleccionado, cursoSeleccionado }) => {
  return (
    <div className="course-select-glass-card course-select-list-card">
      <h2 className="course-select-list-title">Disponibles</h2>
      <div className="course-select-buttons-container">
        {cursos.map((c) => {
             const isActive = cursoSeleccionado?._id === c._id;
             return (
                <div 
                    key={c._id} 
                    className={`course-select-item ${isActive ? 'active' : ''}`} 
                    onClick={() => setCursoSeleccionado(c)}
                >
                    <div className="course-select-item-icon">
                        {/* Icono simple o SVG */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                           <circle cx="12" cy="12" r="10"></circle>
                           <path d="M10 8l6 4-6 4V8z"></path>
                        </svg>
                    </div>
                    <span className="course-select-item-name">{c.nombre}</span>
                    {isActive && <div className="course-select-active-indicator"></div>}
                </div>
             )
        })}
      </div>
    </div>
  );
};

export default Cursos;