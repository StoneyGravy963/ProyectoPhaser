class Pausa {
    constructor(scene,player) {
        this.scene = scene;
        this.player = player;
        this.esc = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.isPaused = false;
        this.texto = scene.add.text(
            scene.physics.world.bounds.width / 2, 
            scene.physics.world.bounds.height / 2, 
            'PAUSA', 
            {
                fontSize: '64px',
                fill: '#fff'
            }
        ).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(10);
    }


    activarPausa() {
        if (Phaser.Input.Keyboard.JustDown(this.esc)) {
            if (this.isPaused) {
                this.scene.physics.resume();
                this.scene.tweens.resumeAll();
                this.isPaused = false;
                this.texto.setVisible(false);
                this.player.sprite.anims.resume()
                console.log("despausa");
            } else {
                this.scene.physics.pause();
                this.scene.tweens.pauseAll();
                this.isPaused = true;
                this.texto.setVisible(true);
                this.player.sprite.anims.pause(); 
                this.player.sprite.anims.play('turn');
                console.log("pausa");
            }
        }
        return this.isPaused;
    }

}