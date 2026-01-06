import { Router } from "express";
import { cursoModelo } from "../models/course.model.js";
import { authMiddleware } from "../middleware/auth.js";
import { usuarioModelo } from "../models/user.model.js";
import { processPayment } from "../controller/payment.controller.js";

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


router.post("/process_payment", processPayment);
