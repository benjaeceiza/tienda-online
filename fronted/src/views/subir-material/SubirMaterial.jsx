import { useState } from 'react';
import axios from 'axios'; // O fetch si prefieres

const SubirMaterial = () => {
    const [file, setFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(""); // Aquí guardaremos la URL que nos devuelve el back
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert("Selecciona un archivo primero");

        const formData = new FormData();
        formData.append("archivo", file); // "archivo" debe coincidir con upload.single('archivo') del backend

        try {
            setLoading(true);
            const token = localStorage.getItem("token"); // Si tu ruta está protegida

            // Cambia la URL por la de tu backend real
            const response = await axios.post("http://localhost:3000/api/upload-pdf", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log("Archivo subido:", response.data.url);
            setPdfUrl(response.data.url); // Guardamos la URL para mostrarla o enviarla a la DB
            alert("PDF subido a la nube correctamente");

        } catch (error) {
            console.error("Error subiendo:", error);
            alert("Falló la subida");
        } finally {
            setLoading(false);
        }
    };

    // FUNCIÓN PARA GUARDAR EL CURSO FINALMENTE
    const guardarCursoEnDB = async () => {
        // Aquí harías el POST final para crear el curso
        // enviando el título, descripción y la 'pdfUrl' que conseguiste arriba
        const nuevoCurso = {
            titulo: "Curso de Sanación",
            materialPdf: pdfUrl // <--- ESTA ES LA CLAVE
        };
        // await axios.post('/api/crear-curso', nuevoCurso...)
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ccc" }}>
            <h3>Subir Material del Curso</h3>

            <input type="file" accept="application/pdf" onChange={handleFileChange} />

            <button onClick={handleUpload} disabled={loading}>
                {loading ? "Subiendo..." : "1. Subir PDF a la Nube"}
            </button>

            {pdfUrl && (
                <div style={{ marginTop: "10px" }}>
                    <p style={{ color: "green" }}>✅ PDF listo para guardar</p>
                    <small>{pdfUrl}</small>
                    <br />
                    <button onClick={guardarCursoEnDB}>2. Guardar Curso</button>
                </div>
            )}
        </div>
    );
};

export default SubirMaterial;