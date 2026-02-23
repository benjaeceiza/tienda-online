import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPaidCourses } from "../../services/getPaidCourses";
import { useAuth } from "../../context/AuthContext";
import { getUserCourses } from "../../services/getUserCourses";
import { useLoading } from "../../context/LoadingContext";
import ContactoFlotante from "../../components/ContactoFlotante";
import ModalLogin from "../../components/ModalLogin";
import { FaWhatsapp } from "react-icons/fa";

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

  // 🔥 ESTADO NUEVO: Para mostrar "Agregando..." mientras llama al backend
  const [agregando, setAgregando] = useState(false);

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
  const isEricBarone = categoria?.toLowerCase() === "eric barone";
  const isSanacionEnCamilla = categoria?.toLowerCase() === "sistema de sanacion en camilla";

  // Función para recargar los cursos del usuario (se usa al agregar uno gratis)
  const cargarCursosUsuario = () => {
    if (user) {
      const token = localStorage.getItem("token");
      getUserCourses(token)
        .then((data) => setUsuarioCursos(data.courses || []))
        .catch((err) => console.error(err));
    }
  };

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
      navigate("/");
      return;
    }

    setFondoCurso(fondos[categoria]);
    setGeneralVideoLoading(true);
    setIsPlayingGeneral(false);

    cargarCursosUsuario(); // Cargamos los cursos del usuario al inicio

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

  // --- LÓGICA DE PERMISOS, ANEXOS Y BOTONES ---
  const esAdmin = user?.rol === "admin" || user?.rol === "administrador";
  const tieneAlgunaCompra = usuarioCursos.some((e) => {
    const categoriaUsuario = (e.course?.categoria || "").toLowerCase();
    const precioCurso = e.course?.precio || 0;

    return !categoriaUsuario.includes("anexo") &&
      categoriaUsuario !== "eric barone" &&
      precioCurso > 0;
  });

  // ¿Ya lo tiene en su lista de "Mis Cursos"?
  const yaComprado = esAdmin || (cursoSeleccionado && usuarioCursos.some((e) => e.course?._id === cursoSeleccionado._id));

  const esAnexo = cursoSeleccionado?.categoria?.toLowerCase().includes("anexo");
  const nombreCursoLimpiado = cursoSeleccionado?.nombre?.toLowerCase() || "";
  const requiereCompraAnexo = esAnexo && (nombreCursoLimpiado.includes("2") || nombreCursoLimpiado.includes("ii"));

  // 🔥 VARIABLE CLAVE: ¿Es un curso que se puede agregar gratis a la cuenta?
  // Se puede si es Eric Barone, o si es un Anexo (y no está bloqueado)
  const sePuedeAgregarGratis = isEricBarone || (esAnexo && (!requiereCompraAnexo || tieneAlgunaCompra));

  const videoAMostrar = isEricBarone ? (cursoSeleccionado?.videoIntroduccion || videoGeneralActual) : cursoSeleccionado?.videoIntroduccion;

  // 🔥 FUNCIÓN PARA AGREGAR CURSO GRATIS AL PERFIL
  const handleAgregarCurso = async () => {
    if (!user) {
      setIsVisible(true);
      return;
    }

    setAgregando(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL_BACKEND}/courses/add-free-course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        // Mandamos el ID del curso que está viendo
        body: JSON.stringify({ courseId: cursoSeleccionado._id })
      });

      const result = await response.json();

      if (response.ok) {
        // Se guardó en la BD, recargamos la lista del usuario
        cargarCursosUsuario();
      } else {
        alert(result.error || "Hubo un problema al agregar el curso");
      }

    } catch (error) {
      console.error("Error al agregar curso:", error);
    } finally {
      setAgregando(false);
    }
  };

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

      {/* --- HEADER GENERAL --- */}
      {videoGeneralActual && !isEricBarone && (
        <section className="course-select-hero-section">
          <div className="course-select-glass-card course-select-hero-card">
            <h2 className="course-select-hero-title">Bienvenidos a {categoria}</h2>
            <div className="course-select-divider"></div>

            <div className="course-select-video-wrapper">
              {!isPlayingGeneral ? (
                <VideoFacade image={fondoCurso} onClick={() => setIsPlayingGeneral(true)} label="Ver Bienvenida" />
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
      <div className="course-select-content-grid" style={isEricBarone ? { display: "flex", justifyContent: "center" } : {}}>

        <section className="course-select-detail-column" style={isEricBarone ? { width: "100%", maxWidth: "800px" } : {}}>
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
              {videoAMostrar && (
                !isPlayingCourse ? (
                  <VideoFacade image={fondoCurso} onClick={() => setIsPlayingCourse(true)} label="Ver Introducción" />
                ) : (
                  <>
                    {videoLoading && (
                      <div className="course-select-loader-overlay">
                        <div className="course-select-spinner"></div>
                      </div>
                    )}
                    <iframe
                      key={videoAMostrar}
                      src={`${videoAMostrar}?autoplay=true`}
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

       

            {isSanacionEnCamilla && (
              <div className="course-select-sesion-banner fade-in">
                <div className="sesion-banner-content">
                  <h4 className="sesion-banner-title">¿Preferís una atención personalizada?</h4>
                  <p className="sesion-banner-text">Ofrecemos sesiones individuales de sanación en camilla.</p>
                </div>
                {/* Reemplazá el número con el WhatsApp real (con código de país, ej: 549...) */}
                <a
                  href="https://wa.me/5492657547597?text=Hola!%20Me%20gustar%C3%ADa%20consultar%20por%20una%20sesi%C3%B3n%20personalizada%20de%20Sanaci%C3%B3n%20en%20Camilla."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sesion-banner-btn"
                >
                  <FaWhatsapp className="sesion-icon-wsp" /> Consultar Turno
                </a>
              </div>
            )}

            <div className="course-select-actions">
              {/* LÓGICA DE BOTONES DEFINITIVA */}

              {yaComprado ? (
                /* 1. YA LO TIENE EN SU CUENTA */
                <Link to={`/curso/${cursoSeleccionado?._id}`} className="course-select-btn course-select-btn-primary">
                  Ingresar al Curso
                </Link>

              ) : esAnexo && requiereCompraAnexo && !tieneAlgunaCompra ? (
                /* 2. ESTÁ BLOQUEADO (Anexo 2 sin compras) */
                <div className="course-select-lock-msg" style={{ padding: "10px", background: "rgba(255,0,0,0.1)", borderRadius: "8px", color: "#d32f2f", fontWeight: "600", textAlign: "center" }}>
                  🔒 Compra cualquier curso para desbloquear este anexo
                </div>

              ) : sePuedeAgregarGratis || cursoSeleccionado?.tipo === "Gratuito" ? (
                /* 3. ES GRATIS / ANEXO / ERIC BARONE -> SE AGREGA A LA CUENTA */
                <button
                  className="course-select-btn course-select-btn-primary" // Podés cambiarle la clase si querés un color distinto
                  onClick={handleAgregarCurso}
                  disabled={agregando}
                  style={{ opacity: agregando ? 0.7 : 1, cursor: agregando ? "wait" : "pointer" }}
                >
                  {agregando ? "Agregando..." : "Agregar a mis cursos"}
                </button>

              ) : (
                /* 4. ES UN CURSO PAGO NORMAL -> VA A MERCADO PAGO */
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

        {!isEricBarone && cursos.length > 0 && (
          <section className="course-select-list-column">
            <ButtonsCourses cursos={cursos} setCursoSeleccionado={setCursoSeleccionado} cursoSeleccionado={cursoSeleccionado} />
          </section>
        )}
      </div>

      <ContactoFlotante />
    </main>
  );
};

// COMPONENTE BOTONES
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