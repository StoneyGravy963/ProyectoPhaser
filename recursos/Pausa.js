class Pausa {
    constructor(scene) {
        this.scene = scene;
        this.esc = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.isPaused = false;
        this.texto = scene.add.text(
            scene.physics.world.bounds.width / 2, 
            scene.physics.world.bounds.height / 2, 
            'PAUSED', 
            {
                fontSize: '64px',
                fill: '#fff'
            }
        ).setOrigin(0.5).setVisible(false).setScrollFactor(0);
    }

    activarPausa() {
        if (Phaser.Input.Keyboard.JustDown(this.esc)) {
            if (this.isPaused) {
                this.scene.physics.resume();
                this.isPaused = false;
                this.texto.setVisible(false);
                console.log("despausa");
            } else {
                this.scene.physics.pause();
                this.isPaused = true;
                this.texto.setVisible(true);
                console.log("pausa");
            }
        }
        return this.isPaused;
    }

    destroy() {
        this.texto.destroy();
    }
}