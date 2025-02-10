function login(action){
    let popup = document.getElementById("popuplogin");

    if (action === "show") {
        popup.style.display = "block";
    } else if (action === "hide") {
        popup.style.display = "none";
    }
}

function register(action){
    let popupReg = document.getElementById("popupregister");
    let popupLog = document.getElementById("popuplogin");

    if (action === "show") {
        popupReg.style.display = "block";
        popupLog.style.display = "none"
    } else if (action === "hide") {
        popupReg.style.display = "none";
    }
}

function changeGeschlecht(action) {
    let maennlich = document.getElementById('maennlich');
    let weiblich = document.getElementById('weiblich');
    let divers = document.getElementById('divers');

    if(action === 'm'){
        maennlich.checked = true;
        weiblich.checked = false;
        divers.checked = false;
    }else if(action === 'w'){
        maennlich.checked = false;
        weiblich.checked = true;
        divers.checked = false;
    }else if(action === 'd'){
        maennlich.checked = false;
        weiblich.checked = false;
        divers.checked = true;
    }
}