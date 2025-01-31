/**
 * Variables que se utilizan en el script.
 */
let dataJson = {};
let cargando = false;
let datosLocalStorage=getItems()

/** 
 * Evento que se dispara al hacer click en el botón de búsqueda.
 * Realiza una petición a la API del backend con la URL del producto introducida por el usuario.
 * Si la petición es exitosa, muestra la imagen del producto, su nombre, descripción, precio y stock.
 * Si la petición falla, muestra un mensaje de error.
*/
// evento que se dispara al hacer click en el botón con id "boton"
$("#boton").on("click", async function () {
  // si ya hay un nombre de producto mostrado, limpia la pantalla
  if (($('#nombre').text()) !== "" && ($('#nombre').text()) !== "❌😔Lo siento, ese producto no se puede trackear") {
    limpiar();
  }
  
  // obtiene la URL del producto introducida por el usuario y la codifica
  const url = $("#producto").val().trim();
  const encodedUrl = encodeURIComponent(url);
  cargando = true;

  // muestra el indicador de carga
  if (cargando) {
    $('#cargando').toggleClass('hidden');
  }

  // realiza una petición a la API del backend con la URL codificada
  fetch(`http://localhost:3001/api/${encodedUrl}`)
    .then((response) => {
      cargando = false;
      // oculta el indicador de carga
      $('#cargando').toggleClass('hidden');
      return response.json();
    })
    .then((data) => {
      console.log("Datos recibidos:", data);
      // si el producto no existe en el localStorage, lo añade
      if (!existeProducto(datosLocalStorage, data.nombre)) {
        datosLocalStorage.unshift(data);
        setItems(datosLocalStorage);
      }
      // muestra los datos del producto en la página
      pintarTitulo(data.nombre);
      pintarFoto(data.src);
      pintarDescripcion(data.desc);
      pintarPrecioYStock(data.precio, data.stock);
      pintarAlternativas(data.nombre);
    })
    .catch((error) => {
      // muestra un mensaje de error si la petición falla
      pintarTitulo("❌😔Lo siento, ese producto no se puede trackear");
    });
});

/**
 * Pinta el enlace a la página de alternativas con el nombre del producto como parámetro.
 * @param {string} nombreProducto 
 */
function pintarAlternativas(nombreProducto) {
  $('#alternativas').attr('href',`/pages/alternativas.html?nombre=${nombreProducto}`);
}

/**
 * Actualiza el src del elemento de imagen con la URL proporcionada y alterna su visibilidad.
 *
 * @param {string} src - La URL de la imagen que se va a mostrar.
 */
function pintarFoto(src) {
  $('#imagen').attr('src',src);
  $('#imagen').toggleClass('hidden')
}

/**
 * Actualiza el contenido de texto del elemento HTML con el ID 'nombre' al título proporcionado.
 *
 * @param {string} titulo - El título que se establecerá como contenido de texto del elemento.
 */
function pintarTitulo(titulo) {
$('#nombre').text(titulo)
}
/**
 * Actualiza el contenido de la descripcion del articulo buscado
 * @param {string[]} descripcion - La descripcion del articulo
 */
function pintarDescripcion(descripcion){
  descripcion.forEach(elemento => {
    console.log(elemento);
    $('#descripcion').append(`<li>${elemento.desc}</li>`)
  });
}
/**
 * Establece el precio y el stock del producto buscado y alterna su visibilidad.
 * @param {string} precio 
 * @param {string} stock 
 */
function pintarPrecioYStock(precio,stock) {
  $('#precio').text(precio);
  $('#stock').text(stock);
  $('#divPrecioStock').toggleClass('hidden');
}
/**
 * 
 * @returns {Array} array de productos del localstorage
 */
 function getItems() {
  const productos = localStorage.getItem('productos');
  return productos ? JSON.parse(productos) : []; 
}
/**
 * Establece el array de productos en el localstorage
 * @param {Array} arrayProductosActualizado 
 */
 function setItems(arrayProductosActualizado) {
  localStorage.setItem('productos',JSON.stringify(arrayProductosActualizado));
  
}
/**
 * 
 * @param {Array} datosLocalStorage 
 * @param {string} nombreProducto 
 * @returns {boolean} true si el producto ya existe en el localstorage, false si no existe
 */
function existeProducto(datosLocalStorage, nombreProducto) {
  for (let producto of datosLocalStorage) {
    if (producto.nombre === nombreProducto) {
      return true;
    }
  }
  return false; 
}
/**
 * Limpia los elementos de la pagina, se utilizara
 * cuando se busque un nuevo producto
 */
function limpiar(){
  $('#imagen').toggleClass('hidden');
  $('#descripcion').text("");
  $('#divPrecioStock').toggleClass('hidden');
  $('#nombre').text("");

}

