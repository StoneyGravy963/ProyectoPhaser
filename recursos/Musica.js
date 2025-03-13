class Musica {
    constructor(scene, musica) {
        this.scene = scene;
        this.musica = musica; 
        this.muteado = false;
        //icono a la derecha
        this.icono = this.scene.add.image(
            this.scene.cameras.main.width - 30, //x,y
            30, 
            'prendido' 
        ).setOrigin(1, 0) //origen en espejo
         .setScrollFactor(0) 
         .setDepth(10) 
         .setScale(0.1) // tam de la bocinita
         .setInteractive(); 

        this.icono.on('pointerdown', this.toggleMute, this);
    }

    toggleMute() {
        if (this.muteado) {
            this.musica.setMute(false); 
            this.icono.setTexture('prendido'); 
            this.muteado = false;
        } else {
            this.musica.setMute(true); // Mutear
            this.icono.setTexture('muteado'); 
            this.muteado = true;
        }
    }

}