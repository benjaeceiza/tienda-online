import { Router } from "express";
import { cursoModelo } from "../models/course.model.js";

export const router = Router();



// trae todos los cursos
router.get("/", async (req, res) => {
    try {

        const courses = await cursoModelo.find();
        res.status(201).json({ message: "Success", courses });

    } catch (error) {

        res
            .status(500)
            .json({ message: "Error al consultar cursos", error: error.message });
    }
})


// trae todos los cursos gratuitos
router.get("/free", async (req, res) => {
    try {
        const courses = await cursoModelo.find({ tipo: "Gratuito" });
        res.status(201).json({ message: "Success", courses });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error al consultar cursos", error: error.message });
    }
});


// trae todo los cursos pagos
router.get("/paid", async (req, res) => {
    try {
        const courses = await cursoModelo.find({ tipo: "Pago" });
        res.status(201).json({ message: "Success", courses });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error al consultar cursos", error: error.message });
    }
});



// trae un curso en especifico
router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
   
    try {
        const course = await cursoModelo.findById( cid );

        if (!course) res.status(404).json({error:"Curso no encontrado"})

        res.status(201).json({ message: "Detalle del curso: ", course });

    } catch (error) {
        res.status(500).json({ message: "Error al consultar cursos", error: error.message });
    }
})


