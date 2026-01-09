import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    // 1. DATOS GENERALES DEL CURSO
    nombre: { 
      type: String, 
      required: true, 
      trim: true // Elimina espacios vacíos al principio y final
    },
    descripcion: { 
      type: String, 
      required: true 
    },
    precio: { 
      type: Number, 
      required: true 
    },
    thumbnail: { 
      type: String, 
      required: true // URL de la imagen de portada (Cloudinary/Firebase)
    },
    
    tipo: { 
      type: String, 
      required: true //Pago o gratuito
    },
    
    videoIntroduccion: { 
      type: String, 
      required: true // URL del video de introducción
    },
    
    // 2. CATEGORIZACIÓN 
    categoria: {
      type: String,
      required: true,
      enum: [
        "Sanaciones Cosmotelúricas",
        "Rituales",
        "Artesanías Mágicas",
        "Edith Varone", // Si lo usás como categoría
        "Otros"
      ]
    },

    // 3. EL TEMARIO DINÁMICO (Array de Objetos)
    // Acá se guardan los videos. Si tiene 1, guarda 1. Si tiene 20, guarda 20.
    temario: [
      {
        titulo: { type: String, required: true }, // Ej: "Clase 1: Introducción"
        descripcion: { type: String }, // Ej: "En esta clase vemos los materiales..."
        videoUrl: { type: String, required: true }, // Link de YouTube/Vimeo/AWS
        duracion: { type: String }, // Ej: "15:30 min" (Opcional)
        esGratuito: { type: Boolean, default: false } // Por si querés dejar ver el primer video gratis como "gancho"
      }
    ],

    // 4. CONTROL INTERNO
    isActive: { 
      type: Boolean, 
      default: true // Sirve para "borrar" un curso sin borrarlo de la BD (Soft Delete)
    }
  },
  {
    timestamps: true, // Esto te crea automático: createdAt y updatedAt
    versionKey: false // Para que no aparezca el "__v" molesto
  }
);

export const cursoModelo = mongoose.model("Course", courseSchema);
