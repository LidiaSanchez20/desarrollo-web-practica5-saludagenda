// Obtener la lista de citas o un arreglo vacío si no existe o si falla
function obtener(clave) {
  try {
    const datos = JSON.parse(localStorage.getItem(clave));
    return Array.isArray(datos) ? datos: [];
  } catch (e) {
    console.error('Error al leer la clave "${clave}" de localStorage:', e);
    return [];
  }
}

// Guardar en JSON
function guardar(clave, datos) {
  try {
    localStorage.setItem(clave, JSON.stringify(datos));
  } catch (e) {
    console.error('Error al guardar en el localStorage:', e);
  }
}

// Validar si la fecha y la hora son posteriores
function validarFecha (fechaHora) {
  return new Date(fechaHora) > new Date();
}