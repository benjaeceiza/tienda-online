import { Router } from "express";
import { usuarioModelo } from "../models/user.model.js";
import { authMiddleware, isAdmin } from "../middleware/auth.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { asignarCursoManual, editarUsuarioPorAdmin, eliminarUsuario, updatePassword, updateUser } from "../controllers/userController.js";
import { obtenerTodosLosUsuarios } from "../controllers/adminController.js";
dotenv.config();


export const router = Router();





//Trae al usuario logueado 
router.get("/user", authMiddleware, async (req, res) => {
  try {

    const userId = req.user.id;
    const user = await usuarioModelo.findById(userId);

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

    res.status(201).json({ message: "Success", courses: userCourses });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al consultar los cursos", error: error.message });
  }
});


// chequea si el email existe
router.get("/email/check", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email requerido" });
    }

    const user = await usuarioModelo.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email inválido" });
    }

    return res.status(200).json({
      message: "Success",
      exists: true
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error al verificar email",
      error: error.message
    });
  }
});


// cambiar contraseña
router.post("/recovery/send", async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ validar email
    const user = await usuarioModelo.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email no registrado" });
    }

    // 2️⃣ generar código 5 dígitos
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    // 3️⃣ hashear
    const codeHash = await bcrypt.hash(code, 10);

    // 4️⃣ guardar en usuario
    user.recoveryCodeHash = codeHash;
    user.recoveryCodeExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await user.save();

    res.json({ success: true , code,});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error enviando código" });
  }
});


//Verifica el codigo ingresado 
router.post("/recovery/verify", async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await usuarioModelo.findOne({ email });

    if (!user || !user.recoveryCodeHash) {
      return res.status(400).json({ message: "Código inválido o expirado" });
    }

    // ⏰ verificar expiración
    if (Date.now() > user.recoveryCodeExpires) {
      user.recoveryCodeHash = null;
      user.recoveryCodeExpires = null;
      await user.save();

      return res.status(400).json({ message: "Código expirado" });
    }

    // 🔐 comparar hash
    const isValid = await bcrypt.compare(code, user.recoveryCodeHash);

    if (!isValid) {
      return res.status(400).json({ message: "Código incorrecto" });
    }

    // ✅ código correcto → limpiar
    user.recoveryCodeHash = null;
    user.recoveryCodeExpires = null;
    await user.save();

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error validando código" });
  }
});


//Resetea contraseña

router.post("/recovery/reset", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    const user = await usuarioModelo.findOneAndUpdate(
      { email },
      { password: hash },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error cambiando contraseña" });
  }
});


router.put("/update", authMiddleware,updateUser );
router.put("/update-password", authMiddleware,updatePassword );

// RUTAS ADMIN

router.get("/admin/users",authMiddleware,isAdmin, obtenerTodosLosUsuarios);
router.post("/admin/assign-course", authMiddleware,isAdmin, asignarCursoManual);
router.put("/admin/edit-user", authMiddleware,isAdmin, editarUsuarioPorAdmin);
router.delete("/admin/users/:id",authMiddleware,isAdmin, eliminarUsuario);
