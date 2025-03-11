const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true

        }
    },
    scene: [Juego] 
};

const game = new Phaser.Game(config);
