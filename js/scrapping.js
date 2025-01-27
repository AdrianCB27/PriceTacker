let dataJson = {};
let cargando = false;
let datosLocalStorage=getItems()


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

    })
    .catch((error) => {
      pintarTitulo("❌😔Lo siento, ese producto no se puede trackear")
    });
});


function pintarFoto(src) {
  $('#imagen').attr('src',src);
  $('#imagen').toggleClass('hidden')
}
function pintarTitulo(titulo) {
$('#nombre').text(titulo)
}
function pintarDescripcion(descripcion){
  descripcion.forEach(elemento => {
    console.log(elemento);
    $('#descripcion').append(`<li>${elemento.desc}</li>`)
  });
}
function pintarPrecioYStock(precio,stock) {
  $('#precio').text(precio);
  $('#stock').text(stock);
  $('#divPrecioStock').toggleClass('hidden');
}
 function getItems() {
  const productos = localStorage.getItem('productos');
  return productos ? JSON.parse(productos) : []; 
}
 function setItems(arrayProductosActualizado) {
  localStorage.setItem('productos',JSON.stringify(arrayProductosActualizado));
  
}
function existeProducto(datosLocalStorage, nombreProducto) {
  for (let producto of datosLocalStorage) {
    if (producto.nombre === nombreProducto) {
      return true;
    }
  }
  return false; 
}
function limpiar(){
  $('#imagen').toggleClass('hidden');
  $('#descripcion').text("");
  $('#divPrecioStock').toggleClass('hidden');
  $('#nombre').text("");

}

