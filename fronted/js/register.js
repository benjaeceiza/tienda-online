
const form = document.getElementById('registerForm');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {

        const res = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();



        if (res.ok) {
            mensaje.textContent = "✅ Usuario registrado exitosamente";
            mensaje.style.color = "green";
            
            
            if (result.token) {
                localStorage.setItem("token", result.token);
            }
            window.location.href = "./inicio.html";
            form.reset();
            
        } else {
            mensaje.textContent = `❌ Error: ${result.message}`;
            mensaje.style.color = "red";
        }

        
    } catch (err) {
        mensaje.textContent = "❌ Error de conexión con el servidor";
        mensaje.style.color = "red";
    }
});
