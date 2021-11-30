function autoComplete() {
    let palabraBuscar = document.getElementById("inputSearch").value;
    var wrapper = document.getElementById('autoComplete');
    wrapper.innerHTML = '';
    if (palabraBuscar.length>0) {
      let urlBusqueda = 'php/AutoComplete.php?data=' + palabraBuscar;
      get(urlBusqueda).then(function(response) {
        let docs = JSON.parse(response).response.docs;
        const searchResultsContainer = document.createElement('div');
        searchResultsContainer.setAttribute('class', 'row');
        for (var doc in docs) {
          if (doc>5) {
            break;
          }
          let h1 = document.createElement('p');
          h1.setAttribute('class', 'suggestion');
          h1.addEventListener("click", pick);
          h1.textContent = docs[doc].attr_title[0];
          wrapper.appendChild(searchResultsContainer);
          searchResultsContainer.appendChild(h1);
        }
      }, function(error) {
          alert("Se ha producido un error, intente más tarde.")
      })
    }

}

function pick(e) {
  document.getElementById("inputSearch").value = e.target.innerText;
  document.getElementById("btn").click();
  var wrapper = document.getElementById('autoComplete');
  wrapper.innerHTML = '';

}
