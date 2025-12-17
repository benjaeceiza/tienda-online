import { Router } from "express";
import { cursoModelo } from "../models/course.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { usuarioModelo } from "../models/user.model.js";
dotenv.config();


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

    try {
        const { cid } = req.params;
        const authHeader = req.headers.authorization;
        let user = null;

        const course = await cursoModelo.findById(cid);
        if (!course) res.status(404).json({ error: "Curso no encontrado" });

        if (course.tipo === "gratuito") {
            return res.status(201).json(course);
        }



        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            user = await usuarioModelo.findById(decoded.id).populate("courses.course");
        } catch (err) {
            return res.status(401).json({ message: "Token inválido o expirado" });
        }

        //  Verificamos que el usuario tenga el curso
        const hasCourse = user.courses.some(c => c.course._id.toString() === cid);
        if (!hasCourse) {
            return res.status(403).json({ message: "No tenés acceso a este curso" });
        }

        //  Si todo bien, devolvemos el curso
        res.status(201).json(course);




    } catch (error) {
        res.status(500).json({ message: "Error al consultar cursos", error: error.message });
    }
})


