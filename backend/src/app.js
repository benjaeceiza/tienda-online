import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router as userRouter } from "./routes/users.router.js";
import { router as courseRouter } from "./routes/courses.router.js";
import { router as authRouter } from "./routes/auth.router.js";
import { router as paymentsRouter} from "./routes/payments.router.js";
import cors from "cors";


const origenesPermitidos = [
  'https://sanacioncosmotelurica.com', // <-- ¡TU DOMINIO NUEVO!
  'http://localhost:8080',             // Para seguir probando en tu compu
  'http://localhost:5173',             // Por si usas Vite localmente
  'https://tienda-online-opal.vercel.app' // El viejo de Vercel (opcional, lo podés borrar si ya no lo usás)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Si el origen está en el array, o si no hay origen (ej. herramientas como Postman), lo deja pasar
    if (origenesPermitidos.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

dotenv.config();
const PORT = process.env.PORT;



app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/payments", paymentsRouter);





mongoose.connect(process.env.MONGO_URI, { dbName: "sanaciones_cosmoteluricas" })
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error al conectar MongoDB:", err));



app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));

