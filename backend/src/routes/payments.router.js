import { Router } from "express";
import { cursoModelo } from "../models/course.model.js";
import { authMiddleware } from "../middleware/auth.js";
import { usuarioModelo } from "../models/user.model.js";
import { createPreference } from "../payments/mercadopago.js";
import { mpWebhook } from "../controllers/mpWebhoook.controller.js";
import { getPaymentById } from "../services/mercadoPagoPayments.js";


export const router = Router();

// Agregar al usuario logueado un curso
router.patch("/:courseId", authMiddleware, async (req, res) => {

    try {

        const { courseId } = req.params;
        const userId = req.user.id;

        const course = await cursoModelo.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }


        const user = await usuarioModelo.findById(userId);
        user.courses.push({ course: courseId });

        await user.save();

        res.status(200).json({ message: "Curso agregado correctamente", user });

    } catch (error) {

        res.status(500).json({ message: "Error al agregar curso", error: error.message });
    }


})


// Ruta para crear la preferencia de pago
router.post("/mp/create-preference", async (req, res) => {
    try {
        // 1. Recibimos los datos que vienen del Frontend
        const { title, price, cursoId, userId } = req.body;

        // Validamos que llegue todo
        if (!title || !price || !cursoId || !userId) {
            return res.status(400).json({ error: "Faltan datos del curso o usuario" });
        }

        console.log("🔥 CREANDO PREFERENCIA PARA:", title);

        // 2. Le pasamos los datos a la función createPreference
        // IMPORTANTE: Ahora guardamos todo el objeto en 'preference' (no solo el ID)
        const preference = await createPreference(userId, cursoId, title, price);

        console.log("🔥 PREFERENCE CREADA:", preference);

        // 3. Devolvemos la URL al frontend
        // Si tu servicio devuelve { id: "...", url: "..." }, acá accedemos a .url
        res.json({
            url: preference.url, 
        });

    } catch (error) {
        console.error("ERROR MP:", error);
        res.status(500).json({
            error: error.message,
        });
    }
});




router.post("/mp/webhook", mpWebhook);


router.get("/mp/success", (req, res) => {
    const { payment_id, collection_id } = req.query;

    // redirigir al frontend con los params
    const url = `http://localhost:5173/pago-exitoso?payment_id=${payment_id || collection_id}`;
    res.redirect(url);
});


router.get("/mp/failure", (req, res) => {
    res.redirect("http://localhost:5173/pago-fallido");
});


router.get("/mp/verify/:paymentId", async (req, res) => {
    const { paymentId } = req.params;

    if (!paymentId || paymentId === "null") {
        return res.status(400).json({ status: "invalid" });
    }

    try {
        const payment = await getPaymentById(paymentId);
        res.json({ status: payment.status });
    } catch {
        res.status(400).json({ status: "error" });
    }
});


