let UserAccessToken = document.querySelector("#_token")
let UserId = document.querySelector("#_userId")
let CategoryId = document.querySelector("#_categoryId")
let DivResponse = document.querySelector("#_response")
let MLUSmeli = []
let MLUSmeliFilter = []
let MLUSDuplicados = []

document.addEventListener("DOMContentLoaded", () => {
    UserAccessToken = document.querySelector("#_token")
    UserId = document.querySelector("#_userId")
    CategoryId = document.querySelector("#_categoryId")
    DivResponse = document.querySelector("#_response")
});

 
async function copyTextToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        alert('Text copied to clipboard');
    } catch (err) {
        console.error('Error in copying text: ', err);
    }
}

async function listAll(offset, userId, token) {
    let body = {}
    if(token != ''){
        body = {
            "method": 'GET',
            "headers": {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + token
            }
        }
        let res = await fetch("https://api.mercadolibre.com/users/"+ userId +"/items/search?offset=" + offset, body)
        let data = await res.json()
        let lista = data["results"]
        if (lista === undefined || lista.length === 0) {    
          document.querySelector("#MLUStotales").innerHTML = MLUSmeli.length
          document.querySelector("#_controlers").setAttribute("style", "display: block;")
          return;
        }
        lista.forEach(element => {
            DivResponse.innerHTML += "<p id="+ element +">"+ element + "</p>"
            MLUSmeli.push(element);
        });
    }else{
      alert("No token");
      return;
    }
    return await listAll(offset + 50, userId, token)
}

async function listItemsMoreMil(userId, token, scroll = '') {
    let body = {}
    let resultScroll = scroll
    console.log(resultScroll)
    if(token != ''){
        body = {
            "method": 'GET',
            "headers": {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + token
            }
        }
        let res = await fetch("https://api.mercadolibre.com/users/"+ userId +"/items/search?search_type=scan&limit=100&scroll_id="+ scroll, body)
        let data = await res.json()
        let lista = data["results"]
        resultScroll = data["scroll_id"]
        if (lista === undefined || lista.length === 0) {    
          document.querySelector("#MLUStotales").innerHTML = MLUSmeli.length
          document.querySelector("#_controlers").setAttribute("style", "display: block;")
          return;
        }
        lista.forEach(element => {
            DivResponse.innerHTML += "<p id="+ element +">" + element + "</p>"
            MLUSmeli.push(element);
        });
    }else{
      alert("No token");
      return;
    }
    return await listItemsMoreMil(userId, token, resultScroll)
}

async function listByCategory(offset, userId, category, token) {
    let body = {}
    if(token != ''){
        body = {
            "method": 'GET',
            "headers": {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + token
            }
        }
        let res = await fetch("https://api.mercadolibre.com/sites/MLU/search?seller_id="+ userId +"&category=" + category + "&offset=" + offset, body)
        let data = await res.json()
        let lista = data["results"]
        if (lista === undefined || lista.length === 0) {
            document.querySelector("#MLUStotales").innerHTML = MLUSmeli.length
            document.querySelector("#_controlers").setAttribute("style", "display: block;")
            return;
        }
        lista.forEach(element => {
            DivResponse.innerHTML += "<p id="+ element["id"] +">" + element["id"] + "</p>"
            console.log("ID: " + element["id"] + " - Category ID: " + element["category_id"])
            MLUSmeli.push(element["id"])
        });
    }else{
        alert("no token");
        return;
    }
    return await listByCategory(offset + 50, userId, category, token)
}

async function checkStatus(mlu, tope, pos, token) {
    if(pos >= tope){
        return;
    }
    let body = {}
    if(token != ''){
        body = {
            "method": 'GET',
            "headers": {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + token
            }
        }
        let res = await fetch("https://api.mercadolibre.com/items/" + mlu, body)
        let data = await res.json()
        console.log(mlu + " - " + data["status"]);
        document.querySelector("#" + data["id"]).setAttribute("class", data["status"])
    }
    return await checkStatus(MLUSmeli[pos+1], tope, pos+1, token);
}

async function checkStatusDuplicated(mlu, tope, pos, token) {
    if(pos >= tope){
        return;
    }
    let body = {}
    if(token != ''){
        body = {
            "method": 'GET',
            "headers": {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + token
            }
        }
        let res = await fetch("https://api.mercadolibre.com/items/" + mlu, body)
        let data = await res.json()
        console.log(mlu + " - " + data["status"]);
        document.querySelector("#" + data["id"]).setAttribute("class", data["status"])
    }
    return await checkStatusDuplicated(MLUSDuplicados[pos+1], tope, pos+1, token);
}

async function checkRequiredAtributtes(mlusCategory, tope, pos, token) {
    if(pos >= tope){
        return;
    }
    let body = {}
    if(token != ''){
        body = {
            "method": 'GET',
            "headers": {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + token
            }
        }
        let res = await fetch("https://api.mercadolibre.com/categories/"+ mlusCategory[pos] +"/attributes", body)
        let data = await res.json()
        DivResponse.innerHTML += "<p style='color: white; background-color: #196F3D;'>" + mlusCategory[pos] + "</p>"
        DivResponse.innerHTML += "<ul>"
        data.forEach(element => {     
            if(element["hierarchy"] == "PARENT_PK" || element["tags"]["required"] || element["tags"]["catalog_required"]){
                switch(element["value_type"]){
                    case "string":
                        DivResponse.innerHTML += "<li>" + element["id"] + " - " + element["name"] +" - Texto</li><hr>" 
                        break;
                    case "list":
                        DivResponse.innerHTML += "<li>" + element["id"] + " - " + element["name"] + " - Lista"
                        DivResponse.innerHTML += "<ul>"
                        element["values"].forEach(val => {
                            DivResponse.innerHTML  += "<li>"+ val["name"] +"</li>"
                        })
                        DivResponse.innerHTML += "</ul>"
                        DivResponse.innerHTML  += "</li><hr>"
                        break;
                    case "number_unit":
                        DivResponse.innerHTML += "<li>" + element["id"] + " - " + element["name"] + " - Numero + Unidad de medida"
                        DivResponse.innerHTML  += "<ul>"
                        element["allowed_units"].forEach(unit => {
                            DivResponse.innerHTML  += "<li>"+ unit["name"] +"</li>"
                        }) 
                        DivResponse.innerHTML  += "</ul>"
                        DivResponse.innerHTML += "</li><hr>" 
                        break;
                    case "number":
                        DivResponse.innerHTML += "<li>" + element["id"] + " - " + element["name"] +" - Solo numeros</li><hr>" 
                        break;
                    case "boolean":
                        DivResponse.innerHTML += "<li>" + element["id"] + " - " + element["name"] +" - Si o No</li><hr>" 
                        break;
                } 
            }   
        }) 
        DivResponse.innerHTML += "</ul>"
    }
    return await checkRequiredAtributtes(mlusCategory, tope, pos+1, token);
}

async function checkAllAtributtes(mlusCategory, tope, pos, token) {
    if(pos >= tope){
        return;
    }
    let body = {}
    if(token != ''){
        body = {
            "method": 'GET',
            "headers": {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + token
            }
        }
        let res = await fetch("https://api.mercadolibre.com/categories/"+ mlusCategory[pos] +"/attributes", body)
        let data = await res.json()
        DivResponse.innerHTML += "<p style='color: white; background-color: #196F3D;'>" + mlusCategory[pos] + "</p>"
        DivResponse.innerHTML += "<ul>"
        data.forEach(element => {
            if(!element["tags"]["hidden"]){
                switch(element["value_type"]){
                    case "string":
                        DivResponse.innerHTML += "<li>" + element["id"] + " - " + element["name"] +" - Texto</li><hr>" 
                        break;
                    case "list":
                        DivResponse.innerHTML += "<li>" + element["id"] + " - " + element["name"] + " - Lista"
                        DivResponse.innerHTML += "<ul>"
                        element["values"].forEach(val => {
                            DivResponse.innerHTML  += "<li>"+ val["name"] +"</li>"
                        })
                        DivResponse.innerHTML += "</ul>"
                        DivResponse.innerHTML  += "</li><hr>"
                        break;
                    case "number_unit":
                        DivResponse.innerHTML += "<li>" + element["id"] + " - " + element["name"] + " - Numero + Unidad de medida"
                        DivResponse.innerHTML  += "<ul>"
                        element["allowed_units"].forEach(unit => {
                            DivResponse.innerHTML  += "<li>"+ unit["name"] +"</li>"
                        }) 
                        DivResponse.innerHTML  += "</ul>"
                        DivResponse.innerHTML += "</li><hr>" 
                        break;
                    case "number":
                        DivResponse.innerHTML += "<li>" + element["id"] + " - " + element["name"] +" - Solo numeros</li><hr>" 
                        break;
                    case "boolean":
                        DivResponse.innerHTML += "<li>" + element["id"] + " - " + element["name"] +" - Si o No</li><hr>" 
                        break;
                }
            }    
        }) 
        DivResponse.innerHTML += "</ul>"
    }
    return await checkAllAtributtes(mlusCategory, tope, pos+1, token);
}

function checkDuplicated(mlusMeli, mlusFenicio){
    DivResponse.innerHTML = ""
    for(let i = 0; i <= mlusMeli.length; i++){
        if(i <= mlusMeli.length){
            if(!mlusFenicio.includes(mlusMeli[i])){
                DivResponse.innerHTML += "<p id="+ mlusMeli[i] + ">" + mlusMeli[i]  + "</p>"
                MLUSDuplicados.push(mlusMeli[i])
            }
        }else{
            console.log("ML length: " + mlusMeli.length);
            console.log("FN length: " + mlusFenicio.length);
            console.log("i: " + i);
            alert("fin");
            break;
        }
    }
}

async function pausedDuplicated(mlu, tope, pos, token) {
    if(tope == pos){
      alert("Fin pausado");
      return;
    }
    if(pos == 1500){
      alert("Fin pausado - limite de request alcanzado (1500)");
      return;
    }
    let PUTpaused = {}
    if(token != ''){
        PUTpaused = {  
            method: 'PUT',
            headers: {
              'Accept': '*/*',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token 
            },
            body: JSON.stringify({
                "status": "paused"
            })
        }
        let res = await fetch("https://api.mercadolibre.com/items/" + mlu, PUTpaused)
        let data = await res.json()
        if(pos == 1){
            console.log(data);
        }
        console.log(mlu + " - " + data["status"]);
    }
    return await pausedDuplicated(MLUSDuplicados[pos++], tope, pos++);
}


function filterByStatus(){
    MLUSmeliFilter.length = 0;
    let allElements = document.querySelectorAll("p")
    let status = document.querySelector("#_statusFilter").value
    allElements.forEach(element => {
        if(status != 'all'){
            if(element.className == status && element.className != ''){
                MLUSmeliFilter.push(element.innerHTML);
                element.setAttribute("style", "display: block;")
            }else if(element.className != status && element.className != ''){
                element.setAttribute("style", "display: none;")
            }
        }else{
            MLUSmeliFilter.length = 0;
            element.setAttribute('style', "display: block;")
        }  
    })
}


document.querySelector("#_searchFromMeli").addEventListener("click", (e) => {
    e.preventDefault()
    if(UserId.value != ''){
        console.log(UserId.value + " - " + UserAccessToken.value)
        listAll(0, UserId.value, UserAccessToken.value)
        console.log(MLUSmeli);
    }else{
        alert("no user id")
    }
})

document.querySelector("#_searchFromMeliByCategory").addEventListener("click", (e) => {
    e.preventDefault()
    if(UserId.value != '' && CategoryId.value != ''){
        MLUSmeli.length = 0
        //offset, userId, category, token
        listByCategory(0, UserId.value, CategoryId.value ,UserAccessToken.value)
        console.log(MLUSmeli);
    }else{
        alert("no user id || no category id ")
    }
})

document.querySelector("#_checkStatus").addEventListener("click", (e) => {
    e.preventDefault()
    if(MLUSmeli.length > 0){
        // mlu, tope, pos, token
        checkStatus(MLUSmeli[0], MLUSmeli.length, 0, UserAccessToken.value)
    }else{
        alert("MLUs no cargados")
    }
})

document.querySelector("#_checkStatusDuplicadas").addEventListener("click", (e) => {
    e.preventDefault()
    if(MLUSDuplicados.length > 0){
        // mlu, tope, pos, token
        checkStatusDuplicated(MLUSDuplicados[0], MLUSDuplicados.length, 0, UserAccessToken.value)
    }else{
        alert("MLUs no cargados")
    }
})

document.querySelector("#_filterByStatus").addEventListener("click", (e) => {
    e.preventDefault()
    if(MLUSmeli.length > 0){
        filterByStatus()
    }else{
        alert("MLUs no cargados")
    }
})

document.querySelector("#_copyMLUS").addEventListener("click", () => {
    let exportMLUs = {
        "active": [],
        "paused": [],
        "closed": [],
        "under_review": [],
        "No_status": []
    }
    DivResponse.childNodes.forEach((e) => { 
        switch(e.className){
            case "active": 
                exportMLUs.active.push(e.innerHTML)
                break;
            case "paused": 
                exportMLUs.paused.push(e.innerHTML)
                break;
            case "closed": 
                exportMLUs.closed.push(e.innerHTML)
                break;
            case "under_review": 
                exportMLUs.under_review.push(e.innerHTML)
                break;
            case "":
                exportMLUs.No_status.push(e.innerHTML) 
                break;
            default:
                console.log("Error status:" + e)
                break;
        }    
    })
    copyTextToClipboard(JSON.stringify(exportMLUs));
})

document.querySelector("#_searchFromMeliMoreMil").addEventListener("click", (e) => {
    e.preventDefault()
    if(UserId.value != ''){
        console.log(UserId.value + " - " + UserAccessToken.value)
        listItemsMoreMil(UserId.value, UserAccessToken.value)
        console.log(MLUSmeli);
    }else{
        alert("no user id")
    }
})

document.querySelector("#_checkRequiredAttributesForCategory").addEventListener("click", (e) => {
    e.preventDefault()
    let txtcategories = document.querySelector("#_categorysAtttibuttes").value
    let categories = txtcategories.split("\n")
    console.log("==============================")
    console.log(categories)
    console.log("==============================")
    checkRequiredAtributtes(categories, categories.length, 0, UserAccessToken.value)
})

document.querySelector("#_checkAllAttributesForCategory").addEventListener("click", (e) => {
    e.preventDefault()
    let txtcategories = document.querySelector("#_categorysAtttibuttes").value
    let categories = txtcategories.split("\n")
    console.log("==============================")
    console.log(categories)
    console.log("==============================")
    checkAllAtributtes(categories, categories.length, 0, UserAccessToken.value)
})

document.querySelector("#_printAttributes").addEventListener("click", (e) => {
    e.preventDefault()
    PrintElem("_response")
})

function PrintElem(elem){
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('<style>p{color: white; background-color: #196F3D;}</style></head><body >');
    mywindow.document.write(document.getElementById(elem).innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
}

document.querySelector("#_checkDuplicated").addEventListener("click", (e)=>{
    e.preventDefault()
    let txtMLUsFenicio = document.querySelector("#_mlusFN").value
    let MLUsFenicio = txtMLUsFenicio.split("\n")
    console.log("==============================")
    console.log(MLUsFenicio)
    console.log("==============================")
    if(MLUSmeli.length > 0 && MLUsFenicio.length > 0){
        checkDuplicated(MLUSmeliFilter, MLUsFenicio)
    }
})

document.querySelector("#_pausarDuplicadas").addEventListener("click", (e) => {
    e.preventDefault()
    if(MLUSDuplicados.length > 0){
        pausedDuplicated(MLUSDuplicados[0], MLUSDuplicados.length, 0, UserAccessToken.value)
    }
})

