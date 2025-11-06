import { jwtDecode } from "jwt-decode";

const apiUrl = 'http://localhost:8080/api';
const token = localStorage.getItem("token");
let usuario = {}; // datos del usuario logueado (si lo hay)


//  Verificar token y obtener cursos del usuario
async function verificarSesion() {
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
            localStorage.removeItem("token");
            alert("⚠️ Sesión expirada, por favor iniciá sesión nuevamente.");
            window.location.href = "./iniciarSesion.html";
            return null;
        }

        const res = await fetch(`${apiUrl}/users/me/courses`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        });

        if (res.ok) {
            const data = await res.json();
            console.log("✅ Usuario obtenido:", data);
            return data.user || data; // depende del formato de tu backend
        } else {
            console.warn("No se pudo obtener el usuario:", res.status);
            return null;
        }
    } catch (err) {
        console.error("Error al validar token:", err);
        localStorage.removeItem("token");
        return null;
    }
}


// 🧩 Mostrar todos los cursos pagos
async function mostrarCursos(usuario) {
    try {
        const res = await fetch(`${apiUrl}/courses/paid`);
        const data = await res.json();

        const listaCursos = document.getElementById("listado-cursos");
        listaCursos.innerHTML = "";

        data.courses.forEach(c => {
            const li = document.createElement("li");
            li.className = "item-lista-curso";

            const nombre = document.createElement("p");
            const precio = document.createElement("p");
            const descripcion = document.createElement("p");
            const tipo = document.createElement("p");
            const botonComprar = document.createElement("button");
            const botonVer = document.createElement("button");
            const p = document.createElement("p");

            nombre.textContent = `Título: ${c.nombre}`;
            precio.textContent = `$${c.precio}`;
            descripcion.textContent = `Descripción: ${c.descripcion}`;
            tipo.textContent = `Tipo: ${c.tipo}`;
            botonComprar.textContent = "Comprar";
            botonVer.textContent = "Ver curso";

            botonComprar.className = "curso-boton";
            botonVer.className = "curso-boton";

            li.append(nombre, descripcion, precio, tipo);

            // ✅ Verificar si el usuario ya tiene el curso
            const tieneCurso = usuario?.courses?.some(e => e.course?._id === c._id);

            if (tieneCurso) {
                li.appendChild(botonVer);
            } else {
                li.appendChild(botonComprar);
            }

            li.appendChild(p);
            listaCursos.appendChild(li);

            // 🎯 Comprar curso
            botonComprar.addEventListener("click", async () => {
                if (!token) {
                    p.textContent = "🔒 Iniciá sesión o registrate para comprar.";
                    p.style.color = "red";
                    return;
                }

                try {
                    const res = await fetch(`${apiUrl}/payments/${c._id}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    });

                    if (res.ok) {
                        p.textContent = "✅ Curso comprado correctamente!";
                        p.style.color = "green";
                        botonComprar.replaceWith(botonVer);
                    } else {
                        const errData = await res.json();
                        p.textContent = `❌ Error: ${errData.message}`;
                        p.style.color = "red";
                    }
                } catch (error) {
                    console.error("Error al comprar curso:", error);
                    p.textContent = "⚠️ Error de conexión con el servidor.";
                    p.style.color = "red";
                }
            });

            botonVer.addEventListener("click", () => {
                alert(`📘 Abriendo curso: ${c.nombre}`);
            });
        });

    } catch (error) {
        console.error("Error al obtener cursos:", error);
    }
}

//  Inicialización
(async () => {
    const usuario = await verificarSesion();
    await mostrarCursos(usuario);
})();