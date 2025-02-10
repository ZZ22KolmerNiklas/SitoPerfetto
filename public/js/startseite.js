function login(action){
    let popup = document.getElementById("popuplogin");

    if (action === "show") {
        popup.style.display = "block";
    } else if (action === "hide") {
        popup.style.display = "none";
    }
}
function zimmerWahl(zimmer){
    if(zimmer === 's'){
        sessionStorage.setItem("zimmerArt", "Standart");
    }else if (zimmer === 'p'){
        sessionStorage.setItem("zimmerArt", "Premium");
    }else if (zimmer === 'l'){
        sessionStorage.setItem("zimmerArt", "Luxus");
    } else{
        sessionStorage.setItem("zimmerArt", "Error");
    }
    window.location.href = "../oberflächen/zimmerBuchen.html";
}