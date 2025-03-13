class Juego extends Phaser.Scene {
    constructor() {
        super({ key: 'Juego' });
    }

    preload() {
        this.load.image('background', './recursos/assets/background1a.png');
        this.load.image('ground', './recursos/assets/platform.png');
        this.load.image('vampiro', './recursos/assets/vampiros.png');
        // this.load.image('berserker', './recursos/assets/bomb.png');
        this.load.image('canon', './recursos/assets/bomb.png');
        this.load.image('proyectil', './recursos/assets/star.png');
        this.load.image('recurso', './recursos/assets/moneda.png');
        this.load.image('ataque', './recursos/assets/star.png');
        // this.load.image('recursoEspecial', './recursos/assets/diamond.png');
        this.load.spritesheet('dude', './recursos/assets/caballero.png', { frameWidth: 192, frameHeight: 95 });    
        this.load.spritesheet('berserker','recursos/assets/berserker.png',{ frameWidth: 42, frameHeight: 38 });
        this.load.spritesheet('recursoEspecial', 'recursos/assets/sacoOro.png', { frameWidth: 128, frameHeight: 128 });
    }

    create() {
        let background=this.add.image(600,300, 'background').setScale(1.5);
        background.setAlpha(0.6);

        //SPRITES
        this.anims.create({
            key: 'run-berserker',         // Nombre de la animación
            frames: this.anims.generateFrameNumbers('berserker', { start: 0, end: 9 }), 
            frameRate: 10,     
            repeat: -1          
        });
        this.anims.create({
            key: 'spawn-especial', 
            frames: this.anims.generateFrameNumbers('recursoEspecial', { start: 0, end: 6 }), 
            frameRate: 10, 
            repeat: 0 
        });
        



        this.pausa = new Pausa(this);
        // Cambiarrrrrrrrrrrrr
        this.physics.world.setBounds(0, 0, 1100, 800);
        this.cameras.main.setBounds(0, 0, 1100, 800);
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 800, 'ground').setScale(5).refreshBody();
        this.platforms.create(600, 500, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');
        this.platforms.create(450, 620, 'ground');
        // Usar Player.js con ataque encapsulado
        this.player = new Player(this, 100, 450);
        this.cameras.main.startFollow(this.player.sprite, false, 0.2);
        
        this.cursors = this.input.keyboard.createCursorKeys();

        // recursos especiales
        this.recursosEspeciales = this.physics.add.staticGroup();
        
;       this.crearRecursoEspecial(300, 300); 
        this.crearRecursoEspecial(500, 600);

        // temp recursos esp
        this.tiempoEspecial = 10000; 
        this.tiempoEspecialText = this.add.text(16, 84, 'Rec-Especial: 10s', {
            fontSize: '32px',
            fill: '#000'
        }).setScrollFactor(0);

        // Recursos
        this.recursos = this.physics.add.staticGroup();
        this.crearRecurso(200, 400); 
        this.crearRecurso(650, 450); 
        this.crearRecurso(100, 200);

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
        // this.crearCanon(570, 670);
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

        this.physics.add.collider(this.player.sprite, this.platforms);
        this.physics.add.collider(this.berserkers, this.platforms); 
        this.physics.add.collider(this.canones, this.platforms);
        this.physics.add.overlap(this.player.sprite, this.vampiros, this.hitPlayer, null, this);
        this.physics.add.overlap(this.player.sprite, this.berserkers, this.hitPlayer, null, this);
        this.physics.add.overlap(this.player.sprite, this.proyectiles, this.hitPlayer, null, this); 
        this.physics.add.overlap(this.player.sprite, this.canones, this.hitPlayer, null, this);

        this.physics.add.overlap(this.player.sprite, this.recursos, this.recolectarRecurso, null, this);
        this.physics.add.overlap(this.player.sprite, this.recursosEspeciales, this.recolectarRecursoEspecial, null, this);
        
        this.physics.add.overlap(this.player.ataque, this.vampiros, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player.ataque, this.berserkers, this.hitEnemy, null, this);
    }

    crearVampiro(x, y) {
        let vampiro = this.vampiros.create(x, y, 'vampiro');
        vampiro.setCollideWorldBounds(true);
        vampiro.setAlpha(1); //Visible
        // vampiro.setGravityY(0);
        return vampiro;
    }
    crearBerserker(x, y) {
        let berserker = this.berserkers.create(x, y,'berserker');
        berserker.setGravityY(300);
        berserker.velPatrulla = 80;
        berserker.dirPatrulla = 1; 
        berserker.setCollideWorldBounds(true); 
        berserker.rangoPatrulla = 150; 
        berserker.XInicial = berserker.x; 
        berserker.anims.play('run-berserker');
        return berserker;
    }
    crearRecurso(x, y) {
        let recurso = this.recursos.create(x, y, 'recurso');
        recurso.setScale(0.6);
        recurso.setSize(25,25);
        recurso.setOffset(20,20);
        return recurso;
    }
    recolectarRecurso(player, recurso) {
        recurso.disableBody(true, true); 
        this.score += 10; 
        this.scoreText.setText('Score: ' + this.score); 
    }
    crearRecursoEspecial(x, y) {
        let recurso = this.recursosEspeciales.create(x, y, 'recursoEspecial');
        recurso.setScale(0.6);
        recurso.setSize(25,25);
        recurso.setOffset(55,55);
        recurso.anims.play('spawn-especial');
        return recurso;
    }
    recolectarRecursoEspecial(player, recurso) {
        recurso.disableBody(true, true); 
        this.score += 50; 
        this.scoreText.setText('Score: ' + this.score);
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
        // console.log(canon.intervaloDisparo);
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
            let dx = this.player.sprite.x - canon.x; 
            let dy = this.player.sprite.y - canon.y; 
            let distancia = Math.sqrt(dx * dx + dy * dy); 
            
            // Normalizando 
            let velocidad = 300; 
            // Necsito ajustar esto
            let vx = (dx / distancia) * velocidad  ; 
            // let vy = (dy / distancia) * velocidad   ; 
            let vy = -100;
            // console.log("Vx:" +vx);
            // console.log("Vy:" +vy);
            // console.log("Dy:" +dy);
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
        if (this.gameOver || this.pausa.activarPausa()) return;
        
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

        // ataque
        this.player.uPataque();

        // Logico vamp
        this.vampiros.getChildren().forEach(vampiro => {
            let direccionJugador = this.player.sprite.voltear ? -1 : 1;
            let direccionVampiro = Math.sign(this.player.sprite.x - vampiro.x);

            if(this.player.sprite.x<=vampiro.x){
                vampiro.setFlipX(true);
            }
            else{
                vampiro.setFlipX(false);
            }

            if (direccionJugador === direccionVampiro) {
                vampiro.setVelocity(0);
                vampiro.setAlpha(0.2);
            } else {
                vampiro.setAlpha(1);
                this.physics.moveToObject(vampiro, this.player.sprite, 40);
            }
        });
        //  berser
        this.berserkers.getChildren().forEach(berserker => {
            berserker.setVelocityX(berserker.velPatrulla * berserker.dirPatrulla);

            // Cambiar direccion si se pasa de rango
            if (berserker.x > berserker.XInicial + berserker.rangoPatrulla) {
                berserker.dirPatrulla = -1;
                berserker.setFlipX(true);
            } else if (berserker.x < berserker.XInicial - berserker.rangoPatrulla) {
                berserker.dirPatrulla = 1;
                berserker.setFlipX(false);
            }
        });
        // Proyectiles
        // if (this.time.now % 2000 < 60) { //dispara cada 2 seg
        //     this.canones.getChildren().forEach(canon => {
        //         this.dispararProyectil(canon);
        //     });
        // }

        // limppia proyectiles fuera d epantalla
        this.proyectiles.getChildren().forEach(proyectil => {
            if (proyectil.x < 0 || proyectil.x > 3200 || proyectil.y < 0 || proyectil.y > 800) {
                proyectil.setActive(false);
                proyectil.setVisible(false);
            }
        });
        
        // Si se cae
        // guarda la ultima pos
        if (this.player.sprite.body.touching.down) {
            this.player.sprite.ultimaPosicionSegura = { x: this.player.sprite.x, y: this.player.sprite.y };
        }

        // respawn
        if (this.player.sprite.y > this.physics.world.bounds.height - 30) {
            this.hitPlayer(this.player.sprite, null);
            if (!this.gameOver) { 
                this.player.sprite.setPosition(this.player.sprite.ultimaPosicionSegura.x, this.player.sprite.ultimaPosicionSegura.y);
            }
        }

        //recursos especiales
        if (this.tiempoEspecial > 0 && this.recursosEspeciales.countActive() > 0) {
            this.tiempoEspecial -= this.sys.game.loop.delta; 
            this.tiempoEspecialText.setText('Especial: ' + Math.ceil(this.tiempoEspecial / 1000) + 's');

            if (this.tiempoEspecial <= 0) {
                // Convertir recursos especiales en normales
                this.recursosEspeciales.getChildren().forEach(recurso => {
                    recurso.disableBody(true, true); 
                    this.crearRecurso(recurso.x, recurso.y); 
                });
                this.recursosEspeciales.clear(true, true); 
                // this.tiempoEspecialText.setText('Especial: 0s');
                this.tiempoEspecialText.setVisible(false); 
            }
        } else if(this.recursosEspeciales.countActive() === 0){
            this.tiempoEspecialText.setVisible(false);
        }

        // pasar al siguiente nivel
        if (this.player.sprite.x >= 1100 - 900) {//cambiar ancho 
            this.scene.start('Boss', { score: this.score, vidas: this.vidas });
        }
    }

    hitEnemy(ataque, enemy) {
        enemy.disableBody(true, true); 
        this.score += 20;             
        this.scoreText.setText('Score: ' + this.score);
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
                this.scene.pause();
                player.setTint(0xff0000);
                player.anims.play('turn');
                
                this.gameOver = true;
                this.scene.launch('GameOver');
                // this.scene.start('GameOver');
            }
        }
    }
}