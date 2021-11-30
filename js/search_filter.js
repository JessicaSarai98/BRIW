
document.getElementById("inputSearch").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    search_filter();
  }
});
var results;
var rawData;
var esp_elements;
var auth_elements;
var image_elements;

function search_filter() {
  results = null;
  let palabraBuscar = document.getElementById("inputSearch").value;
  let wrapper = document.getElementById('search_filter_container');
  let urlBusqueda = `php/Search.php?request=${palabraBuscar}`;
  let filters = '';
  let document_index = 0;
  esp_elements = [];
  auth_elements = [];
  image_elements = [];

  wrapper.innerHTML = '';
  get(urlBusqueda).then(function (response) {
    results = JSON.parse(JSON.parse(response));
    rawData = results;
    console.log(results['response']['docs']);
    results['response']['docs'].forEach(element => {
      let author_tag = element['attr_meta'][35];
      // let lenguaje_tag = element['attr_meta'][47];
      // let lenguaje_tag = element['attr_meta'][51];
      let lenguaje_tag = element['attr_content_language'];
      // console.log(element['attr_content_language']);
      let image_tag = element['attr_meta'][0];

      if (typeof author_tag !== 'undefined') {
        auth_elements.push(document_index);
      }
      
      if ((typeof lenguaje_tag !== 'undefined') && (lenguaje_tag == 'es')) {
        esp_elements.push(document_index);
      }

      if ((typeof image_tag !== 'undefined') && (image_tag == 'og:image')) {
        image_elements.push(document_index);
      }

      document_index++;
    })

    filters = `<div class="filters-container">
                <button onclick="filteredTable('esp')">Español(${esp_elements.length})</button>
                <button onclick="filteredTable('auth')">Autor(${auth_elements.length})</button>
                <button onclick="filteredTable('image')">Imagenes(${image_elements.length})</button>
              </div>`;

    wrapper.innerHTML = filters;

  }, function (error) {
    alert("Se ha producido un error, intente más tarde.")
  })
}

function initializeFilteredTable(data) {
  documents = data;
    console.log(data);

  let weights = 1//data.debug.explain;

  var table = document.createElement("table");
  var thead = table.createTHead();
  var tbody = table.createTBody();
  var col = [];
  var table_content = "";
  var tam = data.length;

  if (documents.length > 0) {
    var cabecera = thead.insertRow(-1);
    var titulos = ['Título', 'Descripción', 'Puntaje'];
    for (var i = 0; i < 3; i++) {
      var th = document.createElement("th");
      th.innerHTML = titulos[i];
      cabecera.appendChild(th);
    }

    //console.log(documents);

    for (var i = 0; i < tam; i++) {
      tr = tbody.insertRow(-1);
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = ((typeof(documents[i]['attr_og_title']) != "undefined") ? documents[i]['attr_og_title'][0] : documents[i]['attr_title'][0]);
      tabCell = tr.insertCell(-1);
      tabCell.innerHTML = rawData['highlighting'][documents[i]['id']]['attr_text'][0];
      tabCell = tr.insertCell(-1);
      tabCell.innerHTML = rawData['debug']['explain'][documents[i]['id']]['value'];
    }

  } else {
    table.innerHTML = "No se encontraron resultados";
  }
  return table;
}

function filteredTable(type) {
  data = results;
  let documents = [];

  switch (type) {
    case 'esp':
      esp_elements.forEach(element => {
        documents.push(data['response']['docs'][element]);
      });
      break;
    case 'auth':
      auth_elements.forEach(element => {
        documents.push(data['response']['docs'][element]);
      });
      break;
    case 'image':
      image_elements.forEach(element => {
        documents.push(data['response']['docs'][element]);
      });
      break;
  }

  let foo = document.getElementById("resultados");
  var table = initializeFilteredTable(documents);
  foo.innerHTML = "";
  foo.appendChild(table);
}