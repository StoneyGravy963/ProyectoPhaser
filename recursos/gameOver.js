class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    create() {
        this.add.text(550, 350, 'GAME OVER', {
            fontFamily: 'Arial',
            fontSize: '64px',
            color: '#ff0000',
            align: 'center'
        }).setOrigin(0.5);

        let resetButton = this.add.graphics();
        resetButton.fillStyle(0x666666, 1);
        resetButton.fillRect(475, 470, 150, 60);
        resetButton.setScrollFactor(0);
        resetButton.setInteractive(new Phaser.Geom.Rectangle(475, 470, 150, 60), Phaser.Geom.Rectangle.Contains);

        let resetText = this.add.text(550, 500, 'RESET', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        resetButton.on('pointerover', () => {
            resetButton.clear();
            resetButton.fillStyle(0x999999, 1);
            resetButton.fillRect(475, 470, 150, 60);
        });
        resetButton.on('pointerout', () => {
            resetButton.clear();
            resetButton.fillStyle(0x666666, 1);
            resetButton.fillRect(475, 470, 150, 60);
        });
        resetButton.on('pointerdown', () => {
            this.anims.remove('left');
            this.anims.remove('turn');
            this.anims.remove('right');
            this.scene.get('Juego').gameOver = false;
            // this.scene.stop('GameOver');
            this.scene.stop('Juego');
            this.scene.start('Juego');
        });
    }
}