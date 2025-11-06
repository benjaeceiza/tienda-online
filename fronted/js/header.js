
const nav = document.getElementById("nav");

const isLog = localStorage.getItem("token");



const a1 = document.createElement("a");
a1.textContent = "Inicio";
a1.href = "./inicio.html";
a1.style.margin = "10px"
const a2 = document.createElement("a");
a2.textContent = "Cursos gratuitos";
a2.href = "./cursosGratuitos.html";
a2.style.margin = "10px";
const a3 = document.createElement("a");
a3.textContent = "Cursos Pagos";
a3.href = "./cursosPagos.html";
a3.style.margin = "10px";
const a4 = document.createElement("a");
a4.textContent = "mis cursos";
a4.href = "./misCursos.html";
a4.style.margin = "10px";
const a5 = document.createElement("a");
a5.textContent = "Iniciar sesion";
a5.href = "./iniciarSesion.html";
a5.style.margin = "10px";
const a6 = document.createElement("a");
a6.textContent = "Registratme";
a6.href = "./registrarse.html";
a6.style.margin = "10px";
const a7 = document.createElement("a");
a7.textContent = "Logout";



a7.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "./iniciarSesion.html";
})

if (isLog) {

    fetch("http://localhost:8080/api/users/user",
        {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }
    )

        .then(res => res.json())
        .then(data => {
        
            
            
            const nombre = document.createElement("a");
             nombre.textContent = `Usuario: ${data.user.nombre} ${data.user.apellido}`

            nav.appendChild(a1);
            nav.appendChild(a2);
            nav.appendChild(a3);
            nav.appendChild(a4);
            nav.appendChild(a7);
            nav.appendChild(nombre);

        })

} else {
    nav.appendChild(a1);
    nav.appendChild(a2);
    nav.appendChild(a3);
    nav.appendChild(a4);
    nav.appendChild(a5);
    nav.appendChild(a6);
}








