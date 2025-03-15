class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        
        // sprite

        const personajeSeleccionado = sessionStorage.getItem("personajeSeleccionado") || "P1";
        const spriteKey = personajeSeleccionado === "P1" ? 'dude' : 'dude2';
        const attackName = spriteKey === "dude" ? 'dude-ataque' : 'dude2-ataque';
        this.nomAtaque=attackName;
        this.sprite = scene.physics.add.sprite(x, y, spriteKey);
        
        this.sprite.setSize(60, 65);
        this.sprite.setScale(0.5);
        this.sprite.setBounce(0.2);
        this.sprite.setCollideWorldBounds(true);

        this.sprite.voltear = true; 
        this.sprite.inmune = false;
        this.sprite.ultimaPosicionSegura = { x: x, y: y };
        this.sprite.vidas = 3;
        this.scene.anims.remove('left');
        this.scene.anims.remove('turn');
        this.scene.anims.remove('right');
        // ataque
        this.ataque = scene.physics.add.sprite(0, 0);
        this.ataque.setVisible(false);
        this.ataque.body.setAllowGravity(false);
        this.ataque.setSize(30, 40);
        this.cooldown = 0;
        this.ataquekey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // animaciones
        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers(spriteKey, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'turn',
            frames: [{ key: spriteKey, frame: 4 }],
            frameRate: 20
        });
        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers(spriteKey, { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'dude-atacar',
            frames: this.scene.anims.generateFrameNumbers(attackName, { start: 0, end: 5 }),
            frameRate: 100,
            repeat: 0
        });
    }

    uPataque() {
        


        
        // cooldown
        if (this.cooldown > 0) {
            this.cooldown -= this.scene.sys.game.loop.delta;
        }

        // ataque
        if (Phaser.Input.Keyboard.JustDown(this.ataquekey) && this.cooldown <= 0) {
            this.sprite.play('dude-atacar');
            this.sprite.once('animationcomplete', () => {
                setTimeout(() => {
                    // this.sprite.play('turn');
                }, 0); // Retraso de 100ms
            });

            console.log("aaaaaa");
            console.log(this.sprite.voltear);
            if (this.sprite.voltear === false) { // Izquierda
                this.ataque.setPosition(this.sprite.x - 20, this.sprite.y);
            } else if (this.sprite.voltear === true) { // Derecha
                this.ataque.setPosition(this.sprite.x + 20, this.sprite.y);
            }
            this.ataque.setVisible(false);
            this.ataque.enableBody(true, this.ataque.x, this.ataque.y, true, true);
            this.ataque.setVelocityX(this.sprite.body.velocity.x);

            //Dura 1 seg el ataque
            this.scene.time.addEvent({
                delay: 100,
                callback: () => {
                    this.ataque.setVisible(false);
                    this.ataque.disableBody(true, true);
                },
                callbackScope: this.scene
            });
            
            this.cooldown = 1000;
        }
    }
}