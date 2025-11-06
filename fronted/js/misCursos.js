


// const titulo = document.getElementById("mis-cursos-titulo");
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");

if (token) {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    if (decoded.exp < now) {
        localStorage.removeItem("token");
        alert("Sesión expirada, por favor iniciá sesión nuevamente.");
        window.location.href = "./misCursos.html";
    }
}

if (!token) {
    const noLogueado = document.createElement("h2");
    const contenedor = document.getElementById("contenedor");
    noLogueado.innerText = "Registrate o inicia sesion";
    contenedor.appendChild(noLogueado);
} else {

    const lista = document.getElementById("lista-cursos");

    fetch(`http://localhost:8080/api/users/me/courses`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    }).then(res => res.json())
        .then(data => {


            const contenedor = document.getElementById("contenedor-lista-cursos");

            if (data.courses.length == 0) {
                const vacio = document.createElement("h2");
                vacio.innerText = "No tiene ningún curso";
                contenedor.appendChild(vacio)
            } else {
                data.courses.forEach(c => {
                    const li = document.createElement("li");
                    li.style.margin = "20px"
                    const btnVerCotenido = document.createElement("button");
                    btnVerCotenido.textContent = "Ver curso",
                        btnVerCotenido.style.marginLeft = "20px"
                    li.textContent = `Nombre curso: ${c.course.nombre}`;
                    li.appendChild(btnVerCotenido)
                    lista.appendChild(li);
                });

            }



        })

        .catch(error => { console.log(error) })
}




