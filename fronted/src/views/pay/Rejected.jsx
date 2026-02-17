import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext";

const Rejected = () => {
    const { hideLoader } = useLoading();
    const navigate = useNavigate();

    useEffect(() => {
        // Ocultamos el loader apenas monta el componente
        hideLoader();
    }, [hideLoader]);

    return (
        <main className="page-rejected-main">
            
            {/* Fondo decorativo místico pero un poco más "apagado" */}
            <div className="page-rejected-bg-glow"></div>

            <div className="page-rejected-card glass-optimized">
                
                {/* Ícono de bloqueo/rechazo */}
                <div className="page-rejected-icon-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="page-rejected-icon">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                    </svg>
                </div>

                <h1 className="page-rejected-title">El pago no pudo completarse</h1>
                
                <div className="page-rejected-divider"></div>

                <p className="page-rejected-text">
                    Hubo un inconveniente al procesar tu pago y la transacción ha sido rechazada.
                </p>
                <p className="page-rejected-text-small">
                    Esto puede deberse a fondos insuficientes, un bloqueo de seguridad de tu banco o un error temporal en la plataforma de pagos.
                </p>

                <div className="page-rejected-actions">
                    {/* Botón Principal: Intentar de nuevo (vuelve atrás) */}
                    <button onClick={() => navigate(-1)} className="page-rejected-btn-primary">
                        Intentar nuevamente
                    </button>

                    {/* Botón Secundario: Ir a contacto */}
                    <Link to="/" className="page-rejected-btn-secondary">
                       Volver al inicio
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default Rejected;