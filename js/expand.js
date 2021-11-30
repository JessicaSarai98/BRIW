// expand()
console.log("expandiiiiiiiiiiiir")

document.getElementById("btn").addEventListener("click", expand);
// document.getElementById("inputSearch").addEventListener("keydown", function(event) {
//     if (event.key === "Enter") {
//       // document.getElementById("btn").click();
//     }
// });
 


function expand() {
    let palabraBuscar = document.getElementById("inputSearch").value;
    var wrapper = document.getElementById('expand');
    wrapper.innerHTML = '';
    if (palabraBuscar.length>0) {
      let urlBusqueda = 'php/expand.php?e=' + palabraBuscar;
        // console.log("expansion")

      get(urlBusqueda).then(function(response) {
        let docs = JSON.parse(response);
        console.log("expansion")
        console.log(docs)

        const searchResultsContainer = document.createElement('div');
        searchResultsContainer.setAttribute('class', 'expandiv');

        // var title = document.createTextNode("Tambien te puede interesar        ");;
        
        if(docs.length>0){
        let h1 = document.createElement('p');
        h1.setAttribute('class', 'expandTitle');
        h1.textContent = "Tambien te puede interesar        ";

        wrapper.appendChild(searchResultsContainer);
        searchResultsContainer.appendChild(h1);
        }
        docs.forEach((element,index) => { 
            var button = document.createElement("input");
              button.type="button";
              button.value =element.word;
              button.setAttribute('class', 'expand');
              button.onclick=function(){ 
                  console.log(element.word)
                  pickExpand(element.word)
              }

 
          wrapper.appendChild(searchResultsContainer);
          searchResultsContainer.appendChild(button);
          });
 
          

      }, function(error) {
          alert("Se ha producido un error, intente más tarde.")
      })
    }

}

function pickExpand(word) {
  document.getElementById("inputSearch").value = word;
  document.getElementById("btn").click();
  var wrapper = document.getElementById('autoComplete');
  wrapper.innerHTML = '';

}
