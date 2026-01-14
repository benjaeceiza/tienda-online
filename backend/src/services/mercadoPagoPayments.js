import { MercadoPagoConfig, Payment } from "mercadopago";
import { paymentModel } from "../models/payment.model.js"; // Importá tu modelo de pagos
import { usuarioModelo } from "../models/user.model.js"; // Importá tu modelo de Usuarios (ajustá la ruta)

// Configuración del cliente (asegurate de tener esto o importarlo)
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// 1. Función para consultar el estado del pago a la API de MP
export const getPaymentById = async (id) => {
  const payment = new Payment(client);
  return await payment.get({ id });
};

// 2. Función que guarda en BD y desbloquea el curso
export const desbloquearCurso = async ({ paymentId, userId, cursoId }) => {
  try {
    // A. IDEMPOTENCIA: Chequeamos si este pago ya lo guardamos antes.
    // Mercado Pago a veces manda el mismo webhook 2 o 3 veces.
    const pagoExistente = await paymentModel.findOne({ paymentId });

    if (pagoExistente) {
      console.log("⚠️ El pago ya estaba registrado, no hacemos nada.");
      return;
    }

    // B. GUARDAR EL PAGO: Usamos el modelo que corregimos antes
    const nuevoPago = await paymentModel.create({
      paymentId,
      status: "approved",
      userId,
      cursoId
    });
    console.log("💾 Pago guardado en DB:", nuevoPago._id);

    // C. ACTUALIZAR AL USUARIO: Le agregamos el curso a su lista
    // Asumo que tu modelo de User tiene un array "courses" o "cursosComprados"
    // Usamos $addToSet para que no se duplique si ya lo tenía.
    await usuarioModelo.findByIdAndUpdate(userId, {
      $addToSet: {
        courses: { course: cursoId }
      }

      
    });



    console.log("🔓 Curso desbloqueado exitosamente para el usuario.");

  } catch (error) {
    console.error("❌ Error en desbloquearCurso service:", error);
    throw error;
  }
};