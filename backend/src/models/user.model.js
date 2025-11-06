import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nombre: { type: String, require: true },
  apellido: { type: String, require: true },
  email: { type: String,require: true, unique: true },
  password: String ,
  courses: [
    { course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" } }
  ],
});

export const usuarioModelo = mongoose.model("User", userSchema);