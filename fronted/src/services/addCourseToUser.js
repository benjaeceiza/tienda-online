const urlBackend = import.meta.env.VITE_API_URL_BACKEND;

// 🔥 Le agregamos metodoPago e idTransaccion como parámetros
export const addCourseToUser = async (idCourse, metodoPago = "Manual", idTransaccion = "N/A") => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Inicia sesión o regístrate.");
    }

    const API_URL = `${urlBackend}/api`;
    try {
        const res = await fetch(`${API_URL}/payments/${idCourse}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            // 🔥 Mandamos los datos al backend
            body: JSON.stringify({
                metodoPago: metodoPago,
                idTransaccion: idTransaccion
            })
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            const mensajeError = errorData?.message || "No se pudo completar la compra.";
            throw new Error(mensajeError);
        }

        return await res.json();

    } catch (error) {
        throw error;
    }
}