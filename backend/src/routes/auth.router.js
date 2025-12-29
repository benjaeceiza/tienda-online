
import { Router } from "express";
import { usuarioModelo } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export const router = Router();


// Register
router.post("/register", async (req, res) => {
  const { nombre, apellido, email, password } = req.body;

  try {

    const exists = await usuarioModelo.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "El email ya esta en uso!" })
    }

    if (password.length < 8) {

      return res.status(401).json({ message: "Ingrese una contraseña de 8 o mas caracteres" })
    }




    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await usuarioModelo.create({ nombre, apellido, email, password: hashedPassword });

    const token = jwt.sign(
      {
        id: user.id, email: user.email, nickname: user.nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: "Error al registrar", error: error.message });
  }
});



//Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await usuarioModelo.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email o Contraseña inválido" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Email o Contraseña inválido" });

    const token = jwt.sign(
      { id: user._id, email: user.email, nickname: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ message: "Error en el login", error: error.message });
  }


});

