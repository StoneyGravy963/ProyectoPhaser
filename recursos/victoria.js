class Victoria extends Phaser.Scene {
    constructor() {
        super({ key: 'Victoria' });
    }

    init(data) {
        this.score = data.score || 0;
    }

    preload() {
        this.load.image('backVictoria', './recursos/assets/victoria_back.png');
    }

    create() {
        let records = JSON.parse(localStorage.getItem("records")) || [];
        const jugadorIndex = parseInt(sessionStorage.getItem("jugadorIndex"));
        const jugador = (records.length > 0 && jugadorIndex >= 0 && jugadorIndex < records.length) ? records[jugadorIndex].nombre : "Jugador";

        let background = this.add.image(600, 350, 'backVictoria').setScale(1.5);
        background.setDisplaySize(1300, 700);
        background.setAlpha(0.8); 

        let textoV = this.add.text(550, 250, `¡Felicidades! \n ${jugador}`, {
            fontFamily: 'Arial Black',
            fontSize: '64px',
            color: '#8B0000', 
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
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#FFFFFF',
            stroke: '#8B0000',
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

        let resetButton = this.add.graphics();
        resetButton.fillStyle(0x666666, 1);
        resetButton.fillRect(450, 470, 200, 60);
        resetButton.setScrollFactor(0);
        resetButton.setInteractive(new Phaser.Geom.Rectangle(475, 470, 230, 60), Phaser.Geom.Rectangle.Contains);

        this.add.text(550, 500, 'Menu Principal', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        resetButton.on('pointerover', () => {
            resetButton.clear();
            resetButton.fillStyle(0x999999, 1);
            resetButton.fillRect(450, 470, 200, 60);
        });
        resetButton.on('pointerout', () => {
            resetButton.clear();
            resetButton.fillStyle(0x666666, 1);
            resetButton.fillRect(450, 470, 200, 60);
        });
        resetButton.on('pointerdown', () => {
            if (window.game) {
                try {
                    window.game.destroy(true);
                } catch (e) {
                    console.error("Error al destruir el juego:", e);
                }
                window.game = null;
            }
            window.location.href = 'index.html';
        });
    }
}