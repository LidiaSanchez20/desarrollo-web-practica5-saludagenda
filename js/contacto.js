document.addEventListener('DOMContentLoaded', () => {
    const formContacto = document.getElementById('FormularioContacto');
    const alerta = document.getElementById('alertaExito');
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formContacto || !alerta) return;

    formContacto.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputNombre = document.getElementById('nombre');
        const inputEmail = document.getElementById('email');
        const inputMensaje = document.getElementById('mensaje');

        const nombre = inputNombre.value.trim();
        const email = inputEmail.value.trim();
        const mensaje = inputMensaje.value.trim();

        let esValido = true;

        // validación de nombre
        if (nombre.length < 3) {
            inputNombre.classList.add('is-invalid');
            esValido = false;
        } else {
            inputNombre.classList.remove('is-invalid');
        }

        // validación de email
        if (!regexEmail.test(email)) {
            inputEmail.classList.add('is-invalid');
            esValido = false;
        } else {
            inputEmail.classList.remove('is-invalid');
        }

        // validación de mensaje
        if (mensaje.length === 0) {
            inputMensaje.classList.add('is-invalid');
            esValido = false;
        } else {
            inputMensaje.classList.remove('is-invalid');
        }

        if (!esValido) {
            return;
        }

        // alerta de éxito y limpieza el formulario
        alerta.classList.remove('d-none');
        alerta.classList.add('show');
        formContacto.reset();
        [inputNombre, inputEmail, inputMensaje].forEach(el => el.classList.remove('is-invalid'));
    });
});