
import { jwtDecode } from "jwt-decode";
const apiUrl = 'http://localhost:8080/api';
const token = localStorage.getItem("token");


if (token) {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    if (decoded.exp < now) {
        localStorage.removeItem("token");
        alert("Sesión expirada, por favor iniciá sesión nuevamente.");
        window.location.href = "./cursosGratuitos.html";
    }
}

fetch(`${apiUrl}/courses/free`)
    .then(res => res.json())
    .then(data => {
        const listaCursos = document.getElementById("listado-cursos");

        data.courses.forEach(c => {
            const li = document.createElement('li');
            li.style.display = "display: flex, flex-direction:column"
            li.textContent = `${c.nombre} - ${c.descripcion} - $${c.tipo}`;
            listaCursos.appendChild(li);
        });

    })


