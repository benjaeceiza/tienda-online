import { cursoModelo } from "../models/course.model.js";
import { usuarioModelo } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();




export const obtenedorTodosLosCursos = async (req, res) => {
    try {

        const courses = await cursoModelo.find();
        res.status(201).json({ message: "Success", courses });

    } catch (error) {

        res
            .status(500)
            .json({ message: "Error al consultar cursos", error: error.message });
    }
}


export const obtenerCursosPorCategoria = async (req, res) => {
    const { categoria } = req.params;
    try {

        const courses = await cursoModelo.find({ categoria: categoria });
        res.status(201).json({ message: "Success", courses });

    } catch (error) {

        res
            .status(500)
            .json({ message: "Error al consultar cursos", error: error.message });
    }
}


export const obtenerContenidoCurso = async (req, res) => {
    try {

        const { cid } = req.params;
        const authHeader = req.headers.authorization;
        let user = null;

        const course = await cursoModelo.findById(cid);

        if (!course) return res.status(404).json({ error: "Curso no encontrado" }); // Agregué return para cortar ejecución

        // 1. Si es gratis, pasa de una
        if (course.tipo === "Gratuito") {
            return res.status(201).json(course);
        }

        // Verificamos token
        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            user = await usuarioModelo.findById(decoded.id).populate("courses.course");
        } catch (err) {
            return res.status(401).json({ message: "Token inválido o expirado" });
        }

        // --- CHECKEAMOS SI ES ADMIN ---

        // 1. Chequeamos si es admin (ajustá el string según tu DB: "admin", "administrador", etc.)
        const isAdmin = user.rol === "admin" || user.rol === "administrador";

        // 2. Chequeamos si lo compró (tu lógica original)
        const hasCourse = user.courses.some(c => c.course._id.toString() === cid);

        // 3. LA BARRERA FINAL:
        // Si NO lo compró Y TAMPOCO es admin -> Afuera.
        // (Si es admin, esta condición da FALSE y sigue de largo, o sea, entra)
        if (!hasCourse && !isAdmin) {
            return res.status(403).json({ message: "No tenés acceso a este curso" });
        }


        // Si llegó acá, es porque lo compró O es el jefe.
        res.status(201).json(course);

    } catch (error) {
        res.status(500).json({ message: "Error al consultar curso", error: error.message });
    }
}


export const obtenerCursosGratuitos = async (req, res) => {
    const tipo = "Gratuito";
    try {
        const courses = await cursoModelo.find({ tipo: tipo });
        res.status(201).json({ message: "Success", courses });
    } catch (error) {
        res.status(500).json({ message: "Error al consultar cursos por categoría", error: error.message });
    }
}


export const obtenerInfoBasicaCurso = async (req, res) => {
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
}




