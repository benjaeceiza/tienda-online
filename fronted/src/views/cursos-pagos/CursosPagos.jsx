import { useEffect, useState } from "react";
import { getPaidCourses } from "../../services/getPaidCourses";
import { useAuth } from "../../context/AuthContext";
import { getUserCourses } from "../../services/getUserCourses";
import ButtonsCourses from "./ButtonsCourses";
import { addCourseToUser } from "../../services/addCourseToUser";
import { Link } from "react-router-dom";
import ContactoFlotante from "../../components/ContactoFlotante";
import ModalLogin from "../../components/ModalLogin";
import { useLoading } from "../../context/LoadingContext";
import { pagar } from "../../services/payMercadoPago";

const CursosPagos = () => {
  const [cursos, setCursos] = useState([]);
  const [usuarioCursos, setUsuarioCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const { user } = useAuth();
  const { hideLoader } = useLoading();

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token");

      getUserCourses(token)
        .then((data) => setUsuarioCursos(data.courses || []))
        .catch((err) => console.error(err));
    }

    getPaidCourses()
      .then((data) => {
        const cursosApi = data.courses || [];
        setCursos(cursosApi);

        if (cursosApi.length > 0) {
          setCursoSeleccionado(cursosApi[0]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const comprarCurso = (idCourse) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsVisible(true);
      return;
    }

    addCourseToUser(idCourse)
      .then((data) => setMensaje(data))
      .catch((Error) => console.log(Error));
  };

  const yaComprado =
    cursoSeleccionado &&
    usuarioCursos.some((e) => e.course._id === cursoSeleccionado._id);

  return (
    <>
      <main className="bgCourseContainer">

        {/* 💙 IMAGEN COMO ELEMENTO REAL DEL DOM */}
        {cursoSeleccionado && (
          <img
            src={cursoSeleccionado.thumbnail}
            alt="background"
            className="bgCourseImage"
            onLoad={hideLoader} // SE OCULTA EL LOADER SOLO CUANDO ESTA IMAGEN CARGA
          />
        )}

        {isVisible && <ModalLogin setIsVisible={setIsVisible} />}

        <div className="dataCoursesContainter">
          <div className="titleSubtitleCoursesContainer">
            <p className="subtitleCourses">Curso Seleccionado</p>
            <h1 className="titleCourses">{cursoSeleccionado?.nombre}</h1>
          </div>

          <div className="contentVisualContainer">
            <div className="videoTitleContainer">
              <h3 className="titleVideo">title</h3>
              <p className="subtitleVideo">{cursoSeleccionado?.descripcion}</p>

              <div className="courseVideo"></div>

              {yaComprado ? (
                <Link
                  to={`/curso/${cursoSeleccionado._id}`}
                  className="coursePrice"
                >
                  Ver curso
                </Link>
              ) : (
                <p
                  className="coursePrice"
                  style={{ cursor: "pointer" }} // Agregale esto para que parezca botón
                  onClick={() => {
                    // 1. Validamos si el usuario existe
                    if (!user) {
                      setIsVisible(true); // Si no está logueado, abrimos el modal de Login
                      return;
                    }

                    // 2. Si está logueado, procedemos al pago
                    // IMPORTANTE: Pasale 'cursoSeleccionado' entero, no solo el ID,  
                    // así la función pagar puede sacar el precio y el título.
                    pagar(user.id, cursoSeleccionado);
                  }}
                >
                  COMPRAR ${cursoSeleccionado?.precio} ARS
                </p>
              )}
            </div>
          </div>

          <div className="buttonsCoursesContainer">
            <ButtonsCourses
              cursos={cursos}
              setCursoSeleccionado={setCursoSeleccionado}
            />
          </div>
        </div>

        <ContactoFlotante />
      </main>
    </>
  );
};

export default CursosPagos;
