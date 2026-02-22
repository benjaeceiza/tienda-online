import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
  rol: { type: String, enum: ["user", "admin"], default: "user" },
  courses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      fechaCompra: { type: Date, default: Date.now },
      metodoPago: { type: String, default: "Manual" }, // Ej: "Mercado Pago", "PayPal", "Admin"
      idTransaccion: { type: String, default: "N/A" } // El comprobante que te da MP o PayPal
    }
  ],

  recoveryCodeHash: {
    type: String,
    default: null,
  },
  recoveryCodeExpires: {
    type: Date,
    default: null,
  },
});

export const usuarioModelo = mongoose.model("User", userSchema);
