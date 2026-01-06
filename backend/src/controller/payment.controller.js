import { Payment } from "mercadopago";
import {mpClient} from "../config/mercadopago.js"

export const processPayment = async (req, res) => {
  try {
    const payment = new Payment(mpClient);

    const result = await payment.create({
      body: req.body
    });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error("Error MercadoPago:", error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
