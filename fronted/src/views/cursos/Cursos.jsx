import { useEffect, useState } from "react";
import { getPaidCourses } from "../../services/getPaidCourses";
import { useAuth } from "../../context/AuthContext";
import { getUserCourses } from "../../services/getUserCourses";
import ButtonsCourses from "./ButtonsCourses";
import { Link, useNavigate, useParams } from "react-router-dom";
import ContactoFlotante from "../../components/ContactoFlotante";
import ModalLogin from "../../components/ModalLogin";
import { useLoading } from "../../context/LoadingContext";
import { pagar } from "../../services/payMercadoPago";

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

  }, [categoria]);


  
  

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
              <p className="subtitleCoursesCategoria">{cursoSeleccionado?.categoria}</p>
            </div>
            <h1 className="titleCourses">{cursoSeleccionado?.nombre}</h1>
          </div>

          <div className="contentVisualContainer">
            <div className="videoTitleContainer">

              <p className="subtitleVideo">{cursoSeleccionado?.descripcion}</p>

              <div className="courseVideointroduccionContainer"><iframe className="videoIntroduccion" src={cursoSeleccionado?.videoIntroduccion} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe></div>



              {
                //pregunta si es gratuito o pago
                cursoSeleccionado?.tipo === "Gratuito" ?
                  <Link
                    to={`/curso/${cursoSeleccionado._id}`}
                    className="coursePrice"
                  >
                    Ver curso
                  </Link>
                  :
                  yaComprado ? (
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

                        navigate(`/payment/${user.id}/${cursoSeleccionado._id}`);
                      }}
                    >
                      COMPRAR ${cursoSeleccionado?.precio} ARS
                    </p>
                  )}



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
