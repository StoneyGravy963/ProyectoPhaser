class Juego extends Phaser.Scene {
    constructor() {
        super({ key: 'Juego' });
    }

    preload() {
        this.load.image('sky', './recursos/assets/sky.png');
        this.load.image('ground', './recursos/assets/platform.png');
        this.load.image('vampiro', './recursos/assets/bomb.png');
        this.load.image('berserker', './recursos/assets/bomb.png');
        this.load.image('canon', './recursos/assets/bomb.png');
        this.load.image('proyectil', './recursos/assets/star.png');
        this.load.spritesheet('dude', './recursos/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.add.image(400, 300, 'sky');
        this.physics.world.setBounds(0, 0, 3200, 800);
        this.cameras.main.setBounds(0, 0, 3200, 800);
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 800, 'ground').setScale(5).refreshBody();
        this.platforms.create(600, 500, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');
        this.platforms.create(450, 620, 'ground');

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setSize(30, 43);
        this.player.setOffset(0, 6);
        this.cameras.main.startFollow(this.player,false,0.2);
        this.player.setCollideWorldBounds(true);
        // para que sea inmune
        this.player.inmune = false; 
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // Vampiro
        this.vampiros = this.physics.add.group();
        this.crearVampiro(600, 100); 
        this.crearVampiro(50, 200);  

        // Berserker 
        this.berserkers = this.physics.add.group(); 
        this.crearBerserker(750, 170); 
        this.crearBerserker(600, 350);

        // Grupo de cañones
        this.canones = this.physics.add.group(); 
        // this.crearCanon(770, 170);
        this.crearCanon(570, 670);
        // proyectiles
        this.proyectiles = this.physics.add.group({
            defaultKey: 'proyectil',
            maxSize: 10 //Limite proyectiles a la vez
        });

        // Puntaje
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '32px', 
            fill: '#000' 
        }).setScrollFactor(0); 

        // vidas
        this.vidas = 3; 
        this.vidasText = this.add.text(16, 50, 'Vidas: 3', { 
            fontSize: '32px',
            fill: '#000'
        }).setScrollFactor(0);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.berserkers, this.platforms); 
        this.physics.add.collider(this.canones, this.platforms);
        this.physics.add.overlap(this.player, this.vampiros, this.hitPlayer, null, this);
        this.physics.add.overlap(this.player, this.berserkers, this.hitPlayer, null, this);
        this.physics.add.overlap(this.player, this.proyectiles, this.hitPlayer, null, this); 
        this.physics.add.overlap(this.player, this.canones, this.hitPlayer, null, this); 
    }

    crearVampiro(x, y) {
        let vampiro = this.vampiros.create(x, y, 'vampiro');
        vampiro.setCollideWorldBounds(true);
        vampiro.setAlpha(1); //Visible
        // vampiro.setGravityY(0);
        return vampiro;
    }
    crearBerserker(x, y) {
        let berserker = this.berserkers.create(x, y, 'berserker');
        berserker.setGravityY(300);
        berserker.velPatrulla = 80;
        berserker.dirPatrulla = 1; 
        berserker.setCollideWorldBounds(true); 
        berserker.rangoPatrulla = 150; 
        berserker.XInicial = berserker.x; 
        return berserker;
    }

    // crearCanon(x, y) {
    //     let canon = this.canones.create(x, y, 'canon');
    //     canon.setGravityY(300); 
    //     // canon.setImmovable(true); 
    //     return canon;
    // }
    crearCanon(x, y) {
        let canon = this.canones.create(x, y, 'canon');
        canon.setGravityY(300);
        // Dispara de 2 a 4 segundos estaticos para cada uno
        canon.intervaloDisparo = Phaser.Math.Between(2, 4); 
        console.log(canon.intervaloDisparo);
        this.time.addEvent({
            delay: canon.intervaloDisparo * 1000, 
            callback: () => this.dispararProyectil(canon),
            callbackScope: this,
            loop: true
        });
        return canon;
    }
    dispararProyectil(canon) {
        let proyectil = this.proyectiles.get(canon.x, canon.y);
        if (proyectil) {
            proyectil.setActive(true);
            proyectil.setVisible(true);
            
            // Nunca pense usar teorema de pitagoras pero aqui andamos
            let dx = this.player.x - canon.x; 
            let dy = this.player.y - canon.y; 
            let distancia = Math.sqrt(dx * dx + dy * dy); 
            
            // Normalizando 
            let velocidad = 300; 
            // Necsito ajustar esto
            let vx = (dx / distancia) * velocidad  ; 
            // let vy = (dy / distancia) * velocidad   ; 
            let vy = -100;
            console.log("Vx:" +vx);
            console.log("Vy:" +vy);
            console.log("Dy:" +dy);
            // Quitar ???
            if(dy< -18 ){
                vy-=150;
            }
        
            proyectil.setVelocity(vx, vy); 
        }
    }
    // dispararProyectil(canon) {
    //     let proyectil = this.proyectiles.get(canon.x, canon.y);
    //     if (proyectil) {
    //         proyectil.setActive(true);
    //         proyectil.setVisible(true);
    //         proyectil.setVelocity(80); 
    //         // proyectil.setVelocitY(30); 

    //     }
    // }

    update() {
        if (this.gameOver) return;
        
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
            this.player.voltear = false;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
            this.player.voltear = true;
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }

         // Logico vamp
         this.vampiros.getChildren().forEach(vampiro => {
            let direccionJugador = this.player.voltear ? -1 : 1;
            let direccionVampiro = Math.sign(this.player.x - vampiro.x);

            if (direccionJugador === direccionVampiro) {
                vampiro.setVelocity(0);
                vampiro.setAlpha(0.2);
            } else {
                vampiro.setAlpha(1);
                this.physics.moveToObject(vampiro, this.player, 40);
            }
        });
        // Logica berser
        this.berserkers.getChildren().forEach(berserker => {
            berserker.setVelocityX(berserker.velPatrulla * berserker.dirPatrulla);

            // Cambiar direccion si se pasa de rango
            if (berserker.x > berserker.XInicial + berserker.rangoPatrulla) {
                berserker.dirPatrulla = -1;
            } else if (berserker.x < berserker.XInicial - berserker.rangoPatrulla) {
                berserker.dirPatrulla = 1;
            }
        });
        // Proyectiles
        // if (this.time.now % 2000 < 60) { //dispara cada 2 seg
        //     this.canones.getChildren().forEach(canon => {
        //         this.dispararProyectil(canon);
        //     });
        // }

        // lippia proyectiles fuera d epantalla
        this.proyectiles.getChildren().forEach(proyectil => {
            if (proyectil.x < 0 || proyectil.x > 3200 || proyectil.y < 0 || proyectil.y > 800) {
                proyectil.setActive(false);
                proyectil.setVisible(false);
            }
        });
        
        // Si se cae
        if (this.player.y > this.physics.world.bounds.height - 30) {
            this.hitPlayer(this.player,null); 
        }

        // console.log(this.player.y);
        // console.log(this.physics.world.bounds.height);

    }

    hitPlayer(player, enemigo) {
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
            
            // Perder
            if (this.vidas <= 0) {
                this.physics.pause();
                player.setTint(0xff0000);
                player.anims.play('turn');
                this.gameOver = true;
            }
        }
    }
}
