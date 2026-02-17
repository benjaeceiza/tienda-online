import { Router } from "express";
import { createPreference } from "../payments/mercadopago.js";
import { mpWebhook } from "../controllers/mpWebhoook.controller.js";
import { getPaymentById } from "../services/mercadoPagoPayments.js";
import paypal from '@paypal/checkout-server-sdk';
import { client } from "../payments/paypal.js";
import { usuarioModelo } from "../models/user.model.js";
import { cursoModelo } from "../models/course.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const router = Router();


const urlFrontend = process.env.VITE_API_URL_FRONTEND;

// MERCADO PAGO ROUTES

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
    const url = `${urlFrontend}/pago-exitoso?payment_id=${payment_id || collection_id}`;
    res.redirect(url);
});


router.get("/mp/failure", (req, res) => {
    res.redirect(`${urlFrontend}/pago-fallido`);
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


// PAYPAL ROUTES

router.post('/pp/create-order', async (req, res) => {
    const { courseID } = req.body;

    const COTIZACION_DOLAR = 1300;

    try {
        const course = await cursoModelo.findById(courseID);

        if (!course) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }

        // 2. CONVERSIÓN DE MONEDA
        // Precio en Base de Datos (ARS) / Cotización = Precio en USD
        const precioEnPesos = course.precio;
        let precioEnDolares = precioEnPesos / COTIZACION_DOLAR;

        // 3. FORMATEO (PayPal exige string con 2 decimales, ej: "43.48")
        const precioFinalPayPal = precioEnDolares.toFixed(2);

        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");

        request.requestBody({
            intent: 'CAPTURE',
            // AGREGÁ ESTO:
            application_context: {
                brand_name: "Sanación Cosmotelúrica",
                landing_page: "NO_PREFERENCE",
                user_action: "PAY_NOW",
                return_url: `${urlFrontend}/pago-exitoso`, // Tu URL de frontend
                cancel_url: `${urlFrontend}/pago-fallido`  // Tu URL de frontend
            },
            purchase_units: [{
                description: course.nombre,
                amount: {
                    currency_code: 'USD',
                    value: precioFinalPayPal
                }
            }]
        });

        const order = await client().execute(request);
        res.json({ id: order.result.id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la orden' });
    }
});

// 2. RUTA: CAPTURAR (FINALIZAR) PAGO
router.post('/pp/capture-order', async (req, res) => {
    const { orderID, userID, courseID } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
        const capture = await client().execute(request);

        // Verificamos si PayPal dice que se completó
        if (capture.result.status === 'COMPLETED') {

            const userActualizado = await usuarioModelo.findByIdAndUpdate(
                userID,
                { $push: { courses: { course: courseID } } },
                { new: true });

            const payload = {
                id: userActualizado._id,
                nickname: userActualizado.nombre,
                rol: userActualizado.rol,
                courses: userActualizado.courses
            };

            const tokenNuevo = jwt.sign(
                payload,
                process.env.JWT_SECRET, // Usa tu variable de entorno
                { expiresIn: '24h' }
            );


            console.log(`Pago exitoso para el curso ${courseID}`);

            res.json({
                completed: true,
                message: 'Pago exitoso, curso desbloqueado',
                token: tokenNuevo,
                user: userActualizado
            });

        } else {
            res.json({ completed: false, message: 'El pago no se completó' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al capturar el pago' });
    }
});


router.get('/pp/verify/:orderID', async (req, res) => {
    const { orderID } = req.params;

    const request = new paypal.orders.OrdersGetRequest(orderID);

    try {
        const order = await client().execute(request);

        // PayPal usa 'COMPLETED' o 'APPROVED'
        if (order.result.status === 'COMPLETED' || order.result.status === 'APPROVED') {
            res.json({ status: 'approved', id: order.result.id });
        } else {
            res.json({ status: 'pending', id: order.result.id });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error verificando PayPal' });
    }
});