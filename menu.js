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
    // Obtener el nombre del jugador
    const nombre = document.getElementById("nombre").value.trim();

    // Validación: Solo letras, dígitos y barra baja, longitud entre 4 y 8 caracteres
    const regex = /^[a-zA-Z0-9_]{4,8}$/;

    if (!regex.test(nombre)) {
        alert("El nombre debe tener entre 4 y 8 caracteres y solo puede contener letras, números y guion bajo (_).");
        return;
    }

    const fecha = new Date().toLocaleString();
    const puntuacion = 0;

    // Cargar el array existente de records desde localStorage
    let records = JSON.parse(localStorage.getItem("records")) || [];

    // Buscar si el nombre ya existe en los records
    const jugadorExistenteIndex = records.findIndex(jugador => jugador.nombre.toLowerCase() === nombre.toLowerCase());

    if (jugadorExistenteIndex === -1) {
        // Si el jugador no existe, crear un nuevo registro
        const jugador = { nombre, fecha, puntuacion };
        records.push(jugador);
        sessionStorage.setItem("jugadorIndex", records.length - 1);
    } else {
        // Si el jugador ya existe, solo actualiza el índice en sessionStorage
        sessionStorage.setItem("jugadorIndex", jugadorExistenteIndex);
    }

    // Guardar el array actualizado en localStorage
    localStorage.setItem("records", JSON.stringify(records));

    // Guardar personaje seleccionado
    const personajeSeleccionado = sessionStorage.getItem("personajeSeleccionado") || "P1";
    sessionStorage.setItem("numeroPersonaje", personajeSeleccionado);

    // Ocultar pantalla inicial y mostrar el juego
    document.querySelector(".contenedor").style.display = "none";
    document.getElementById("contenedor-juego").style.display = "block";
    new Phaser.Game(config);
}

// Función para cargar los datos en la tabla
function cargarRecords() {
    const tablaBody = document.querySelector(".table tbody");
    tablaBody.innerHTML = ""; 

    let records = JSON.parse(localStorage.getItem("records")) || [];

    records.forEach((jugador, index) => {
        let fila = `
            <tr>
                <td>${index + 1}</td>
                <td>${jugador.nombre}</td>
                <td>${jugador.puntuacion}</td>
                <td>${jugador.fecha}</td>
            </tr>
        `;
        tablaBody.innerHTML += fila;
    });
}


document.addEventListener("DOMContentLoaded", cargarRecords);


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}


// function drop(ev, statusId) {
//     ev.preventDefault();
//     var data = ev.dataTransfer.getData("text");
//     var draggedElement = document.getElementById(data);
//     var dropZone = document.getElementById("div4");

//     dropZone.innerHTML = "";
//     dropZone.appendChild(draggedElement);
//     localStorage.setItem("personajeSeleccionado", data);
// }

function drop(ev, statusId) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const dropZone = document.getElementById("div4");

    // Si ya hay un personaje en la dropZone, devolverlo a su posición original
    if (dropZone.children.length > 0) {
        const personajeAnterior = dropZone.children[0];
        const idPersonajeAnterior = personajeAnterior.id;
        const divOriginal = document.getElementById("div" + idPersonajeAnterior.charAt(1));
        divOriginal.appendChild(personajeAnterior);
    }

    // Colocar el nuevo personaje en la dropZone
    dropZone.innerHTML = "";
    dropZone.appendChild(draggedElement);

    // Guardar el personaje seleccionado en sessionStorage (temporal)
    sessionStorage.setItem("personajeSeleccionado", data);
}

function dragEnter(statusId) {
    const dropZone = document.getElementById("div4");
    dropZone.style.backgroundColor = "lightgreen"; 
}

// function dragLeave(statusId) {
//     const dropZone = document.getElementById("div4");
//     // dropZone.style.backgroundColor = "lightgray"; 
// }



function mostrarRecords() {
    let records = JSON.parse(localStorage.getItem("records")) || [];
    records.sort((a, b) => b.puntuacion - a.puntuacion);

    const recordsContainer = document.querySelector(".pantalla-records");
    records.forEach((jugador, index) => {
        const numero = document.createElement("div");
        numero.textContent = index + 1;
        const nombre = document.createElement("div");
        nombre.textContent = jugador.nombre;
        const puntuacion = document.createElement("div");
        puntuacion.textContent = jugador.puntuacion;
        recordsContainer.appendChild(numero);
        recordsContainer.appendChild(nombre);
        recordsContainer.appendChild(puntuacion);
    });
}
/*Funciones para creditos*/
function myCanvas(canvasId, imageSrc) {
    let canvas = document.getElementById(canvasId);
    let ctx = canvas.getContext("2d");
    let img = new Image();
    img.src = imageSrc;

    img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}

window.onload = function () {
    myCanvas("canvas1", "retrato.jpg");
    myCanvas("canvas2", "retrato2.jpg");
    myCanvas("canvas3", "retrato3.png");
};

