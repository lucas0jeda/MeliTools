let UserAccessToken = localStorage.getItem("userAccessToken")
let UserId = localStorage.getItem("userId")
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
    document.querySelector("#_userAccessToken").innerHTML = localStorage.getItem("userAccessToken")
    document.querySelector("#_userId").innerHTML = localStorage.getItem("userId")
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
    if(UserId == '*' || UserAccessToken == '*'){
        return
    }
    listPublicaciones(0, UserId, UserAccessToken)
    console.log(MLUsRemotosCliente);
})