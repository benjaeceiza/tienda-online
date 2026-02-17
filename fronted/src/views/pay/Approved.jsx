import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext";

const urlBackend = import.meta.env.VITE_API_URL_BACKEND; // Tu URL del backend

export const Approved = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { hideLoader } = useLoading();

    // 1. OBTENER DATOS DE LA URL
    // payment_id (MP) o orderID (PayPal)
    const paymentId = params.get("payment_id") || params.get("collection_id");
    // provider: "paypal" o undefined (asumimos mercadopago)
    const provider = params.get("provider") || "mercadopago";

    const [status, setStatus] = useState("pending"); // pending | approved | error
    const [courseId, setCourseId] = useState(null); // Para redirigir al curso específico

    useEffect(() => {
        hideLoader();

        // Si no hay ID en la url, redirigimos al home o mostramos error
        if (!paymentId) {
            console.warn("No se encontró ID de pago");
            return;
        }

        const verifyPayment = async () => {
            try {
                let urlVerification = "";

                // 2. SELECCIONAR LA URL DEL BACKEND SEGÚN EL PROVEEDOR
                if (provider === "paypal") {
                    // Asegurate de haber creado esta ruta en tu backend como te pasé antes
                    urlVerification = `${urlBackend}/payments/pp/verify/${paymentId}`;
                } else {
                    // Mercado Pago
                    urlVerification = `${urlBackend}/payments/mp/verify/${paymentId}`;
                }

                console.log(`Verificando pago con ${provider}...`);

                // 3. CONSULTAR AL BACKEND
                const res = await fetch(urlVerification);
                const data = await res.json();

                if (data.status === "approved" || data.status === "COMPLETED") {
                    setStatus("approved");
                    
                    // Si el backend te devuelve el ID del curso, lo guardamos
                    if (data.courseId) setCourseId(data.courseId);

                    // 4. ACTUALIZAR TOKEN (Permisos)
                    // Hacemos esto para asegurar que el usuario tenga el curso habilitado en su sesión actual
                    const tokenActual = localStorage.getItem("token");
                    if (tokenActual) {
                        try {
                            const resRefresh = await fetch(`${urlBackend}/auth/refresh-token`, {
                                method: "GET",
                                headers: {
                                    "Authorization": `Bearer ${tokenActual}`,
                                    "Content-Type": "application/json"
                                }
                            });
                            
                            if (resRefresh.ok) {
                                const dataRefresh = await resRefresh.json();
                                if (dataRefresh.token) {
                                    localStorage.setItem("token", dataRefresh.token);
                                    console.log("✅ Token actualizado con éxito.");
                                }
                            }
                        } catch (errToken) {
                            console.warn("No se pudo refrescar el token autom, pero el pago entró.", errToken);
                        }
                    }

                } else {
                    console.error("El pago no está aprobado:", data);
                    setStatus("error");
                }

            } catch (error) {
                console.error("Error de conexión verificando pago:", error);
                setStatus("error");
            }
        };

        verifyPayment();

    }, [paymentId, provider, hideLoader]);


    // --- RENDERIZADO VISUAL ---

    // 1. ESTADO DE CARGA / ESPERA
    if (status === "pending") {
        return (
            <main className="page-approved-main">
                <div className="page-approved-bg-glow"></div>
                <div className="page-approved-card glass-optimized">
                    <div className="spinner-course" style={{ margin: "0 auto 20px auto" }}></div>
                    <h2 className="page-approved-title">Validando Pago...</h2>
                    <p className="page-approved-text">
                        Estamos confirmando la transacción con {provider === "paypal" ? "PayPal" : "Mercado Pago"}.<br/>
                        Por favor espera un momento.
                    </p>
                </div>
            </main>
        );
    }

    // 2. ESTADO APROBADO (ÉXITO)
    if (status === "approved") {
        return (
            <main className="page-approved-main">
                {/* Fondo de luz divina */}
                <div className="page-approved-bg-glow"></div>

                <div className="page-approved-card glass-optimized">
                    
                    {/* Ícono de Check Verde */}
                    <div className="page-approved-icon-container">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="page-approved-icon">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                    </div>

                    <h1 className="page-approved-title">¡Pago Exitoso!</h1>
                    <div className="page-approved-divider"></div>
                    
                    <p className="page-approved-text">
                        Tu compra se procesó correctamente y el contenido ya está habilitado en tu cuenta.
                        <br />
                        ¡Bienvenido/a!
                    </p>

                    <div className="page-approved-actions">
                        {/* BOTÓN PRINCIPAL: Va al curso si tenemos ID, sino a Mis Cursos */}
                        <Link 
                            to={courseId ? `/curso/${courseId}` : "/mis-cursos"} 
                            className="page-approved-btn-primary"
                        >
                            {courseId ? "Comenzar el Curso" : "Ir a Mis Cursos"}
                        </Link>

                        <Link to="/" className="page-approved-btn-secondary">
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // 3. ESTADO ERROR (FALLÓ VERIFICACIÓN)
    return (
        <main className="page-approved-main">
            <div className="page-approved-bg-glow" style={{background: 'radial-gradient(circle, rgba(239, 83, 80, 0.2) 0%, rgba(255, 255, 255, 0) 60%)'}}></div>
            <div className="page-approved-card glass-optimized">
                <div className="page-approved-icon-container error-mode">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="page-approved-icon error-icon">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                    </svg>
                </div>
                <h2 className="page-approved-title">Hubo un problema</h2>
                <p className="page-approved-text">
                    El pago parece haber entrado, pero no pudimos verificarlo automáticamente.
                </p>
                <Link to="/contacto" className="page-approved-btn-primary error-btn">
                    Contactar Soporte
                </Link>
                <Link to="/" className="page-approved-link-home">
                    Volver al inicio
                </Link>
            </div>
        </main>
    );
};

export default Approved;