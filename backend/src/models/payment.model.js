import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  // CORRECCIÓN: Definimos el tipo como String y que sea único
  paymentId: { 
    type: String, 
    required: true, 
    unique: true // Para evitar guardar dos veces el mismo pago
  },
  
  status: { 
    type: String, 
    required: true // "approved", "pending", "rejected"
  },
  
  // Referencias a tus otros modelos
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  
  cursoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course", // Ojo: Revisá si tu modelo de cursos se llama "Course" o "Curso"
    required: true 
  },
  
  // Dato extra útil: Cuánto pagó (por si cambiás el precio del curso después)
  amount: { type: Number }, 
  
  createdAt: { type: Date, default: Date.now },
});

export const paymentModel = mongoose.model("Payment", paymentSchema);