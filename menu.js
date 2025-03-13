let posX = -1100;
let posY = -700;
const pasoX = 1100;
const pasoY = 700;

window.onload = () => {
    const tablero = document.querySelector(".tablero");
    requestAnimationFrame(() => {
        tablero.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
    });
};

function moverCamara(direccion) {
    const tablero = document.querySelector(".tablero");

    if (direccion === "arriba") posY -= pasoY;
    if (direccion === "abajo") posY += pasoY; 
    if (direccion === "derecha") posX += pasoX;
    if (direccion === "izquierda") posX -= pasoX;
    if (direccion === "centro") {
        posX = -1100;
        posY = -700;
    }

    // Mantener dentro del tablero
    posX = Math.max(-2200, Math.min(1100, posX)); 
    posY = Math.max(-1400, Math.min(700, posY)); 

    tablero.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
}


/*Funciones para seleccion de personaje (Drag and drop & localStorage)*/
function guardarDatos() {
    localStorage.nombre = document.getElementById("nombre").value;

}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}


function drop(ev, statusId) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    var dropZone = document.getElementById("div4");

    dropZone.innerHTML = "";
    dropZone.appendChild(draggedElement);
    localStorage.setItem("personajeSeleccionado", data);
}




