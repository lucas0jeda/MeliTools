let infoCliente = []

document.addEventListener("DOMContentLoaded", () => {
    localStorage.clear()
    cargarTablaDeClientes()
});

const cargarTablaDeClientes = () => {
    let result = fetch("https://server-tools-meli.herokuapp.com/clients/")
      .then(response => response.json())
      .then((result) => {
        result["clients"].forEach(element => {
            let filaCliente = "<tr>"
            filaCliente += "<th scope='row' id=" + element["codigoFenicio"] + " class='client' onclick='seleccionarCliente(this)'>"+ element["codigoFenicio"] +"</th>"
            filaCliente += "<td>"+ element["url_babel"] +"</td>"
            filaCliente += "<td>"+ element["modulo"] +"</td>"
            filaCliente += "</tr>" 
            document.querySelector("#_bodyTablaCliente").innerHTML += filaCliente
            infoCliente[element["codigoFenicio"]] = element
        });
      })
      .catch(error => console.log('error', error));
} 


const seleccionarCliente = async (e) => {
    let rtoken = prompt("R-TOKEN")
    if(!rtoken){
        return
    }
    let result = await fetch("https://server-tools-meli.herokuapp.com/clients/" + e.innerText + "/" + rtoken)
    let data = await result.json()
    let privateInfo = JSON.stringify(data)
    let cliente = {
        "public_info": JSON.stringify(infoCliente[e.innerText]),
        "private_info": privateInfo
    }
    localStorage.setItem("cliente", JSON.stringify(cliente))
    location.assign("toolsDos.html")
}
