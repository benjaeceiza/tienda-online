import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
  courses: [
    { course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" } }
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
