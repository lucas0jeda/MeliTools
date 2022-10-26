let cliente = JSON.parse(localStorage.getItem("cliente"))
let privateInfo = JSON.parse(cliente.private_info)
let DivResponse = document.querySelector("#_divReponse")
let MLUsRemotosCliente = []

const bodyRequestGET = (token) => {
    return (
        {
            "method": 'GET',
            "headers": {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + token
            }
        }
    )
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#_userAccessToken").innerHTML = privateInfo.access_token
    document.querySelector("#_userId").innerHTML = privateInfo.user_id
    DivResponse = document.querySelector("#_divReponse")  
});

async function listPublicaciones(offset, userId, token) {
    let res = await fetch("https://api.mercadolibre.com/users/"+ userId +"/items/search?offset=" + offset, bodyRequestGET(token))
    let data = await res.json()
    let lista = data["results"]
    if (lista === undefined || lista.length === 0) {    
        //document.querySelector("#MLUStotales").innerHTML = MLUsRemotosCliente.length
        //document.querySelector("#_controlers").setAttribute("style", "display: block;")
        return;
    }
    lista.forEach(element => {
        DivResponse.innerHTML += "<p id="+ element +">"+ element + "</p>"
        MLUsRemotosCliente.push(element);
    });
    return await listPublicaciones(offset + 50, userId, token)
}

document.querySelector("#_buscarEnMeli").addEventListener("click", (e) => {
    e.preventDefault()
    if(privateInfo.access_token == undefined || privateInfo.user_id == undefined){
        return
    }
    listPublicaciones(0, privateInfo.user_id, privateInfo.access_token)
    console.log(MLUsRemotosCliente);
})

document.querySelector("#_refrestoken").addEventListener("click", async (e) => {
    e.preventDefault()
    console.log(localStorage.getItem("userId"))
    console.log(localStorage.getItem("userAccessToken"))
    console.log(localStorage.getItem("codigoClienteFenicio"))
    alert("Token actualizado correctamente")
})