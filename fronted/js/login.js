const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {

        const res = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();

     

        if (res.ok) {
            mensaje.textContent = "✅ Inicio de sesion exitosa!";
            mensaje.style.color = "green";
            
            if (result.token) {
                localStorage.setItem("token", result.token);
           
            }

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