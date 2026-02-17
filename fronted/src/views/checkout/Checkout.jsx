import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { pagar } from "../../services/payMercadoPago"; // Tu servicio existente
import { useAuth } from "../../context/AuthContext"; // Para saber quién paga
import { useLoading } from "../../context/LoadingContext";
import mpLogo from "../../assets/logos/mercado-pago.png"; // Asegurate de tener logos si querés, sino usa texto
import PaypalButton from "../../components/PaypalButton";

const urlBackend = import.meta.env.VITE_API_URL_BACKEND; // Tu URL del backend

const Checkout = () => {
    const { cid } = useParams();
    const { user } = useAuth();
    const [curso, setCurso] = useState(null);
    const { hideLoader } = useLoading();
    const navigate = useNavigate();

    // 1. Traemos la data del curso con tu NUEVA RUTA pública
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
                <Link to="/" className="btn-volver">← Volver al inicio</Link>

                <h1 className="checkout-title">Finalizar Compra</h1>

                <div className="checkout-grid">

                    {/* --- COLUMNA 1: MÉTODOS DE PAGO --- */}
                    <section className="payment-section glass-panel">
                        <h2 className="section-title">Elige cómo pagar</h2>
                        <p className="payment-desc">Transacciones seguras y encriptadas.</p>

                        <div className="payment-options">
                            {/* Opción Mercado Pago */}
                            <button className="btn-payment mp-btn" onClick={handleMercadoPago}>
                                <img src={mpLogo} alt="Mercado Pago" className="payment-icon" />
                                <span className="payment-label">Mercado Pago</span>
                                <span className="payment-sub">Tarjetas, Débito, Efectivo</span>
                            </button>

                            <PaypalButton price={curso?.precio}
                                courseName={curso?.nombre}
                                courseId={curso?._id}
                                userId={user?.id} />
                        </div>

                        <div className="security-note">
                            <small>🔒 Tus datos están protegidos con SSL.</small>
                        </div>
                    </section>

                    {/* --- COLUMNA 2: RESUMEN DEL CURSO (CARD) --- */}
                    <section className="summary-section glass-panel">
                        <div className="course-card-checkout">
                            <span className="category-tag">{curso?.categoria}</span>

                            <h2 className="course-title-pay">{curso?.nombre}</h2>

                            <div className="divider"></div>

                            <p className="course-desc">{curso?.descripcion}</p>

                            <div className="price-container">
                                <span className="price-label">Total a pagar:</span>
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