document.getElementById("btn").addEventListener("click", read);
document.getElementById("inputSearch").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      document.getElementById("btn").click();
    }
});

function read() {
    let palabraBuscar = document.getElementById("inputSearch").value;
    if(!palabraBuscar) {
        alert("Introduce una palabra en el buscador")
        return;
    }
    search(palabraBuscar);

}

function search(palabraBuscar){
    let urlBusqueda = 'php/Search.php?request=' + palabraBuscar;
    
    get(urlBusqueda).then(function(response) {
        // console.log(response);
      
        let tabla = initializeTable(response);
        let foo = document.getElementById("resultados");
      
        if (foo.hasChildNodes()) {
            while ( foo.childNodes.length >= 1 ){
                foo.removeChild( foo.firstChild );
            }
        }
        foo.appendChild(tabla);
      
    }, function(error) {
        alert("Se ha producido un error, intente más tarde.")
    })

}


function get(url) {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = function() {
            if (req.status == 200) {
                resolve(req.response);
            }
            else {
                reject(Error(req.statusText));
            }
        };
        req.onerror = function() {
        reject(Error("Network Error"));
        };
        req.send();
    });
}

function initializeTable(data) {
    // data = JSON.parse(data);
    data = JSON.parse(JSON.parse(data));

    // console.log(data['response']);
    documents = data['response']['docs'];
    let weights = data.debug.explain;

    var table = document.createElement("table");
    var thead = table.createTHead();
    var tbody = table.createTBody();
    var tam = data['response']['numFound'];

    if (documents.length > 0) {
        var cabecera = thead.insertRow(-1);
        var titulos = ['Título','Descripción','Puntaje'];
        for (var i = 0; i < 3; i++) {
            var th = document.createElement("th");
            th.innerHTML = titulos[i];
            cabecera.appendChild(th);
        }

        for (var i = 0; i < tam; i++) {
            tr = tbody.insertRow(-1);
            var tabCell = tr.insertCell(-1);
            // console.log(documents[i]['attr_url'][0])
            tabCell.innerHTML = '<a href="' + documents[i]['attr_url'][0] + '">' +
             documents[i]['attr_title'][0] + '</a>';
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = data['highlighting'][documents[i]['id']]['attr_text'][0];
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = data['debug']['explain'][documents[i]['id']]['value'];
        }
        
    } else {
        table.innerHTML = "Sin resultados";
    }
    return table;
}

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
