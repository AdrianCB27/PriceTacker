
$("#boton").on("click", function () {
  const url = $("#producto").val().trim();
  const encodedUrl = encodeURIComponent(url);

  fetch(`http://localhost:3001/api/${encodedUrl}`)
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Lol que mal"));
});
