import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


export const authMiddleware = (req, res, next) => {
  
  const token = req.headers.authorization?.split(" ")[1]; // 

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};


// Agregá esto en tu archivo de middlewares

export const isAdmin = (req, res, next) => {
  // 1. Verificamos que el middleware anterior (authMiddleware) haya guardado al usuario
  if (!req.user) {
    return res.status(401).json({ message: "Acceso denegado. Usuario no autenticado." });
  }

  // 2. Comprobamos si el rol es válido
  // (Uso "admin" y "administrador" por las dudas, según cómo lo guardes en MongoDB)
  if (req.user.rol !== "admin" && req.user.rol !== "administrador") {
    return res.status(403).json({ 
      message: "Acceso denegado. Se requieren permisos de administrador para esta acción." 
    });
  }

  // 3. Todo en orden, pasa a la siguiente función (el controlador)
  next();
};