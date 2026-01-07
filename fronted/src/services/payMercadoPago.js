// 1. La función pagar ahora recibe el objeto CURSO entero (o los datos separados)
export const pagar = async (userId, curso) => {
  try {
    const res = await fetch("http://localhost:8080/api/payments/mp/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        cursoId: curso._id,
        // 🔥 AGREGAMOS ESTOS DOS DATOS QUE FALTABAN:
        title: curso.nombre || "Curso sin nombre", // Ajustá "nombre" a como se llame en tu BD
        price: curso.precio
      }),
    });

    const data = await res.json();
    console.log("🔥 DATA FRONT:", data);

    if (!data.url) {
      console.error("Error: El backend no devolvió la URL", data);
      alert("Error al generar el pago. Revisá la consola.");
      return;
    }

    // Redirección directa a Mercado Pago
    window.location.href = data.url;
    
  } catch (error) {
    console.error("Error en el fetch:", error);
  }
};