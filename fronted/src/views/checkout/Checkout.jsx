import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { pagar } from "../../services/payMercadoPago"; 
import { useAuth } from "../../context/AuthContext"; 
import { useLoading } from "../../context/LoadingContext";
import mpLogo from "../../assets/logos/mercado-pago.png"; 
import PaypalButton from "../../components/PaypalButton";
// 🔥 Importamos el traductor
import { useTranslation } from 'react-i18next';

const urlBackend = import.meta.env.VITE_API_URL_BACKEND;

const Checkout = () => {
    const { t } = useTranslation("global");
    const { cid } = useParams();
    const { user } = useAuth();
    const [curso, setCurso] = useState(null);
    const { hideLoader } = useLoading();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${urlBackend}/courses/detalle/${cid}`) 
            .then((res) => res.json())
            .then((data) => {
                setCurso(data);
                hideLoader();
            })
            .catch((err) => console.error(err));
    }, [cid]);

    const handleMercadoPago = () => {
        if (!user) navigate("/login");
        pagar(user.id, curso);
    };

    return (
        <div className="checkout-container">
            <div className="checkout-bg"></div>
            <div className="checkout-content">
                <Link to="/" className="btn-volver">← {t("checkout.volver")}</Link>

                <h1 className="checkout-title">{t("checkout.finalizar_compra")}</h1>

                <div className="checkout-grid">

                    {/* --- COLUMNA 1: MÉTODOS DE PAGO --- */}
                    <section className="payment-section glass-panel">
                        <h2 className="section-title">{t("checkout.elegir_pago")}</h2>
                        <p className="payment-desc">{t("checkout.seguridad_pago")}</p>

                        <div className="payment-options">
                            {/* Opción Mercado Pago */}
                            <button className="btn-payment mp-btn" onClick={handleMercadoPago}>
                                <img src={mpLogo} alt="Mercado Pago" className="payment-icon" />
                                <span className="payment-label">Mercado Pago</span>
                                <span className="payment-sub">{t("checkout.mp_sub")}</span>
                            </button>

                            <PaypalButton 
                                price={curso?.precio}
                                courseName={t(`cursos_db.${curso?._id}.nombre`, curso?.nombre)}
                                courseId={curso?._id}
                                userId={user?.id} 
                            />
                        </div>

                        <div className="security-note">
                            <small>🔒 {t("checkout.ssl_note")}</small>
                        </div>
                    </section>

                    {/* --- COLUMNA 2: RESUMEN DEL CURSO --- */}
                    <section className="summary-section glass-panel">
                        <div className="course-card-checkout">
                            <span className="category-tag">
                                {t(`navbar.cursos_${curso?.categoria?.replace(/ /g, "_")}`, curso?.categoria)}
                            </span>

                            <h2 className="course-title-pay">
                                {t(`cursos_db.${curso?._id}.nombre`, curso?.nombre)}
                            </h2>

                            <div className="divider"></div>

                            <p className="course-desc">
                                {t(`cursos_db.${curso?._id}.descripcion`, curso?.descripcion)}
                            </p>

                            <div className="price-container">
                                <span className="price-label">{t("checkout.total")}:</span>
                                <span className="price-amount">${curso?.precio} ARS</span>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Checkout;