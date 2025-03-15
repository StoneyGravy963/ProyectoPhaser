class Victoria extends Phaser.Scene {
    constructor() {
        super({ key: 'Victoria' });
    }

    init(data) {
        this.score = data.score || 0;
    }

    preload() {
        this.load.image('backVictoria', './recursos/assets/victoria_back.png');
        this.load.image('menuButton', './recursos/assets/boton.png'); 
        this.load.image('menuButtonHover', './recursos/assets/boton-hover.png'); 
        this.load.spritesheet('efecto', './recursos/assets/gOver-efecto1.png', { frameWidth: 144, frameHeight: 98 });
    }

    create() {
        let records = JSON.parse(localStorage.getItem("records")) || [];
        const jugadorIndex = parseInt(sessionStorage.getItem("jugadorIndex"));
        const jugador = (records.length > 0 && jugadorIndex >= 0 && jugadorIndex < records.length) ? records[jugadorIndex].nombre : "Jugador";

        
        let background = this.add.image(600, 350, 'backVictoria').setScale(1.5);
        background.setDisplaySize(1300, 700);
        background.setAlpha(0.8); 

        
        let menuButton = this.add.image(550, 500, 'menuButton')
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setDepth(1); 

        
        let efectoSeleccionar = this.add.sprite(130, 500, 'efecto')
            .setOrigin(0.5)
            .setAlpha(0)
            .setScale(3.2); 
        
        
        let textoV = this.add.text(550, 250, `¡Felicidades! \n ${jugador}`, {
            fontFamily: '"Press Start 2P", sans-serif',
            fontSize: '64px',
            color: '#f5dc00', 
            stroke: '#FFFFFF', 
            strokeThickness: 6, 
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 4,
                fill: true
            },
            align: 'center'
        }).setOrigin(0.5);

        
        this.tweens.add({
            targets: textoV,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true, 
            repeat: -1, 
            ease: 'Sine.easeInOut'
        });

        
        this.add.text(550, 350, `Puntuacion: ${this.score}`, {
            fontFamily: '"Press Start 2P", sans-serif',
            fontSize: '32px',
            color: '#FFFFFF',
            stroke: '#bdaa00',
            strokeThickness: 3,
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#000000',
                blur: 2,
                fill: true
            },
            align: 'center'
        }).setOrigin(0.5);

        
        this.anims.create({
            key: 'efecto-seleccionar',
            frames: this.anims.generateFrameNumbers('efecto', { start: 0, end: 4 }),
            frameRate: 10,     
            repeat: -1          
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
}
