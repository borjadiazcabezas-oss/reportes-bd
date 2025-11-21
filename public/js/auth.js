// public/js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('mensajeError'); // Asegúrate de tener este elemento en tu index.html

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            errorMsg.textContent = ''; 

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (data.ok) {
                    // Almacena datos del usuario (userId, rol, nombre) en la sesión
                    localStorage.setItem('userData', JSON.stringify(data.data)); 
                    
                    // Redirección basada en el Rol
                    if (data.data.rol === 'OPERARIO') {
                        window.location.href = 'operario.html'; 
                    } else if (data.data.rol === 'LIDER') {
                        window.location.href = 'lider.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                } else {
                    errorMsg.textContent = `Error de Login: ${data.error}`;
                }
            } catch (error) {
                errorMsg.textContent = 'Error de conexión con el servidor.';
                console.error('Fetch error:', error);
            }
        });
    }
});