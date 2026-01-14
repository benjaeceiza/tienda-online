import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLoading } from "../../context/LoadingContext";

export const Approved = () => {
    const [params] = useSearchParams();
    
    // Obtenemos el ID de pago de la URL
    const paymentId = params.get("payment_id") || params.get("collection_id");

    const [status, setStatus] = useState("pending");
    const { hideLoader } = useLoading();

    useEffect(() => {
        hideLoader();

        if (!paymentId) return;

        const checkAndRefreshToken = async () => {
            try {
                // 1. VERIFICAR EL PAGO EN MERCADO PAGO
                const res = await fetch("http://localhost:8080/api/payments/mp/verify/" + paymentId);
                const data = await res.json();

                // 2. SI EL PAGO ESTÁ APROBADO -> ACTUALIZAMOS EL TOKEN
                if (data.status === "approved") {
                    console.log("Pago aprobado, actualizando permisos del usuario...");
                    
                    const tokenActual = localStorage.getItem("token");
                    
                    // Llamada al endpoint de Refresh Token que creamos en el backend
                    const resRefresh = await fetch("http://localhost:8080/api/auth/refresh-token", {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${tokenActual}`,
                            "Content-Type": "application/json"
                        }
                    });

                    const dataRefresh = await resRefresh.json();

                    if (resRefresh.ok && dataRefresh.token) {
                        // ¡AQUÍ OCURRE LA MAGIA! 🪄
                        // Reemplazamos el token viejo por el nuevo que tiene el curso
                        localStorage.setItem("token", dataRefresh.token);
                        console.log("✅ Token actualizado con éxito.");
                    } else {
                        console.warn("⚠️ No se pudo actualizar el token automáticamente.");
                    }
                }

                // 3. ACTUALIZAR EL ESTADO VISUAL
                setStatus(data.status);

            } catch (error) {
                console.error("Error verificando pago:", error);
                setStatus("error");
            }
        };

        checkAndRefreshToken();
    }, [paymentId, hideLoader]);

    // --- RENDERIZADO ---

    if (!paymentId) {
        return (
            <div className="messagePayContainer">
                <h1>⏳ Esperando información del pago...</h1>
            </div>
        );
    }

    if (status === "approved") {
        return (
            <div className="messagePayContainer">
                <h1>✅ Pago aprobado, curso habilitado</h1>
                <p style={{marginBottom: "20px"}}>Tus permisos se han actualizado correctamente.</p>
                
                {/* Ahora este botón llevará a mis-cursos y el token YA funcionará */}
                <Link to={"/mis-cursos"} className="btn btnCheckout">
                    Ir a mis cursos
                </Link>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="messagePayContainer">
                <h1>❌ Hubo un error verificando el pago</h1>
                <p>Por favor, contáctanos si se descontó el dinero.</p>
            </div>
        );
    }

    return (
        <div className="messagePayContainer">
            <h1>⏳ Validando pago y actualizando cuenta...</h1>
        </div>
    );
}

export default Approved;