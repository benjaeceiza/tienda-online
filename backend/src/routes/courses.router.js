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


// trae los cursos por categoria
router.get("/:categoria", async (req, res) => {

    const { categoria } = req.params;
    try {

        const courses = await cursoModelo.find({ categoria: categoria });
        res.status(201).json({ message: "Success", courses });

    } catch (error) {

        res
            .status(500)
            .json({ message: "Error al consultar cursos", error: error.message });
    }
})






// trae un curso en especifico
router.get("/contenido/:cid", async (req, res) => {

    try {
        const { cid } = req.params;
        const authHeader = req.headers.authorization;
        let user = null;


        const course = await cursoModelo.findById(cid);


        if (!course) res.status(404).json({ error: "Curso no encontrado" });

        if (course.tipo === "Gratuito") {
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
        res.status(500).json({ message: "Error al consultar curso", error: error.message });
    }
})

router.get("/categoria/freeCourses", async (req, res) => {
    const tipo = "Gratuito";
    try {
        const courses = await cursoModelo.find({ tipo: tipo });
        res.status(201).json({ message: "Success", courses });
    } catch (error) {
        res.status(500).json({ message: "Error al consultar cursos por categoría", error: error.message });
    }
});



// Ruta PÚBLICA: Trae info básica del curso (nombre, precio, categoria, descripcion)
// No requiere token ni validación de usuario
router.get("/detalle/:cid", async (req, res) => {
    try {
        const { cid } = req.params;

        // .select() es la magia: solo trae los campos que pones dentro.
        // Mongoose siempre trae el _id por defecto (lo cual te sirve para el botón de comprar).
        const course = await cursoModelo.findById(cid)
            .select("nombre precio categoria descripcion");

        if (!course) {
            return res.status(404).json({ error: "Curso no encontrado" });
        }

        // Devolvemos la info pública
        return res.status(200).json(course);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener detalles del curso" });
    }
});
