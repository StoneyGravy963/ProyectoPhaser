let posX = -500;
let posY = -500;
const paso = 500;

window.onload = () => {
    const tablero = document.querySelector(".tablero");
    // Asegurar que la posición inicial se establece correctamente
    requestAnimationFrame(() => {
        tablero.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
    });
};

function moverCamara(direccion) {
    const tablero = document.querySelector(".tablero");

    if (direccion === "arriba") posY -= paso;
    if (direccion === "abajo") posY += paso; 
    if (direccion === "derecha") posX += paso;
    if (direccion === "izquierda") posX -= paso;

    
    posX = Math.max(-1000, Math.min(500, posX)); 
    posY = Math.max(-1500, Math.min(500, posY)); 

    tablero.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
    cambiarOpciones(direccion);
}

function cambiarOpciones(direccion) {
    const opciones = document.querySelectorAll(".opcion");

    if (direccion === "arriba") {
        opciones[0].textContent = "Nueva Partida";
        opciones[1].textContent = "Continuar";
        opciones[2].textContent = "Volver";
    } else if (direccion === "abajo") { 
        opciones[0].textContent = "Extras";
        opciones[1].textContent = "Dificultad";
        opciones[2].textContent = "Volver";
    } else if (direccion === "derecha") {
        opciones[0].textContent = "Volumen";
        opciones[1].textContent = "Controles";
        opciones[2].textContent = "Volver";
    } else if (direccion === "izquierda") {
        opciones[0].textContent = "Confirmar Salida";
        opciones[1].textContent = "Créditos";
        opciones[2].textContent = "Volver";
    }
}
