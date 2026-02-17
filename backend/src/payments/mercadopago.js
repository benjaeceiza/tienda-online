import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from "dotenv";
dotenv.config();

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// TU URL DE NGROK (La copié de tu mensaje anterior)
const  urlPublic= process.env.VITE_MP_URL; // Asegúrate de que esta variable esté en tu .env

export const createPreference = async (userId, cursoId, title, price) => {
  try {
    const preference = new Preference(client);

    // Creamos la preferencia
    const result = await preference.create({
      body: {
        items: [
          {
            id: cursoId,
            title: title,
            quantity: 1,
            unit_price: Number(price), 
            currency_id: "ARS",
          },
        ],
        // --- AQUÍ ESTABA EL ERROR ---
        // Usamos tu Backend (Ngrok) como punto de retorno.
        // Esto activará tus rutas router.get("/mp/success"...) que ya programaste.
        back_urls: {
          success: `${urlPublic}/api/payments/mp/success`,
          failure: `${urlPublic}/api/payments/mp/failure`,
          pending: `${urlPublic}/api/payments/mp/pending`,
        },
        auto_return: "approved",
        // -----------------------------

        notification_url: `${urlPublic}/api/payments/mp/webhook`,
        
        external_reference: userId,
        metadata: {
          curso_id: cursoId,
        },
      },
    });

    return {
      id: result.id,
      url: result.init_point,
    };

  } catch (error) {
    console.error("❌ ERROR AL CREAR PREFERENCIA:", error);
    throw error;
  }
};