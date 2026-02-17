import { Router } from "express";
import { obtenedorTodosLosCursos, obtenerContenidoCurso, obtenerCursosGratuitos, obtenerCursosPorCategoria, obtenerInfoBasicaCurso } from "../controllers/courseController.js";



export const router = Router();

// obtiene todos los cursos
router.get("/", obtenedorTodosLosCursos)

// obtiene los cursos por categoria
router.get("/:categoria", obtenerCursosPorCategoria)

// obtiene el contenido de un curso en especifico
router.get("/contenido/:cid", obtenerContenidoCurso)

//obtiene cursos gratuitos
router.get("/categoria/freeCourses", obtenerCursosGratuitos);

// obtiene info básica del curso (nombre, precio, categoria, descripcion)
router.get("/detalle/:cid", obtenerInfoBasicaCurso);
