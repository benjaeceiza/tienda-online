
export const addCourseToUser = async (idCourse) => {
    const token = localStorage.getItem("token")

    if (!token) {
        throw new Error("Inicia sesión o regístrate.");
    }

    const API_URL = "http://localhost:8080/api";
    try {
        const res = await fetch(`${API_URL}/payments/${idCourse}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            // Intentamos sacar el mensaje exacto que mandó el Backend (si existe)
            const errorData = await res.json().catch(() => null);
            const mensajeError = errorData?.message || "No se pudo completar la compra.";

            // ¡Lanzamos el error para que caiga en el catch del componente!
            throw new Error(mensajeError);
        }

        // 3. Éxito: Devolvemos la respuesta parseada o simplemente true
        return await res.json();

    } catch (error) {
        // Si es un error que lanzamos nosotros arriba (throw), lo dejamos pasar.
        // Si es un error de red (fetch falló), lo capturamos aquí.
        throw error;
    }

}