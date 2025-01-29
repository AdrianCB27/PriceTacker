/**
 * 
 * @returns {Array} array de productos del localstorage
 */
export function getItems() {
  const productos = localStorage.getItem("productos");
  return productos ? JSON.parse(productos) : [];
}
const arrayItems = getItems();
const tbody = $("#tbody");

/**
 * Recorremos el array del localstorage y pintamos los productos en la tabla de forma "Dinámica", estos productos
 * dependen del contenido del localstorage, es decir, si el localstorage esta vacio, la tabla estará vacia.
 */
arrayItems.forEach((producto) => {
  const fila = $(
    `<tr class="border-b border-gray-200 dark:border-gray-700"></tr>`
  );
  const imagen = `<td class='px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800'>
        <img class="rounded-xl" src=${producto.src}>
        </td>`;
  const nombre = `<td class='px-6 py-4 text-white bg-gray-50 dark:bg-gray-800'>
        ${producto.nombre}
        
            </td>`;
  const precio = `<td class='px-6 py-4  text-white bg-gray-50 dark:bg-gray-800'>
                ${producto.precio}
                    </td>`;
  const stock=`<td class='px-6 py-4  text-white bg-gray-50 dark:bg-gray-800'>
                ${producto.stock}
                    </td>`;

  fila.append(imagen, nombre, precio,stock);
  tbody.append(fila);
});

$('#borrarHistorial').on('click',()=>{
  if (!confirm("¿Seguro que quieres borrar el historial de productos? No se podrá recuperar.")) {
    return;
  }
  localStorage.clear();
  location.reload();
})
