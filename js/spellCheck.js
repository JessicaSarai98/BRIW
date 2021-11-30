document.getElementById("btn").addEventListener("click", spellCheck);

function spellCheck() {
    let palabraBuscar = document.getElementById("inputSearch").value;
    var wrapper = document.getElementById('spellCheck');
    wrapper.innerHTML = '';
      let urlBusqueda = 'php/SpellCheck.php?data=' + palabraBuscar;
      get(urlBusqueda).then(function(response) {
        
        if ( JSON.parse(response).spellcheck.suggestions.length>0) {
          let suggestions = JSON.parse(response).spellcheck.suggestions[1].suggestion;
          let suggestion = suggestions[0].word;
          let h1 = document.createElement('p');
          h1.setAttribute('class', 'correction');
          h1.setAttribute('id', suggestion);
          h1.textContent = "¿Tal vez quisiste decir "+suggestion+ "?";
          h1.addEventListener("click", correct);
          wrapper.appendChild(h1);
        }

      }, function(error) {
          alert("Se ha producido un error, intente más tarde.")
      })

}

function correct(e) {
  document.getElementById("inputSearch").value = e.target.id;
  document.getElementById("btn").click();
}
