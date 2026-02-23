import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPaidCourses } from "../../services/getPaidCourses";
import { useAuth } from "../../context/AuthContext";
import { getUserCourses } from "../../services/getUserCourses";
import { useLoading } from "../../context/LoadingContext";
import ContactoFlotante from "../../components/ContactoFlotante";
import ModalLogin from "../../components/ModalLogin";
import { FaWhatsapp } from "react-icons/fa";
// 🔥 Importamos i18next
import { useTranslation } from 'react-i18next';

const Cursos = () => {
  const { t } = useTranslation("global");
  const [cursos, setCursos] = useState([]);
  const [usuarioCursos, setUsuarioCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [fondoCurso, setFondoCurso] = useState("");

  const [isPlayingGeneral, setIsPlayingGeneral] = useState(false);
  const [isPlayingCourse, setIsPlayingCourse] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [generalVideoLoading, setGeneralVideoLoading] = useState(true);
  const [agregando, setAgregando] = useState(false);

  const { user } = useAuth();
  const { hideLoader } = useLoading();
  const { categoria } = useParams();
  const navigate = useNavigate();

  // URLs de Fondos
  const fondos = {
    "artesanias magicas": "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840319/fondo-artesanias_wwdtgn.webp",
    "rituales": "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840320/fondo-rituales_peo2hl.webp",
    "eric barone": "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840318/eric-barone_x7w3ut.webp",
    "sistema de sanacion en camilla": "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840320/fondo-intermedio_ymrtyu.webp",
    "anexos": "https://res.cloudinary.com/dmnksm3th/image/upload/v1770840324/anexos_hrkifd_c9s65n.webp"
  };

  const videosGenerales = {
    "rituales": "https://player.mediadelivery.net/embed/588203/2b26a1a9-1ceb-4034-b949-5b5dcd53d0de",
    "artesanias magicas": "https://player.mediadelivery.net/embed/588203/70ae5c9a-c2e9-4140-934b-b41a1f399d6b",
    "sistema de sanacion en camilla": "https://player.mediadelivery.net/embed/588203/5d7fa29b-76df-4745-b2be-9a16e1a05105",
    "eric barone": "https://player.mediadelivery.net/embed/588203/24f9cf75-6423-46cd-8532-1c1fe090599d"
  };

  const videoGeneralActual = videosGenerales[categoria];
  const isEricBarone = categoria?.toLowerCase() === "eric barone";
  const isSanacionEnCamilla = categoria?.toLowerCase() === "sistema de sanacion en camilla";

  const cargarCursosUsuario = () => {
    if (user) {
      const token = localStorage.getItem("token");
      getUserCourses(token)
        .then((data) => setUsuarioCursos(data.courses || []))
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    if (!fondos[categoria]) {
      navigate("/");
      return;
    }
    setFondoCurso(fondos[categoria]);
    setGeneralVideoLoading(true);
    setIsPlayingGeneral(false);
    cargarCursosUsuario();

    getPaidCourses(categoria)
      .then((data) => {
        const cursosApi = data.courses || [];
        setCursos(cursosApi);
        if (cursosApi.length > 0) setCursoSeleccionado(cursosApi[0]);
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
  const tieneAlgunaCompra = usuarioCursos.some((e) => {
    const cat = (e.course?.categoria || "").toLowerCase();
    return !cat.includes("anexo") && cat !== "eric barone" && (e.course?.precio || 0) > 0;
  });

  const yaComprado = esAdmin || (cursoSeleccionado && usuarioCursos.some((e) => e.course?._id === cursoSeleccionado._id));
  const esAnexo = cursoSeleccionado?.categoria?.toLowerCase().includes("anexo");
  const nombreCursoLimpiado = cursoSeleccionado?.nombre?.toLowerCase() || "";
  const requiereCompraAnexo = esAnexo && (nombreCursoLimpiado.includes("2") || nombreCursoLimpiado.includes("ii"));
  const sePuedeAgregarGratis = isEricBarone || (esAnexo && (!requiereCompraAnexo || tieneAlgunaCompra));
  const videoAMostrar = isEricBarone ? (cursoSeleccionado?.videoIntroduccion || videoGeneralActual) : cursoSeleccionado?.videoIntroduccion;

  const handleAgregarCurso = async () => {
    if (!user) { setIsVisible(true); return; }
    setAgregando(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL_BACKEND}/courses/add-free-course`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ courseId: cursoSeleccionado._id })
      });
      if (resp.ok) cargarCursosUsuario();
    } catch (error) { console.error(error); } finally { setAgregando(false); }
  };

  const VideoFacade = ({ onClick, label = "Ver Video" }) => (
    <div className="course-select-video-facade" onClick={onClick}>
      <img src={"https://res.cloudinary.com/dmnksm3th/image/upload/v1770840321/fondo-miniatura_1_to39yg.webp"} alt="Portada" className="course-select-facade-image" />
      <div className="course-select-facade-overlay"></div>
      <div className="course-select-play-btn">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
      </div>
      <span className="course-select-facade-text">{label}</span>
    </div>
  );

  return (
    <main className="course-select-main-container">
      {fondoCurso && <img src={fondoCurso} alt="bg" className="course-select-bg-image" onLoad={hideLoader} />}
      {isVisible && <ModalLogin setIsVisible={setIsVisible} />}

      {/* --- HEADER GENERAL --- */}
      {videoGeneralActual && !isEricBarone && (
        <section className="course-select-hero-section">
          <div className="course-select-glass-card course-select-hero-card">
            <h2 className="course-select-hero-title">
              {t("cursos_vista.bienvenida")} {t(`navbar.cursos_${categoria.replace(/ /g, "_")}`, categoria)}
            </h2>
            <div className="course-select-divider"></div>
            <div className="course-select-video-wrapper">
              {!isPlayingGeneral ? (
                <VideoFacade onClick={() => setIsPlayingGeneral(true)} label={t("cursos_vista.ver_bienvenida")} />
              ) : (
                <>
                  {generalVideoLoading && <div className="course-select-loader-overlay"><div className="course-select-spinner"></div></div>}
                  <iframe src={`${videoGeneralActual}?autoplay=true`} title="Intro" className="course-select-iframe" allowFullScreen onLoad={() => setGeneralVideoLoading(false)} style={{ opacity: generalVideoLoading ? 0 : 1 }}></iframe>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="course-select-content-grid" style={isEricBarone ? { display: "flex", justifyContent: "center" } : {}}>
        <section className="course-select-detail-column" style={isEricBarone ? { width: "100%", maxWidth: "800px" } : {}}>
          <div className="course-select-glass-card course-select-detail-card">
            <div className="course-select-header-inside">
              <div className="course-select-badge">
                <span>{t(`navbar.cursos_${cursoSeleccionado?.categoria?.replace(/ /g, "_")}`, cursoSeleccionado?.categoria)}</span>
              </div>
              <h1 className="course-select-title">
                {t(`cursos_db.${cursoSeleccionado?._id}.nombre`, cursoSeleccionado?.nombre)}
              </h1>
            </div>

            <div className="course-select-video-wrapper">
              {videoAMostrar && (!isPlayingCourse ? (
                <VideoFacade onClick={() => setIsPlayingCourse(true)} label={t("cursos_vista.ver_introduccion")} />
              ) : (
                <>
                  {videoLoading && <div className="course-select-loader-overlay"><div className="course-select-spinner"></div></div>}
                  <iframe src={`${videoAMostrar}?autoplay=true`} title="Video" className="course-select-iframe" allowFullScreen onLoad={() => setVideoLoading(false)} style={{ opacity: videoLoading ? 0 : 1 }}></iframe>
                </>
              ))}
            </div>

            {isSanacionEnCamilla && (
              <div className="course-select-sesion-banner fade-in">
                <div className="sesion-banner-content">
                  <h4 className="sesion-banner-title">{t("cursos_vista.atencion_personalizada")}</h4>
                  <p className="sesion-banner-text">{t("cursos_vista.atencion_texto")}</p>
                </div>
                <a href="https://wa.me/5492657547597?text=Hola!" target="_blank" rel="noopener noreferrer" className="sesion-banner-btn">
                  <FaWhatsapp className="sesion-icon-wsp" /> {t("cursos_vista.consultar_turno")}
                </a>
              </div>
            )}

            <div className="course-select-actions">
              {yaComprado ? (
                <Link to={`/curso/${cursoSeleccionado?._id}`} className="course-select-btn course-select-btn-primary">
                  {t("cursos_vista.ingresar")}
                </Link>
              ) : esAnexo && requiereCompraAnexo && !tieneAlgunaCompra ? (
                <div className="course-select-lock-msg" style={{ padding: "10px", background: "rgba(255,0,0,0.1)", borderRadius: "8px", color: "#d32f2f", fontWeight: "600", textAlign: "center" }}>
                  {t("cursos_vista.bloqueado")}
                </div>
              ) : sePuedeAgregarGratis || cursoSeleccionado?.tipo === "Gratuito" ? (
                <button className="course-select-btn course-select-btn-primary" onClick={handleAgregarCurso} disabled={agregando}>
                  {agregando ? t("cursos_vista.agregando") : t("cursos_vista.agregar_gratis")}
                </button>
              ) : (
                <button className="course-select-btn course-select-btn-buy" onClick={() => { if (!user) { setIsVisible(true); return; } navigate(`/payment/${user.id}/${cursoSeleccionado._id}`); }}>
                  {t("cursos_vista.comprar")} ${cursoSeleccionado?.precio}
                </button>
              )}
            </div>
          </div>
        </section>

        {!isEricBarone && cursos.length > 0 && (
          <section className="course-select-list-column">
             {/* COMPONENTE DE BOTONES RE-INTEGRADO */}
            <div className="course-select-glass-card course-select-list-card">
              <h2 className="course-select-list-title">{t("cursos_vista.tus_cursos")}</h2>
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
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M10 8l6 4-6 4V8z"></path>
                        </svg>
                      </div>
                      <span className="course-select-item-name">
                         {t(`cursos_db.${c._id}.nombre`, c.nombre)}
                      </span>
                      {isActive && <div className="course-select-active-indicator"></div>}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}
      </div>
      <ContactoFlotante />
    </main>
  );
};

export default Cursos;