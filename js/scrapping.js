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
$("#boton").on("click", async function () {
  if (($('#nombre').text()) !== "") {
    limpiar();
  }
  
  const url = $("#producto").val().trim();
  const encodedUrl = encodeURIComponent(url);
  cargando=true;
  if (cargando) {
    console.log("Cargando");
    $('#cargando').toggleClass('hidden');
  }

  fetch(`http://localhost:3001/api/${encodedUrl}`)
    .then((response) => {
      cargando=false;
      $('#cargando').toggleClass('hidden');
      return response.json();

    })
    .then((data) => {
      console.log("Datos recibidos:", data);
      if (!existeProducto(datosLocalStorage,data.nombre)) {
        datosLocalStorage.unshift(data);
        setItems(datosLocalStorage);
      }
      pintarTitulo(data.nombre);
      pintarFoto(data.src);
      pintarDescripcion(data.desc);
      pintarPrecioYStock(data.precio,data.stock)
      pintarAlternativas(data.nombre);


    })
    .catch((error) => {
      pintarTitulo("❌😔Lo siento, ese producto no se puede trackear")
    });
});


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

