import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router as userRouter } from "./routes/users.router.js";
import { router as courseRouter } from "./routes/courses.router.js";
import { router as authRouter } from "./routes/auth.router.js";
import { router as paymentsRouter} from "./routes/payments.router.js";
import cors from "cors";


const app = express();
app.use(cors());

dotenv.config();
const PORT = process.env.PORT;


app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/payments", paymentsRouter);





mongoose.connect(process.env.MONGO_URI, { dbName: "sanaciones_cosmoteluricas" })
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error al conectar MongoDB:", err));



app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));

