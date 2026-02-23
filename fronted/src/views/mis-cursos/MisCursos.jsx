import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCompass } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { getUserCourses } from "../../services/getUserCourses";
import CardCourse from "./CardCourse";
import { useLoading } from "../../context/LoadingContext";
import FondoMisCursos from "./FondoMisCursos";
// 🔥 Importamos el traductor
import { useTranslation } from 'react-i18next';

const MisCursos = () => {
    const { t } = useTranslation("global");
    const { user } = useAuth();
    const [cursos, setCursos] = useState([]);
    const { hideLoader } = useLoading();
    
    const [dataReady, setDataReady] = useState(false);
    const [imgReady, setImgReady] = useState(false);

    useEffect(() => {
        if (!user) return;
        const token = localStorage.getItem("token");

        getUserCourses(token)
            .then(data => {
                setCursos(data.courses || []);
            })
            .catch(err => console.error(err))
            .finally(() => {
                setDataReady(true);
            });

    }, [user]);

    useEffect(() => {
        if (dataReady && imgReady ) {
            hideLoader();
        }
    }, [dataReady, imgReady, hideLoader]);

    return (
        <main className="mis-cursos-layout">
            <FondoMisCursos onImageLoad={() => setImgReady(true)} />

            <div className="mis-cursos-container">
                {cursos.length > 0 ? (
                    <>
                        <div className="header-mis-cursos">
                            {/* 🔥 Traducciones de cabecera */}
                            <h1>{t("mis_cursos.titulo")}</h1>
                            <p>{t("mis_cursos.subtitulo")}</p>
                            <div className="divider-glow"></div>
                        </div>

                        <section className="grid-cursos">
                            <CardCourse cursos={cursos} />
                        </section>
                    </>
                ) : (
                    <div className="mis-cursos-empty-state">
                        <div className="mis-cursos-empty-card">
                            <div className="mis-cursos-empty-icon-wrapper">
                                <FaCompass className="mis-cursos-empty-icon" />
                            </div>
                            {/* 🔥 Traducciones de estado vacío */}
                            <h2 className="mis-cursos-empty-title">{t("mis_cursos.vacio_titulo")}</h2>
                            <p className="mis-cursos-empty-text">
                                {t("mis_cursos.vacio_texto")}
                            </p>
                            <Link to="/" className="mis-cursos-btn-explorar">
                                {t("mis_cursos.btn_volver")}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default MisCursos;