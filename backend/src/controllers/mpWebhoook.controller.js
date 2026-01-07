
 import { getPaymentById, desbloquearCurso } from "../services/mercadoPagoPayments.js";
export const mpWebhook = async (req, res) => {
  console.log("🔥 WEBHOOK LLAMADO");
  console.log("QUERY:", req.query);
  console.log("BODY:", req.body);

  try {
    // 1. Validar si es un pago
    const topic = req.query.topic || req.query.type;
    if (req.body.type !== "payment" && topic !== "payment") {
        // Si no es pago, respondemos OK y salimos para no dar error
        return res.status(200).send("No es payment"); 
    }

    // 2. Extraer ID
    const paymentId = req.body.data?.id || req.body.id || req.query.id;
    console.log("🆔 PAYMENT ID:", paymentId);

    if (!paymentId) {
        console.error("❌ NO SE ENCONTRÓ ID EN EL WEBHOOK");
        return res.sendStatus(200); // Respondemos 200 igual para que MP no joda
    }

    // 3. Consultar a Mercado Pago
    console.log("⏳ CONSULTANDO API DE MP...");
    const paymentMP = await getPaymentById(paymentId);
    console.log("✅ RESPUESTA MP STATUS:", paymentMP.status);

    if (paymentMP.status === "approved") {
        // 4. Extraer datos (CUIDADO CON EL SNAKE_CASE)
        // Usamos ?. para que no explote si es null
        const cursoId = paymentMP.metadata?.curso_id; 
        const userId = paymentMP.external_reference;

        console.log(`👤 USER: ${userId} | 📚 CURSO: ${cursoId}`);

        if (cursoId && userId) {
            await desbloquearCurso({ paymentId, userId, cursoId });
            console.log("🏆 CURSO DESBLOQUEADO OK");
        } else {
            console.error("⚠️ FALTAN DATOS EN METADATA O EXT_REF");
        }
    }

    res.sendStatus(200);

  } catch (error) {
    // ESTO ES LO QUE TE DA EL ERROR 500
    console.error("❌ ERROR FATAL EN WEBHOOK:", error);
    // IMPORTANTE: Respondemos 200 o 500. 
    // Si respondemos 500, MP va a reintentar. 
    // Por ahora respondamos 200 para que deje de spamear mientras arreglás.
    res.status(200).json({ error: error.message });
  }
};