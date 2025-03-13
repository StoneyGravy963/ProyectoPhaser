const config = {
    type: Phaser.AUTO,
    width: 1100,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false

        }
    },
    scene: [Juego,GameOver,Boss] 
};

const game = new Phaser.Game(config);
