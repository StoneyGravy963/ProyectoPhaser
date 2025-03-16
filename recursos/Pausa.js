class Pausa {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.esc = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.isPaused = false;
        this.diferenciaX=50;


        this.video = scene.add.video(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'pausaVideo')
            .setOrigin(0.5)
            .setVisible(false)
            .setScrollFactor(0)
            .setDepth(10);

        this.video.setPosition(this.video.x-this.diferenciaX,this.video.y); 
        this.video.setScale(0.65);    

    
        this.botonReanudar = scene.add.image(scene.cameras.main.width / 2, scene.cameras.main.height / 2 - 200, 'botonReanudar')
        .setOrigin(0.5)
        .setVisible(false)
        .setInteractive()
        .setDepth(11) 
        .setScrollFactor(0);  


        this.botonReanudar.on('pointerdown', () => {
            this.reanudarJuego();
        });
    }
    

    actualizarPosicionBoton() {

        this.botonReanudar.setPosition(this.video.x, this.video.y + 100);
    }

    activarPausa() {
        if (Phaser.Input.Keyboard.JustDown(this.esc)) {
            if (this.isPaused) {
                this.reanudarJuego();
            } else {
                this.pausarJuego();
            }
        }
        return this.isPaused;
    }

    pausarJuego() {
        this.scene.physics.pause();
        this.scene.tweens.pauseAll();
        this.isPaused = true;
        this.video.setVisible(true);
        this.video.play(true);
        this.botonReanudar.setVisible(true);
        this.player.sprite.anims.pause();
        this.player.sprite.anims.play('turn');
        console.log("pausa");
    }

    reanudarJuego() {
        this.scene.physics.resume();
        this.scene.tweens.resumeAll();
        this.isPaused = false;
        this.video.setVisible(false);
        this.video.stop();
        this.botonReanudar.setVisible(false);
        this.player.sprite.anims.resume();
        console.log("despausa");
    }

    update() {
        if (this.isPaused) {
            this.actualizarPosicionBoton();
        }
    }
}
