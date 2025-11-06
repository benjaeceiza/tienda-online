import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
        nombre: String,
        descripcion: String,
        precio: Number,
        tipo: String
    }
)


export const cursoModelo = mongoose.model("Course", courseSchema);
