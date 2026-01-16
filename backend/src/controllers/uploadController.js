import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// 1. Configura tus credenciales (sácalas de tu panel de Cloudinary)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configura el almacenamiento
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'sanaciones-cursos', // El nombre de la carpeta en la nube
        // 'auto' detecta si es pdf, imagen o video automáticamente
        resource_type: 'auto',
        // Mantiene el nombre original del archivo (opcional)
        public_id: (req, file) => file.originalname.split('.')[0]
    },
});

const upload = multer({ storage: storage });

// 3. La Ruta POST
// 'archivo' es el nombre del campo que enviaremos desde el Frontend
router.post('/upload-pdf', upload.single('archivo'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No se subió ningún archivo" });
        }

        // ESTO ES ORO: La url que te devuelve Cloudinary
        const urlDelArchivo = req.file.path;

        // Devolvemos la URL al frontend para que luego la guardes en la base de datos
        res.status(200).json({
            message: "Archivo subido con éxito",
            url: urlDelArchivo
        });

    } catch (error) {
        console.error("Error al subir:", error);
        res.status(500).json({ message: "Error interno al subir archivo" });
    }
});

export default router;