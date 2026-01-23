import { useEffect, useState } from "react";
import { getPaidCourses } from "../../services/getPaidCourses";
import { useAuth } from "../../context/AuthContext";
import { getUserCourses } from "../../services/getUserCourses";
import ButtonsCourses from "./ButtonsCourses";
import { Link, useNavigate, useParams } from "react-router-dom";
import ContactoFlotante from "../../components/ContactoFlotante";
import ModalLogin from "../../components/ModalLogin";
import { useLoading } from "../../context/LoadingContext";


const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [usuarioCursos, setUsuarioCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [fondoCurso, setFondoCurso] = useState("");
  const { user } = useAuth();
  const { hideLoader } = useLoading();
  const { categoria } = useParams();

  const fondoArtesanias = "https://i.postimg.cc/CKCGt1Rt/fondo_artesanias.png";
  const fondoRituales = "https://i.postimg.cc/q7csYRNP/fondo_rituales.png";
  const fondoEricBarone = "https://i.postimg.cc/7hjJb8Cg/eric-barone.png";
  const fondoSistemaSanacion = "https://i.postimg.cc/x89Nzygs/inicio.png";
  const fondoAnexo = "https://i.postimg.cc/JnLNYjq8/fondo-anexo.png";

  const navigate = useNavigate();

  useEffect(() => {
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

    categoria === "artesanias magicas" && setFondoCurso(fondoArtesanias);
    categoria === "rituales" && setFondoCurso(fondoRituales);
    categoria === "eric barone" && setFondoCurso(fondoEricBarone);
    categoria === "sistema de sanacion en camilla" && setFondoCurso(fondoSistemaSanacion);
    categoria === "anexo" && setFondoCurso(fondoAnexo);
  }, [categoria, user]);

  // 1. Verificar si el curso actual es un ANEXO
  // Usamos toLowerCase() para evitar problemas con mayúsculas/minúsculas
  const esAnexo = cursoSeleccionado?.categoria?.toLowerCase().includes("anexo");

  // 2. Verificar si el usuario compró CUALQUIER curso (array mayor a 0)
  const tieneAlgunaCompra = usuarioCursos.length > 0;

  // 3. Verificar si compró ESTE curso específico (lógica original)
  const yaComprado =
    cursoSeleccionado &&
    usuarioCursos.some((e) => e.course?._id === cursoSeleccionado._id);

  return (
    <>
      <main className="bgCourseContainer">
        {fondoCurso && (
          <img
            src={fondoCurso}
            alt="background"
            className="bgCourseImage"
            onLoad={hideLoader}
          />
        )}

        {isVisible && <ModalLogin setIsVisible={setIsVisible} />}

        <div className="dataCoursesContainter">
          <div className="titleSubtitleCoursesContainer">
            <div className="subtitleCoursesContainer">
              <p className="subtitleCourses">Curso Seleccionado</p>
              <p className="subtitleCoursesCategoria">
                {cursoSeleccionado?.categoria}
              </p>
            </div>
            <h1
              className="titleCourses slide-right"
              key={cursoSeleccionado?._id}
            >
              {cursoSeleccionado?.nombre}
            </h1>
          </div>

          <div className="contentVisualContainer">
            <div className="videoTitleContainer">
              <p className="subtitleVideo">{cursoSeleccionado?.descripcion}</p>

              <div className="courseVideointroduccionContainer">
                <iframe
                  className="videoIntroduccion"
                  src={cursoSeleccionado?.videoIntroduccion}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>

              {/* ----------------- LÓGICA MODIFICADA ----------------- */}

              {esAnexo ? (
                // === LÓGICA PARA ANEXOS ===
                tieneAlgunaCompra ? (
                  // Si tiene compras, le damos acceso directo
                  <Link
                    to={`/curso/${cursoSeleccionado._id}`}
                    className="coursePrice"
                  >
                    Ver Anexo
                  </Link>
                ) : (
                  // Si NO tiene compras, mostramos el cartel
                  <div
                    style={{
                      border: "1px solid #ffd700",
                      backgroundColor: "rgba(255, 215, 0, 0.1)",
                      padding: "15px",
                      borderRadius: "8px",
                      textAlign: "center",
                      color: "#fff", // O el color que uses en tu tema
                      marginTop: "10px",
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: "bold" }}>
                      🔒 Con la compra de un curso desbloquearás los anexos
                    </p>
                  </div>
                )
              ) : // === LÓGICA PARA CURSOS NORMALES (Original) ===
                cursoSeleccionado?.tipo === "Gratuito" ? (
                  <Link
                    to={`/curso/${cursoSeleccionado._id}`}
                    className="coursePrice"
                  >
                    Ver curso
                  </Link>
                ) : yaComprado ? (
                  <Link
                    to={`/curso/${cursoSeleccionado._id}`}
                    className="coursePrice"
                  >
                    Ver curso
                  </Link>
                ) : (
                  <p
                    className="coursePrice"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (!user) {
                        setIsVisible(true);
                        return;
                      }
                      navigate(`/payment/${user.id}/${cursoSeleccionado._id}`);
                    }}
                  >
                    COMPRAR ${cursoSeleccionado?.precio} ARS
                  </p>
                )}

              {/* ----------------- FIN LÓGICA MODIFICADA ----------------- */}
            </div>
          </div>
        </div>
        <div className="buttonsCoursesContainer">
          <ButtonsCourses
            cursos={cursos}
            setCursoSeleccionado={setCursoSeleccionado}
          />
        </div>

        <ContactoFlotante />
      </main>
    </>
  );
};

export default Cursos;