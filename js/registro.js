document.addEventListener('DOMContentLoaded', () => {
    // obtener los datos del registro a partir del id
    const form = document.getElementById('FormularioAgendar');
    const inputNombre = document.getElementById('nombre');
    const inputEmail = document.getElementById('email');
    const inputTel = document.getElementById('telefono');
    const selectEsp = document.getElementById('especialidad');
    const inputFecha = document.getElementById('fecha');
    const inputHora = document.getElementById('hora');
    const textareaMotivo = document.getElementById('motivo');
    const botonLimpiar = document.getElementById('btnLimpiar');

    if (!form) return;

    // Establecer la fecha mínima
    const hoy = new Date().toISOString().split('T')[0];
    inputFecha.setAttribute('min', hoy);

    // función para marcar error o éxito en Bootstrap
    function marcarCampo(input, esValido) {
        if (esValido) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            } else {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
            }
            return esValido;
    }

    // Limpiar clases cuando el botón de limpiar fue accionado
    if (botonLimpiar) {
        botonLimpiar.addEventListener('click', () => {
            form.reset();
            const controles = form.querySelectorAll('.control-input');
            controles.forEach(c => c.classList.remove('is-valid', 'is-invalid'));
        });
    }

    // Interceptar el envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let formularioValido = true;

        // Validaciones
        // Nombre completo
        const nombreValido = inputNombre.value.trim().length >= 3;
        formularioValido = marcarCampo(inputNombre, nombreValido) && formularioValido;

        //Correo electrónico
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValido = regexEmail.test(inputEmail.value.trim());
        formularioValido = marcarCampo(inputEmail, emailValido) && formularioValido;

        // Teléfono con un mínimo de 10 dígitos 
        const regexTelefono = /^\d{10,}$/;
        const telefonoLimpio = inputTel.value.replace(/\s+/g, '');
        const telefonoValido = regexTelefono.test(telefonoLimpio);
        formularioValido = marcarCampo(inputTel, telefonoValido) && formularioValido;

        // Especialidad
        const especialidadValida = selectEsp.value !== '';
        formularioValido = marcarCampo(selectEsp, especialidadValida) && formularioValido;

        // Fecha y hora (no pasadas)
        let fechaHoraValida = false;
        if (inputFecha.value && inputHora.value) {
            const fechaHoraString = `${inputFecha.value}T${inputHora.value}`;
            fechaHoraValida = validarFecha(fechaHoraString);
        }
        marcarCampo(inputFecha, Boolean(inputFecha.value && fechaHoraValida));
        marcarCampo(inputHora, Boolean(inputHora.value && fechaHoraValida));
        if (!inputFecha.value || !inputHora.value || !fechaHoraValida) {
            formularioValido = false;
        }

        // Motivo
        const motivoValido = textareaMotivo.value.trim().length > 0;
        formularioValido = marcarCampo(textareaMotivo, motivoValido) && formularioValido;

        // Alerta en caso de fallo general
        if (!formularioValido) {
            alert('Por favor corrige los campos marcados en rojo.');
            return;
        }

        // Objeto con estructura de la cita
        const nuevaCita = {
            id: Date.now(),
            nombre: inputNombre.value.trim(),
            correo: inputEmail.value.trim(),
            telefono: telefonoLimpio,
            especialidad: selectEsp.value,
            fecha: inputFecha.value,
            hora: inputHora.value,
            motivo: textareaMotivo.value.trim(),
            estado: 'Programada' // Estado inicial obligatorio
        };

        // persistencia y navegación
        const citas = obtener('citas');
        citas.push(nuevaCita);
        guardar('citas', citas);

        // Retroalimentación y redirección
        alert('¡Cita registrada con éxito!');
        form.reset();
        window.location.href = 'citas.html';
    });
});