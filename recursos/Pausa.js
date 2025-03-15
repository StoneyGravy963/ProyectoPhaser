class Pausa {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.esc = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.isPaused = false;
        
        // Reemplazar texto con imagen y añadir botón para quitar la pausa
        this.pausaImagen = scene.add.image(
            scene.physics.world.bounds.width / 2, 
            scene.physics.world.bounds.height / 2, 
            'pausaImagen'  // Debes asegurarte de cargar esta imagen en preload()
        ).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(10);

        // Botón interactivo
        this.botonReanudar = scene.add.image(
            scene.physics.world.bounds.width / 2, 
            scene.physics.world.bounds.height / 2 + 100, 
            'botonReanudar'  // Debes asegurarte de cargar esta imagen en preload()
        ).setOrigin(0.5).setVisible(false).setInteractive().setScrollFactor(0).setDepth(11);

        this.botonReanudar.on('pointerdown', () => {
            this.despausar();
        });
    }

    activarPausa() {
        if (Phaser.Input.Keyboard.JustDown(this.esc)) {
            if (this.isPaused) {
                this.despausar();
            } else {
                this.pausar();
            }
        }
        return this.isPaused;
    }

    pausar() {
        this.scene.physics.pause();
        this.scene.tweens.pauseAll();
        this.isPaused = true;
        this.pausaImagen.setVisible(true); // Mostrar imagen de pausa
        this.botonReanudar.setVisible(true); // Mostrar el botón de reanudar
        this.player.sprite.anims.pause(); 
        console.log("pausa");
    }

    despausar() {
        this.scene.physics.resume();
        this.scene.tweens.resumeAll();
        this.isPaused = false;
        this.pausaImagen.setVisible(false); // Ocultar imagen de pausa
        this.botonReanudar.setVisible(false); // Ocultar el botón de reanudar
        this.player.sprite.anims.resume();
        console.log("despausa");
    }
}
