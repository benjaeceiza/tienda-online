
const API_URL = import.meta.env.VITE_API_URL_BACKEND;

export const userRegister = async (nombre, apellido, email, password) => {

  
  const data = { nombre, apellido, email, password };

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      // 🔥 Guardar token si lo devuelve
      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      // 🔥 Devuelve un mensaje de éxito
      return {token: result.token};
    } else {
      // ❌ Mensaje de error del backend
      return `❌ Error: ${result.message || "No se pudo registrar el usuario"}`;
    }
  } catch (err) {
    // 🚨 Error de conexión o servidor caído
    return "❌ Error de conexión con el servidor";
  }
};
