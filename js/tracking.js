export function getItems() {
  const productos = localStorage.getItem("productos");
  return productos ? JSON.parse(productos) : [];
}
const arrayItems = getItems();
const tbody = $("#tbody");

arrayItems.forEach((producto) => {
  const fila = $(
    `<tr class="border-b border-gray-200 dark:border-gray-700"></tr>`
  );
  const imagen = `<td class='px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800'>
        <img src=${producto.src}>
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
