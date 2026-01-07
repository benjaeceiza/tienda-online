import { MercadoPagoConfig, Preference } from "mercadopago";

// Inicializamos el cliente una sola vez
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// AHORA RECIBIMOS TITULO Y PRECIO COMO PARAMETROS
export const createPreference = async (userId, cursoId, title, price) => {
  try {
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: cursoId, // Es buena práctica poner el ID acá también
            title: title, // Título dinámico
            quantity: 1,
            unit_price: Number(price), // Aseguramos que sea número
            currency_id: "ARS",
          },
        ],
        // A dónde vuelve el usuario en el navegador
        back_urls: {
          success: "https://uninterlinked-unmocked-jannie.ngrok-free.dev/api/payments/mp/success",
          failure: "https://uninterlinked-unmocked-jannie.ngrok-free.dev/api/payments/mp/failure",
          pending: "https://uninterlinked-unmocked-jannie.ngrok-free.dev/api/payments/mp/pending",
        },
        auto_return: "approved",

       
        // Acá MP le avisa a tu servidor "che, pagaron". 
        // Es la misma URL de ngrok pero apuntando a tu ruta de webhook.
  
        notification_url: "https://uninterlinked-unmocked-jannie.ngrok-free.dev/api/payments/mp/webhook",

        external_reference: userId,
        metadata: {
          curso_id: cursoId, // MP a veces pasa todo a snake_case, ojo con eso.
        },
      },
    });

    // Solo necesitamos devolver el ID de la preferencia para el frontend
    return {
      id: result.id,
      url: result.init_point // <--- ESTO es lo que necesita tu window.location.href
    };

  } catch (error) {
    console.error("Error al crear la preferencia de MP:", error);
    throw error; // Re-lanzamos el error para manejarlo en el controller
  }
};