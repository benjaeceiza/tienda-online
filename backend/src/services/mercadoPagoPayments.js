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
    const pagoExistente = await paymentModel.findOne({ paymentId });

    if (pagoExistente) {
      console.log("⚠️ El pago ya estaba registrado, no hacemos nada.");
      return;
    }

    // B. GUARDAR EL PAGO: Historial de transacciones de MP
    const nuevoPago = await paymentModel.create({
      paymentId,
      status: "approved",
      userId,
      cursoId
    });
    console.log("💾 Pago guardado en DB:", nuevoPago._id);

    // C. ACTUALIZAR AL USUARIO: Le agregamos el curso y el RECIBO COMPLETO
    // Usamos findOneAndUpdate buscando al usuario, PERO con la condición $ne (Not Equal).
    // Esto significa: "Encontrá a este usuario SOLO SI dentro de sus cursos NO está este cursoId".
    const resultado = await usuarioModelo.findOneAndUpdate(
      { 
        _id: userId, 
        "courses.course": { $ne: cursoId } // Evita duplicados a nivel lógico
      },
      {
        $push: {
          courses: { 
            course: cursoId,
            fechaCompra: new Date(),
            metodoPago: "Mercado Pago",
            idTransaccion: paymentId.toString()
          }
        }
      },
      { new: true } // Para que devuelva el documento actualizado
    );

    if (resultado) {
      console.log(`🔓 Curso ${cursoId} desbloqueado exitosamente para el usuario con su recibo.`);
    } else {
      console.log("ℹ️ El usuario ya tenía este curso. Se registró el pago pero no se duplicó el acceso.");
    }

  } catch (error) {
    console.error("❌ Error en desbloquearCurso service:", error);
    throw error;
  }
};