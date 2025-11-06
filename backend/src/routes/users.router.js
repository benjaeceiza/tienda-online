import { Router } from "express";
import { usuarioModelo } from "../models/user.model.js";
import { authMiddleware } from "../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();


export const router = Router();





//Trae al usuario logueado con sus cursos
router.get("/user", authMiddleware, async (req, res) => {
  try {

    const userId = req.user.id;
    const userDb = await usuarioModelo.findById(userId).populate("courses.course");
    const user = userDb.toObject();


    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.status(201).json({ message: "Success", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al consultar usuarios", error: error.message });
  }
});



//Trae los cursos del usuario logueado
router.get("/me/courses", authMiddleware, async (req, res) => {

  try {

    const userId = req.user.id;
    const user = await usuarioModelo.findById(userId).populate("courses.course");
    const userCourses = user.courses



    if (!user) return res.status(404).json({ error: "Error al traer los cursos" });

    res.status(201).json({ message: "Success", courses:userCourses });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al consultar los cursos", error: error.message });
  }
});


