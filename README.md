# Instrucciones para Ejecutar el Proyecto Phaser

Este es un juego creado con Phaser y Node.js. Aqui te explico paso a paso cómo  descargarlo, configurarlo y ejecutarlo.
## Requisitos previos:
### 1. Node.js: 
  Es un programa que te permite ejecutar el servidor del juego. Puedes descargarlo e instalarlo desde este enlace:
    (https://nodejs.org/es).  Durante la instalación selecciona la opción "Instalar npm".

Para verificar que se instaló correctamente, abre la terminal (puedes escribir cmd en el buscador o clickear ) y escribe:
  
    node -v
Si ves un número (por ejemplo, v18.x.x), significa que está instalado. Si no, repite la instalación.

### 2. Internet:
Conexión a internet: Necesitas internet para descargar el proyecto y las dependencias al principio.

## Paso a Paso para Ejecutar el Juego
### 1. Descargar el Proyecto desde GitHub
Ve al repositorio del proyecto en GitHub: 

    https://github.com/StoneyGravy963/ProyectoPhaser
    
Haz clic en el botón verde que dice "Code"

Selecciona "Download ZIP" para descargar un archivo comprimido con todo el proyecto.
Una vez descargado, haz doble clic en el archivo .zip y extrae  su contenido en una carpeta de tu elección (Ej "Documentos).

### 2. Abrir la Terminal

Abre otra vez la terminal, en Windows puedes teclear Windows + R escribir cmd y presionar enter o buscarla en el buscador como cmd

### 3. Navegar a la Carpeta del Proyecto

En la terminal, escribe el comando "cd" seguido de la ruta donde descomprimiste la carpeta. Por ejemplo:

    cd C:\Users\TuNombre\Documentos\ProyectoPhaser-master

### 4. Instalar las Dependencias

El proyecto necesita algunas dependencias para funcionar. Para instalarlos, escribe en la terminal:

    npm install

Presiona Enter y espera a que termine. Esto descargará automáticamente todo lo necesario.

### 5. Iniciar el Servidor

Una vez instaladas las dependencias, escribe el siguiente comando para iniciar el juego:

    npm start

Presiona Enter. Deberías ver un mensaje como:

    Servidor ejecutándose en: http://localhost:3000

Esto significa que el servidor está activo.

### 6. Abrir el Juego en tu Navegador

Abre tu navegador y en la barra de direcciones, escribe:

    http://localhost:3000

Presiona Enter. Deberias de estar viendo ya el juego. Si no funciona, revisa que la terminal siga abierta y que no haya errores.

### 7. Detener el Juego

    Cuando quieras cerrar el juego, regresa a la terminal y presiona las teclas Ctrl + C juntas. 


## Alungos problemas

- "No reconoce el comando npm": Vuelve a ver si tienes instalado Node.js. Si no lo hiciste, instálalo desde (https://nodejs.org/es) y reinicia la computadora antes de intentarlo de nuevo.
- "Error 404" en el navegador: Verifica que estés usando http://localhost:3000 y que el servidor esté corriendo.
- El juego no carga: Asegúrate de que todos los archivos (como index.html, server.js, y la carpeta recursos) estén en la carpeta descomprimida.
- Terminal cerrada accidentalmente: Vuelve al Paso 2, navega a la carpeta con cd, y repite npm start.
    
    
