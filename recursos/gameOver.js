class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    create() {
        this.add.text(400, 400, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff0000',
            align: 'center'
        }).setOrigin(0.5); 
    }
}