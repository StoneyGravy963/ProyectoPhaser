class Boss extends Phaser.Scene {
    constructor() {
        super({ key: 'Boss' });
    }
    init(data) {
        
        this.score = data.score || 0;
        this.vidas = data.vidas || 3;
    }

    preload() {
        this.load.image('back', './recursos/assets/sky.png'); 
        this.load.image('ground', './recursos/assets/platform.png');   
        this.load.spritesheet('dude', './recursos/assets/caballero-der.png', { frameWidth: 192, frameHeight: 95 });
        this.load.image('attack', './recursos/assets/star.png'); 
        this.load.image('dragon', './recursos/assets/bomb.png');      
        this.load.image('fuego', './recursos/assets/star.png');   
    }

    create() {
        this.add.image(550, 350, 'back'); 
        this.physics.world.setBounds(0, 0, 1400, 700);

        // plataformas
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(550, 700, 'ground').setScale(3).refreshBody(); 
        this.platforms.create(200, 500, 'ground'); 
        this.platforms.create(900, 500, 'ground'); 
        this.platforms.create(550, 400, 'ground'); 

    
        this.player = new Player(this, 100, 600);
        this.cameras.main.startFollow(this.player.sprite, false,0.2);
        // vidas que tenia
        this.player.sprite.vidas = this.vidas;

        // score y vidas
        this.scoreText = this.add.text(16, 16, 'Score: ' + this.score, { 
            fontSize: '32px', 
            fill: '#000' 
        }).setScrollFactor(0); 

        this.vidasText = this.add.text(16, 50, 'Vidas: ' + this.vidas, { 
            fontSize: '32px',
            fill: '#000'
        }).setScrollFactor(0);

        // dragon
        this.dragon = this.physics.add.sprite(550, 400, 'dragon'); 
        this.dragon.setCollideWorldBounds(true);
        this.dragon.vida = 5; 
        this.dragon.setScale(3); 
        this.dragon.body.setAllowGravity(false);
        this.dragon.angle = 0;

        // fuego
        this.fuegos = this.physics.add.group({
            defaultKey: 'fuego',
            maxSize: 10 
        });

        // lanzar fuego cada 2 seg
        this.time.addEvent({
            delay: 2000, 
            callback: this.lanzarfuego,
            callbackScope: this,
            loop: true
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player.sprite, this.platforms);
        this.physics.add.overlap(this.player.sprite, this.fuegos, this.hitPlayer, null, this);
        this.physics.add.overlap(this.player.sprite, this.dragon, this.hitPlayer, null, this);
        this.physics.add.overlap(this.player.ataque, this.dragon, this.hitDragon, null, this);
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.sprite.setVelocityX(-160);
            this.player.sprite.setFlipX(true);
            this.player.sprite.anims.play('left', true);
            this.player.sprite.voltear = false;
        } else if (this.cursors.right.isDown) {
            this.player.sprite.setVelocityX(160);
            this.player.sprite.setFlipX(false);
            this.player.sprite.anims.play('right', true);
            this.player.sprite.voltear = true;
        } else {
            this.player.sprite.setVelocityX(0);
            this.player.sprite.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.sprite.body.touching.down) {
            this.player.sprite.setVelocityY(-330);
        }
        this.player.uPataque();
        // Movimiento circular del dragon
    
        this.dragon.angle += 1; //vel giro
        const radio = 200; 
        const centerX = 500; 
        const centerY = 250; 
        this.dragon.x = centerX + Math.cos(this.dragon.angle * Math.PI / 180) * radio;
        this.dragon.y = centerY + Math.sin(this.dragon.angle * Math.PI / 180) * radio;

        // Limpiar fuegos fuera de pantalla
        this.fuegos.getChildren().forEach(fuego => {
            if (fuego.x < 0 || fuego.x > 1400 || fuego.y < 0 || fuego.y > 700) {
                fuego.setActive(false);
                fuego.setVisible(false);
            }
        });
    }
    lanzarfuego() {
        
        for (let i = 0; i < 3; i++) {
            let fuego = this.fuegos.get(this.dragon.x, this.dragon.y);
            if (fuego) {
                fuego.setActive(true).setVisible(true);
                
                let dx = this.player.sprite.x - this.dragon.x;
                let dy = this.player.sprite.y - this.dragon.y;
                let distancia = Math.sqrt(dx * dx + dy * dy);
                let velocidad = 300; //Vel
                let vx = (dx / distancia) * velocidad;
                let vy = (dy / distancia) * velocidad;
                //agregar mas random pa que no sea preciso
                vx += Phaser.Math.Between(-100, 100);
                vy += Phaser.Math.Between(-100, 100);
                fuego.setVelocity(vx, vy);
            }
        }
    }

    hitPlayer(player, fuegos) {
        if (!player.inmune && this.vidas > 0) {
            this.vidas--;
            this.vidasText.setText('Vidas: ' + this.vidas);

            player.inmune = true;
            player.setAlpha(0.5);

            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    player.inmune = false;
                    player.setAlpha(1);
                },
                callbackScope: this
            });

            fuegos.setActive(false).setVisible(false);

            // Perder
            if (this.vidas <= 0) {
                this.physics.pause();
                this.scene.pause();
                player.setTint(0xff0000);
                player.anims.play('turn');
                this.scene.launch('GameOver');
            }
        }
    }

    hitDragon(attack, dragon) {
        dragon.vida--;
        attack.setVisible(false);
        attack.disableBody(true, true);

        if (dragon.vida <= 0) {
            dragon.destroy();
            this.score += 100; // matar al jefe
            this.scoreText.setText('Score: ' + this.score);
        }
    }
}