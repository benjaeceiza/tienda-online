import { usuarioModelo } from "../models/user.model.js";
import {cursoModelo} from "../models/course.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export const updateUser = async (req, res) => {
    try {
        // 1. Recibimos los datos que el usuario quiere cambiar
        const { nombre, email } = req.body;

        // 2. Extraemos el token para saber quién es
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

        const userId = decoded.id;

        // 3. Validación: Si mandó un email nuevo, verificamos que nadie más lo esté usando
        if (email) {
            // Buscamos si existe alguien con ese email, PERO que no sea él mismo ($ne = not equal)
            const emailEnUso = await usuarioModelo.findOne({ email: email, _id: { $ne: userId } });

            if (emailEnUso) {
                return res.status(400).json({ error: "Este correo electrónico ya está registrado en otra cuenta." });
            }
        }

        // 4. Armamos el objeto con los datos a actualizar (solo actualiza lo que le pasamos)
        const datosAActualizar = {};
        if (nombre) datosAActualizar.nombre = nombre;
        if (email) datosAActualizar.email = email;

        const usuarioActualizado = await usuarioModelo.findByIdAndUpdate(
            userId,
            datosAActualizar,
            { new: true }
        ).select("-password");

        if (!usuarioActualizado) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // 🔥 LA MAGIA ACÁ: Creamos un token NUEVO con los datos actualizados
        // Asegurate de poner exactamente los mismos campos que usaste cuando el usuario hace el Login original
        const tokenNuevo = jwt.sign(
            {
                id: usuarioActualizado._id,
                nickname: usuarioActualizado.nombre, // Ojo acá con el mapeo de nombres
                email: usuarioActualizado.email,
                rol: usuarioActualizado.rol
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" } // O el tiempo que uses normalmente
        );

        // 6. Respondemos con éxito, mandando el user Y el token nuevo
        res.status(200).json({
            message: "Tus datos se actualizaron correctamente.",
            user: usuarioActualizado,
            token: tokenNuevo // <- Esto es lo que React va a agarrar
        });

    } catch (error) {
        console.error("Error en updateUser:", error);
        res.status(500).json({ error: "Error al actualizar el perfil", detalle: error.message });
    }
};



export const updatePassword = async (req, res) => {
    try {
        const { nuevaContrasena } = req.body;

        // 1. Validamos el token para saber quién hace la petición
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

        const userId = decoded.id;

        // 2. Encriptamos la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const contrasenaEncriptada = await bcrypt.hash(nuevaContrasena, salt);

        // 3. Actualizamos solo el campo password en la base de datos
        const usuario = await usuarioModelo.findByIdAndUpdate(
            userId,
            { password: contrasenaEncriptada },
            { new: true }
        );

        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // 4. Respondemos con éxito
        res.status(200).json({ message: "Contraseña actualizada correctamente." });

    } catch (error) {
        console.error("Error en updatePassword:", error);
        res.status(500).json({ error: "Error al actualizar la contraseña", detalle: error.message });
    }
};



export const asignarCursoManual = async (req, res) => {

    try {
        const { targetUserId, courseId } = req.body;

        // 1. Verificamos el token de quien hace la petición
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "Token no proporcionado" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 2. Verificamos que sea Administrador
        const adminUser = await usuarioModelo.findById(decoded.id);
        const esAdmin = adminUser && (adminUser.rol === "admin" || adminUser.rol === "administrador");
        if (!esAdmin) {
            return res.status(403).json({ error: "Acceso denegado. Solo administradores." });
        }

        // 3. Buscamos al usuario destino y el curso
        const targetUser = await usuarioModelo.findById(targetUserId);
        const course = await cursoModelo.findById(courseId);

        if (!targetUser) return res.status(404).json({ error: "Usuario destino no encontrado" });
        if (!course) return res.status(404).json({ error: "Curso no encontrado" });

        // 4. Verificamos si ya tiene este curso para no duplicarlo
        const yaLoTiene = targetUser.courses.some(c => c.course.toString() === courseId);
        if (yaLoTiene) {
            return res.status(400).json({ error: "El usuario ya tiene este curso asignado." });
        }

        // 5. Le asignamos el curso (Le ponemos método "Admin/Regalo" para los recibos)
        targetUser.courses.push({
            course: courseId,
            metodoPago: "Admin / Regalo",
            idTransaccion: "ASIGNACION-MANUAL"
        });

        await targetUser.save();

        res.status(200).json({
            message: `Curso "${course.nombre}" asignado exitosamente a ${targetUser.nombre || targetUser.email}.`
        });

    } catch (error) {
        console.error("Error al asignar curso:", error);
        res.status(500).json({ error: "Error en el servidor al asignar curso." });
    }
};



export const editarUsuarioPorAdmin = async (req, res) => {
    try {
        const { targetUserId, nombre, email, rol } = req.body;

        // 1. Verificamos quién hace la petición
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "Token no proporcionado" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 2. Verificamos que sea Administrador
        const adminUser = await usuarioModelo.findById(decoded.id);
        const esAdmin = adminUser && (adminUser.rol === "admin" || adminUser.rol === "administrador");
        if (!esAdmin) {
            return res.status(403).json({ error: "Acceso denegado. Solo administradores." });
        }

        // 3. Buscamos y actualizamos al usuario destino
        // Validamos que el targetUserId exista
        const usuarioEditado = await usuarioModelo.findByIdAndUpdate(
            targetUserId,
            { nombre, email, rol },
            { new: true } // Para que nos devuelva el usuario ya actualizado
        ).select("-password"); // No mandamos la contraseña al front

        if (!usuarioEditado) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.status(200).json({ 
            message: "Usuario actualizado correctamente.",
            user: usuarioEditado
        });

    } catch (error) {
        console.error("Error al editar usuario (Admin):", error);
        res.status(500).json({ error: "Error en el servidor al editar usuario." });
    }
};