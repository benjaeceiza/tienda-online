const API_URL = "http://localhost:8080/api";

export const getCourse = async (cid) => {
  const token = localStorage.getItem("token");


  try {
    const res = await fetch(`${API_URL}/courses/contenido/${cid}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();

      if (res.status === 401) throw new Error("Debes iniciar sesión para ver este curso.");
      if (res.status === 403) throw new Error("No tenés acceso a este curso.");
      throw new Error(errorData.message || `Error ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error al obtener el curso:", error);
    throw error;
  }
};