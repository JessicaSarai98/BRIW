document.getElementById("btn").addEventListener("click", scrapping);
fetch('urls.txt')
  .then(res => res.text())
  .then(content => {
    document.getElementById("textArea").value = content;
});

function scrapping() {
    var lines = document.getElementById("textArea").value.split('\n');
    var urls = "";
    for(var i = 0; i < lines.length;i++){
        if (i==0) {
            urls = lines[i];
        } else {
            urls = urls + "," + lines[i];
        }
    }
    let urlScrapping = 'php/WebScrapping.php?urls=' + urls;
    get(urlScrapping).then(function(response) {
        console.log("response",response);
        alert("Resultados indizados");
    }, function(error) {
        alert("Se ha producido un error, intente más tarde.");
    });
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