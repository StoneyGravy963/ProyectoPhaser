class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    preload() {
        this.load.video('gameOverBg', 'recursos/assets/gOver-bg.mp4'); 
        this.load.image('gameOverBar', 'recursos/assets/gOver.png');
        this.load.image('menuButton', 'recursos/assets/boton.png'); 
        this.load.image('menuButtonHover', 'recursos/assets/boton-hover.png'); 
        this.load.spritesheet('efecto', 'recursos/assets/gOver-efecto1.png', { frameWidth: 144, frameHeight: 98 });
    }

    create() {
        // Fondo
        let video = this.add.video(0, 0, 'gameOverBg').setOrigin(0);
        video.setScale(1.6);
        video.play(true);

        // Barra  GAME OVER
        this.gameOverBar = this.add.tileSprite(550, 200, 1200, 89, 'gameOverBar').setOrigin(0.5);

        // Botón de "Menú Principal"
        let menuButton = this.add.image(550, 500, 'menuButton').setOrigin(0.5).setInteractive();


        let efectoSeleccionar = this.add.sprite(130, 500, 'efecto').setOrigin(0.5).setAlpha(0).setScale(3.2); 

 
        this.anims.create({
            key: 'efecto-seleccionar',
            frames: this.anims.generateFrameNumbers('efecto', { start: 0, end: 4 }),
            frameRate: 10,     
            repeat: -1          
        });


        menuButton.on('pointerover', () => {
            menuButton.setTexture('menuButtonHover');
            menuButton.setScale(1.1);

  
            efectoSeleccionar.setAlpha(1);
            efectoSeleccionar.anims.play('efecto-seleccionar');
        });

        menuButton.on('pointerout', () => {
            menuButton.setTexture('menuButton');
            menuButton.setScale(1);


            efectoSeleccionar.setAlpha(0);
            efectoSeleccionar.anims.stop();
        });

        menuButton.on('pointerdown', () => {
            this.tweens.add({
                targets: menuButton,
                scaleX: 0.9,
                scaleY: 0.9,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    // Reiniciar juego
                    if (window.game) {
                        try {
                            window.game.destroy(true);
                        } catch (e) {
                            console.error("Error:", e);
                        }
                        window.game = null;
                    }
                    window.location.href = 'index.html';
                }
            });
        });
    }

    update() {
        this.gameOverBar.tilePositionX += 0.5;
    }
}
