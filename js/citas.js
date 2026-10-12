let modalEditarInstancia = null;

// espera a que la página cargue para conectar los botones y eventos
document.addEventListener('DOMContentLoaded', () => {
  const modalEl = document.getElementById('modalEditarCita');
  if (modalEl && typeof bootstrap !== 'undefined') {
    modalEditarInstancia = new bootstrap.Modal(modalEl);
  }

  renderizarTabla(); // Muestra las citas almacenadas

  // filtros
  document.getElementById('filtroEspecialidad').addEventListener('change', renderizarTabla);
  document.getElementById('filtroFechaInicio').addEventListener('input', renderizarTabla);
  document.getElementById('filtroFechaFin').addEventListener('input', renderizarTabla);
  document.getElementById('btnLimpiarFiltros').addEventListener('click', limpiarFiltros);

  // botón de descarga del archivo de texto
  document.getElementById('btnExportarTxt').addEventListener('click', exportarCitasTxt);

  // formulario para cambios de citas editadas
  document.getElementById('formEditarCita').addEventListener('submit', guardarEdicionCita);
});

// asigna el color de la etiqueta según el estado de la cita
function obtenerBadgeEstado(estado) {
  const normalizado = (estado || '').toLowerCase().trim();
  switch (normalizado) {
    case 'confirmada':
      return '<span class="badge bg-success">Confirmada</span>'; // Verde
    case 'cancelada':
      return '<span class="badge bg-danger">Cancelada</span>';   // Rojo
    case 'programada':
    default:
      return '<span class="badge bg-primary">Programada</span>'; // Azul
  }
}

// Filtra las citas por especialidad y rango de fechas
function aplicarFiltros(lista) {
  const esp = document.getElementById('filtroEspecialidad').value;
  const fInicio = document.getElementById('filtroFechaInicio').value;
  const fFin = document.getElementById('filtroFechaFin').value;

  return lista.filter(cita => {
    if (esp && cita.especialidad !== esp) return false;
    if (fInicio && cita.fecha < fInicio) return false;
    if (fFin && cita.fecha > fFin) return false;
    return true;
  });
}

// Renderiza la tabla
function renderizarTabla() {
  const todasLasCitas = obtener('citas');
  const citasFiltradas = aplicarFiltros(todasLasCitas);
  const tbody = document.getElementById('tablaCitasCuerpo');

  tbody.innerHTML = '';

  // mensaje en caso de que no haya citas registradas o sin coincidencias con el filtro
  if (citasFiltradas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4 text-muted">
          No hay citas registradas o ninguna coincide con los filtros aplicados.
        </td>
      </tr>
    `;
    return;
  }

  // Genera las filas de citas
  citasFiltradas.forEach(cita => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="text-secondary small fw-bold">#${cita.id}</td>
      <td class="fw-semibold text-dark">${cita.nombre}</td>
      <td>${cita.especialidad}</td>
      <td>${cita.fecha}</td>
      <td>${cita.hora}</td>
      <td>${obtenerBadgeEstado(cita.estado)}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-primary me-1" onclick="abrirModalEditar(${cita.id})">
          Editar
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarCita(${cita.id})">
          Eliminar
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Restablecer los controles de filtro
function limpiarFiltros() {
  document.getElementById('filtroEspecialidad').value = '';
  document.getElementById('filtroFechaInicio').value = '';
  document.getElementById('filtroFechaFin').value = '';
  renderizarTabla();
}

// Eliminación de cita con confirmación 
function eliminarCita(id) {
  const confirmar = confirm(`¿Estás seguro de que deseas eliminar la cita #${id}? Esta acción no se puede deshacer.`);
  if (!confirmar) return;

  const citas = obtener('citas');
  const nuevasCitas = citas.filter(c => Number(c.id) !== Number(id));
  guardar('citas', nuevasCitas);
  renderizarTabla();
}

// precarga los datos de la cita seleccionada
function abrirModalEditar(id) {
  const citas = obtener('citas');
  const cita = citas.find(c => Number(c.id) === Number(id));

  if (!cita) {
    alert('No se encontró la cita solicitada.');
    return;
  }

  document.getElementById('editCitaId').value = cita.id;
  document.getElementById('editNombre').value = cita.nombre;
  document.getElementById('editEspecialidad').value = cita.especialidad;
  document.getElementById('editFecha').value = cita.fecha;
  document.getElementById('editHora').value = cita.hora;
  document.getElementById('editEstado').value = cita.estado;

  if (modalEditarInstancia) {
    modalEditarInstancia.show();
  }
}

// Guardar los cambios editados en localStorage
function guardarEdicionCita(e) {
  e.preventDefault();

  const id = Number(document.getElementById('editCitaId').value);
  const citas = obtener('citas');
  const index = citas.findIndex(c => Number(c.id) === id);

  if (index === -1) {
    alert('Error al localizar la cita para actualizar.');
    return;
  }

  citas[index].nombre = document.getElementById('editNombre').value.trim();
  citas[index].especialidad = document.getElementById('editEspecialidad').value;
  citas[index].fecha = document.getElementById('editFecha').value;
  citas[index].hora = document.getElementById('editHora').value;
  citas[index].estado = document.getElementById('editEstado').value;

  guardar('citas', citas);

  if (modalEditarInstancia) {
    modalEditarInstancia.hide();
  }
  renderizarTabla();
}

// genera y descarga el archivo de citas.txt
function exportarCitasTxt() {
  const citas = obtener('citas');
  if (citas.length === 0) {
    alert('No hay citas registradas para exportar.');
    return;
  }

  // Encabezado de la cita
  let contenido = `Listado de citas - SaludAgenda\n`;
  contenido += `Generado: ${new Date().toLocaleString('es-MX')}\n`;
  contenido += '='.repeat(40) + '\n\n';

  // Recorre las citas y las agrega
  citas.forEach(c => {
    contenido += `Paciente: ${c.nombre}\n`;
    contenido += `Especialidad: ${c.especialidad}\n`;
    contenido += `Fecha: ${c.fecha} ${c.hora}\n`;
    contenido += `Estado: ${c.estado}\n`;
    contenido += '-'.repeat(40) + '\n';
  });

  // crea el archivo en memoria
  const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = 'citas.txt';
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}