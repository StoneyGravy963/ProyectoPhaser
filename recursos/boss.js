class Boss extends Phaser.Scene {
    constructor() {
        super({ key: 'Boss' });
    }
    init(data) {
        
        this.score = data.score || 0;
        this.vidas = data.vidas || 3;
    }

    preload() {
        this.load.image('back', './recursos/assets/background2.png'); 
        this.load.image('ground', './recursos/assets/platform.png');   
        this.load.spritesheet('dude', './recursos/assets/caballero.png', { frameWidth: 192, frameHeight: 95 });
        this.load.image('attack', './recursos/assets/star.png');     
        this.load.spritesheet('fuego','./recursos/assets/proyectilBoss.png',{ frameWidth: 96, frameHeight: 96 }); 
        this.load.spritesheet('dragon','./recursos/assets/dragon.png',{ frameWidth: 170, frameHeight: 141 }); 
    }

    create() {
        let background=this.add.image(600,300, 'back').setScale(1);
        background.setAlpha(0.6);
        this.physics.world.setBounds(0, 0, 1200, 700);

        //SPRITES
        this.anims.create({
            key: 'anim-fuego', 
            frames: this.anims.generateFrameNumbers('fuego', { start: 0, end: 18 }), 
            frameRate: 30, 
            repeat: -1
        });

        this.anims.create({
            key: 'anim-dragon', 
            frames: this.anims.generateFrameNumbers('dragon', { start: 0, end: 5 }), 
            frameRate: 5, 
            repeat: -1
        });


        // plataformas
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(600, 700, 'ground').setScale(3).refreshBody(); 
        this.platforms.create(200, 500, 'ground'); 
        this.platforms.create(900, 500, 'ground'); 
        this.platforms.create(550, 400, 'ground'); 
        // para la pausa
        this.pausa = new Pausa(this);
        
        this.player = new Player(this, 100, 600);
        this.cameras.main.startFollow(this.player.sprite, false,0.2,0,0,200);
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
        this.dragon = this.physics.add.sprite(700, 230, 'dragon'); 
        this.dragon.play('anim-dragon');
        this.dragon.setScale(0.3);
        this.dragon.setCollideWorldBounds(true);
        this.dragon.vida = 5; 
        this.dragon.setScale(3); 
        this.dragon.body.setAllowGravity(false);
        this.dragon.bo
        // this.dragon.angle = 0;
        this.dragon.posiciones = [ 
            { x: 100, y: 100 },  
            { x: 900, y: 200 }, 
            { x: 50, y: 100 }, 
            { x: 400, y: 200 },  
            { x: 150, y: 450 }   
        ];
        this.dragon.posActual = -1; 
        this.dragon.isVulnerable = false;
        this.moverSigPosicion();
        // se mueve cada 7 segundos
        this.time.addEvent({
            delay: 7000, 
            callback: this.moverSigPosicion,
            callbackScope: this,
            loop: true
        });

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
        // this.physics.add.collider(this.player.sprite, this.dragon);
        this.physics.add.overlap(this.player.sprite, this.fuegos, this.hitPlayer, null, this);
        // this.physics.add.overlap(this.player.sprite, this.dragon, this.hitPlayer, null, this);
        this.physics.add.overlap(this.player.ataque, this.dragon, this.hitDragon, null, this);
        
    }

    update() {
        if (this.pausa.activarPausa()) return;
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
    
        // this.dragon.angle += 1; //vel giro
        // const radio = 200; 
        // const centerX = 500; 
        // const centerY = 250; 
        // this.dragon.x = centerX + Math.cos(this.dragon.angle * Math.PI / 180) * radio;
        // this.dragon.y = centerY + Math.sin(this.dragon.angle * Math.PI / 180) * radio;

        // verificar por que el move to essta haciendo cosas raras
        const sigPos = this.dragon.posiciones[this.dragon.posActual];
        const distancia = Phaser.Math.Distance.Between(
            this.dragon.x, this.dragon.y,
            sigPos.x, sigPos.y
        );
        if (distancia < 10) { 
            this.dragon.body.setVelocity(0, 0);
            this.dragon.setPosition(sigPos.x, sigPos.y); 
            console.log("distancia: " + distancia);
        }
        // Limpiar fuegos fuera de pantalla
        this.fuegos.getChildren().forEach(fuego => {
            if (fuego.x < 0 || fuego.x > 1400 || fuego.y < 0 || fuego.y > 700) {
                fuego.setActive(false);
                fuego.setVisible(false);
            }
        });
    }
    lanzarfuego() {
        if (!this.dragon.isVulnerable) {

            for (let i = 0; i < 3; i++) {
                let fuego = this.fuegos.get(this.dragon.x, this.dragon.y);
                if (fuego) {
                    fuego.setActive(true).setVisible(true);
                    fuego.play('anim-fuego');
                    
                    let dx = this.player.sprite.x - this.dragon.x;
                    let dy = this.player.sprite.y - this.dragon.y;
                    let distancia = Math.sqrt(dx * dx + dy * dy);
                    let velocidad = 300; //Vel
                    let vx = (dx / distancia) * velocidad;
                    let vy = (dy / distancia) * velocidad;
                    //agregar mas random pa que no sea preciso
                    vx += Phaser.Math.Between(-200, 200);
                    vy += Phaser.Math.Between(-200, 200);
                    fuego.setVelocity(vx, vy);
                }

            }
        }

    }
    moverSigPosicion() {
        this.dragon.posActual = (this.dragon.posActual + 1) % this.dragon.posiciones.length;
        const sigPos = this.dragon.posiciones[this.dragon.posActual];
        console.log("posactual: " + this.dragon.posActual);
        console.log("pos siguiente: " + sigPos.x + "," + sigPos.y);

        if(sigPos.x>this.dragon.posActual.x&&this.dragon.flipX){
            this.dragon.setFlipX(false)
        }

        
  
        this.dragon.body.setVelocity(0, 0); 
        this.physics.moveTo(this.dragon, sigPos.x, sigPos.y, 200); //vel
        
        if (this.dragon.posActual === 4) { 
            this.dragon.isVulnerable = true;
            this.dragon.setTint(0xff0000);
        } else {
            this.dragon.isVulnerable = false;
            this.dragon.clearTint();
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

            // fuegos.setActive(false).setVisible(false);

            // Perder
            if (this.vidas <= 0) {
                this.physics.pause();
                player.anims.play('turn');
                player.setTint(0xff0000);
                this.scene.stop('Boss');
                this.scene.launch('GameOver');
            }
        }
    }

    hitDragon(attack, dragon) {
        dragon.vida--;
        attack.setVisible(false);
        attack.disableBody(true, true);
        
        if (dragon.vida <= 0) {
            // dragon.destroy();
            dragon.body.enable = false; 
            dragon.setVisible(false)
            this.score += 100; // matar al jefe
            this.scoreText.setText('Score: ' + this.score);
            this.physics.pause();
            this.scene.stop('Boss'); 
            this.scene.launch('GameOver');
        }
        this.moverSigPosicion();
    }
}