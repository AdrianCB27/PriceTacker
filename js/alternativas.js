/**
 * Cogemos el valor del parametro de la url
 *
 * @param {string} name - El nombre del parámetro de consulta a recuperar.
 * @returns {string} El valor del parámetro de consulta, o una cadena vacía si no se encuentra el parámetro.
 */
function getParameterByName(name) {
  //función copiada de https://es.stackoverflow.com/questions/445/c%C3%B3mo-obtener-valores-de-la-url-get-en-javascript
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
// Obtenemos el nombre del producto de la URL gracias a la función getParameterByName que hemos definido arriba
const nombreProducto = getParameterByName("nombre");
let cargando = true;
// muestra el indicador de carga
if (cargando) {
  console.log("Cargando");
  $('#cargando').toggleClass('hidden');
}
/**
 * Fetch a la API2 para obtener las alternativas de un producto
 */
fetch(`http://localhost:3001/api2/${nombreProducto}`).then((response) => {
  response.json().then((data) => {
    cargando = false;
    $('#cargando').toggleClass('hidden');
    console.log(data);
    pintarAlternativas(data); // data es un array de objetos
  });
});

/**
 * Recorre el array de las alternativas obtenidas y las pinta en la tabla. Utiliza jQuery y clases de Tailwind CSS.
 * @param {Array} arrayAlternativas 
 */
function pintarAlternativas(arrayAlternativas) {
  const tbody = $("#tbody");

  arrayAlternativas.forEach((alternativa) => {
    const fila = $(`<tr class="border-b border-gray-200 dark:border-gray-700"></tr>`);
    const imagen = `
      <td class='px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800'>
        <img class="rounded-xl" src=${alternativa.urlImagen}>
      </td>`;
    const nombre = `
      <td class='px-6 py-4 text-white bg-gray-50 dark:bg-gray-800'>
        ${alternativa.title}
      </td>`;
    const precio = `
      <td class='px-6 py-4 text-white bg-gray-50 dark:bg-gray-800'>
        ${alternativa.price}
      </td>`;
    const url = `<td><a href="${alternativa.url}">Comprar</a></td>`;

    fila.append(imagen, nombre, precio, url);
    tbody.append(fila);
  });
}
