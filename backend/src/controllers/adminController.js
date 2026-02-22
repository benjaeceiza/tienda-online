import { usuarioModelo } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const obtenerTodosLosUsuarios = async (req, res) => {
    try {
        // 1. Verificamos quién está haciendo la petición
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Token no proporcionado" });
        }

        const token = authHeader.split(" ")[1];
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ error: "Token inválido o expirado" });
        }

        // 2. BARRERA DE SEGURIDAD (¿Es Administrador?)
        const usuarioSolicitante = await usuarioModelo.findById(decoded.id);
        
        const esAdmin = usuarioSolicitante && (usuarioSolicitante.rol === "admin" || usuarioSolicitante.rol === "administrador");
        
        if (!esAdmin) {
            return res.status(403).json({ error: "Acceso denegado. Área exclusiva para administradores." });
        }

        // 3. Si llegó hasta acá, es EL JEFE. Buscamos toda la base de datos.
        // .select("-password") asegura que no se filtren las claves encriptadas
        // .populate() "infla" los cursos para que veas qué compró cada uno
        const todosLosUsuarios = await usuarioModelo.find()
            .select("-password")
            .populate("courses.course", "nombre categoria precio tipo"); 

        // 4. Devolvemos la lista limpia al frontend
        res.status(200).json({ 
            message: "Lista de usuarios obtenida con éxito",
            usuarios: todosLosUsuarios 
        });

    } catch (error) {
        console.error("Error en obtenerTodosLosUsuarios:", error);
        res.status(500).json({ error: "Error interno del servidor", detalle: error.message });
    }
};