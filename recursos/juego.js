class Juego extends Phaser.Scene {
    constructor() {
        super({ key: 'Juego' });
    }

    preload() {
        this.load.image('prendido', './recursos/assets/volume.png');
        this.load.image('muteado', './recursos/assets/mute.png');
        this.load.image('background', 'recursos/assets/background1b.png');
        this.load.image('plataforma', './recursos/assets/platform.png');
        this.load.image('suelo', './recursos/assets/ground.png');
        this.load.image('vampiro', './recursos/assets/vampiros.png');
        // this.load.image('berserker', './recursos/assets/bomb.png');
        this.load.image('proyectil', './recursos/assets/star.png');
        this.load.image('recurso', './recursos/assets/moneda.png');
        this.load.image('pared', './recursos/assets/pared.png');
        
        // this.load.image('recursoEspecial', './recursos/assets/diamond.png');
        this.load.spritesheet('dude', './recursos/assets/caballero.png', { frameWidth: 192, frameHeight: 95 }); 
        // this.load.spritesheet('dude2', './recursos/assets/caballero.png', { frameWidth: 192, frameHeight: 95 }); 
        this.load.audio('recursoespSonido', './recursos/assets/sounds/coin.wav');   
        this.load.audio('backgroundlvl1', './recursos/assets/sounds/Escena1.mp3');
        this.load.audio('moneda', './recursos/assets/sounds/coin.mp3');
        this.load.audio('perder', './recursos/assets/sounds/perder.mp3');
        this.load.audio('ganar', './recursos/assets/sounds/ganar.mp3');
        this.load.spritesheet('berserker','recursos/assets/berserker.png',{ frameWidth: 42, frameHeight: 38 });
        this.load.spritesheet('recursoEspecial', 'recursos/assets/sacoOro.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('dude', './recursos/assets/caballero.png', { frameWidth: 192, frameHeight: 95 }); 

        this.load.spritesheet('canon','recursos/assets/canon.png',{ frameWidth: 192, frameHeight: 110 });
        this.load.spritesheet('canon-ataque','recursos/assets/canon-disparar.png',{ frameWidth: 192, frameHeight: 110 });
        this.load.spritesheet('ataque','recursos/assets/dinamita.png',{ frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('explosion','recursos/assets/explosion.png',{ frameWidth: 192, frameHeight: 192});
        this.load.spritesheet('dude-ataque','recursos/assets/dude-ataque.png',{ frameWidth: 192, frameHeight: 95});

        this.load.spritesheet('dude2', './recursos/assets/goblin.png', { frameWidth: 192, frameHeight: 95}); 
        this.load.spritesheet('dude2-ataque','recursos/assets/goblin-ataque.png',{ frameWidth: 192, frameHeight: 95});


        this.load.video('pausaVideo', 'recursos/assets/video-pause.mp4');
        this.load.image('botonReanudar', 'recursos/assets/btn-reanudar.png');
    

    }

    create() {
        let background=this.add.image(600,300, 'background').setScale(0.5).setPosition(1250,400);
        background.setAlpha(0.6);

        const personajeSeleccionado = sessionStorage.getItem("personajeSeleccionado") || "P1";
        const spriteKey = personajeSeleccionado === "P1" ? 'dude' : 'dude2';
        const attackName = spriteKey === "dude" ? 'dude-ataque' : 'dude2-ataque';

        

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

        this.anims.create({
            key: 'canon-iddle', 
            frames: this.anims.generateFrameNumbers('canon', { start: 0, end: 5 }), 
            frameRate: 5, 
            repeat: -1 
        });
        this.anims.create({
            key: 'canon-atacar', 
            frames: this.anims.generateFrameNumbers('canon-ataque', { start: 0, end: 5 }), 
            frameRate: 20, 
            repeat: 0 
        });
        this.anims.create({
            key: 'ataque-anim', 
            frames: this.anims.generateFrameNumbers('ataque', { start: 0, end: 5 }), 
            frameRate: 10, 
            repeat: -1 
        });
        this.anims.create({
            key: 'explosion-anim',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 8 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'dude-atacar',
            frames: this.anims.generateFrameNumbers(attackName, { start: 0, end: 5 }),
            frameRate: 100,
            repeat: 0
        });
        
        



        // musica de fondo
        this.musicaF = this.sound.add('backgroundlvl1', { loop: true});
        this.musicaF.play();
        // sonido
        this.controlMusica = new Musica(this, this.musicaF);

        // Cambiarrrrrrrrrrrrr
        this.physics.world.setBounds(0, 0, 3200, 800);
        this.cameras.main.setBounds(0, 0, 3200, 800);
        this.platforms = this.physics.add.staticGroup();
        // this.platforms.create(400, 800, 'plataforma').setScale(5).refreshBody();
       this.platforms.create(400, 755, 'suelo').refreshBody(); 
        this.platforms.create(400, 785, 'suelo');   
        this.platforms.create(1220, 755, 'suelo').refreshBody();
        this.platforms.create(1220, 785, 'suelo');   
        this.platforms.create(600, 500, 'plataforma');  //1         //AQUI VA BERSERKER
        this.platforms.create(50, 250, 'plataforma');   //2
        this.platforms.create(750, 250, 'plataforma');  //3
        this.platforms.create(450, 620, 'plataforma');  //4          //AQUI VA CANON
        

        //PLATAFORMAS
        
        this.platforms.create(1300, 500, 'plataforma');  //5
        this.platforms.create(1300+400, 500, 'plataforma');  //5
        this.platforms.create(1300+700, 500, 'plataforma');  //5
        this.platforms.create(2200, 450, 'pared').setSize(35,470).setDisplaySize(35,470);  //5

        this.platforms.create(1500, 350, 'plataforma');  //6        //AQUI VA BERSERKER
        this.platforms.create(1800, 200, 'plataforma');  //7        //AQUI VA BERSERKER

        this.platforms.create(1550, 650, 'plataforma');  //8        //AQUI VA CANON Y ABAJO BERSERKER

        
        this.platforms.create(1700, 650, 'plataforma');  //8

        this.platforms.create(1220+1999, 755, 'suelo').refreshBody();
        this.platforms.create(1220+1999, 785, 'suelo'); 


        this.platforms.create(2770, 450, 'plataforma');  //9        //AQUI VA BERSERKER
        this.platforms.create(2620, 670, 'pared').setSize(35,470).setDisplaySize(35,470); //9   
        this.platforms.create(2620, 370, 'pared').setSize(35,470).setDisplaySize(35,470); //9    

        this.platforms.create(3100, 600, 'plataforma');  //10                //AQUI VA CANON


        this.player = new Player(this, 100, 450);
        // this.player.sprite.setScale(1.1);
        this.pausa = new Pausa(this, this.player);
        this.cameras.main.startFollow(this.player.sprite, false, 0.2);
        
        this.cursors = this.input.keyboard.createCursorKeys();

        // recursos especiales
        this.recursosEspeciales = this.physics.add.staticGroup();
    
        // Recursos
        this.recursos = this.physics.add.staticGroup();
        this.crearRecurso(200, 400); 
        this.crearRecurso(650, 450); 
        this.crearRecurso(100, 200);

        this.crearRecurso(400, 550);
        this.crearRecursoEspecial(500, 700);
        this.crearRecurso(800, 200);
        this.crearRecurso(950, 350);
        this.crearRecursoEspecial(2500, 300);
        this.crearRecurso(1500, 600);
        this.crearRecursoEspecial(2900, 350);
        this.crearRecurso(2100, 300);


        // Vampiro
        this.vampiros = this.physics.add.group();
        this.crearVampiro(600, 300); 
        this.crearVampiro(2000, 300);  

        // Berserker 
        this.berserkers = this.physics.add.group(); 
        this.crearBerserker(750, 170); 
        this.crearBerserker(600, 350);
        this.crearBerserker(1550, 200);
        this.crearBerserker(1900, 100);
        this.crearBerserker(1550, 650);
        this.crearBerserker(2850, 200);

        // Grupo de cañones
        this.canones = this.physics.add.group(); 
        this.crearCanon(1700, 500);
        this.crearCanon(3100, 450);
        this.crearCanon(1900, 100);


        // proyectiles
        this.proyectiles = this.physics.add.group({
            defaultKey: 'proyectil',
            maxSize: 10 //limite
        });

        let records = JSON.parse(localStorage.getItem("records")) || [];
        const jugadorIndex = parseInt(sessionStorage.getItem("jugadorIndex"));
        const jugador = (records.length > 0 && jugadorIndex >= 0 && jugadorIndex < records.length) ? records[jugadorIndex] : { nombre: "Jugador", fecha: new Date().toLocaleString() };

        // temp recursos esp
        this.tiempoEspecial = 25000; 
        this.tiempoEspecialText = this.add.text(340, 16, 'Rec-Especial: ' + this.tiempoEspecial, {
            fontFamily: '"Press Start 2P", sans-serif',
            fontSize: '28px',
            fill: '#FFD700', 
            stroke: '#8B0000', 
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#FFD700', 
                blur: 5,
                stroke: true,
                fill: true
            }
        }).setScrollFactor(0);

        // Puntaje
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontFamily: '"Press Start 2P", sans-serif',
            fontSize: '28px',
            fill: '#FFD700',
            stroke: '#8B0000',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#FFD700',
                blur: 5,
                stroke: true,
                fill: true
            }
        }).setScrollFactor(0);
        

        // vidas
        this.vidas = 3; 
        this.vidasText = this.add.text(16, 50, 'Vidas: 3', { 
            fontFamily: '"Press Start 2P", sans-serif',
            fontSize: '28px',
            fill: '#FFD700',
            stroke: '#8B0000',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#FFD700',
                blur: 5,
                stroke: true,
                fill: true
            }
        }).setScrollFactor(0);
        this.aliasText = this.add.text(16, 80, `Alias: ${jugador.nombre}`, { 
            fontFamily: '"Press Start 2P", sans-serif',
            fontSize: '28px',
            fill: '#FFD700',
            stroke: '#8B0000',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#FFD700',
                blur: 5,
                stroke: true,
                fill: true
            }
        }).setScrollFactor(0);
    
        this.nivelText = this.add.text(770, 16, 'Nivel: 1', { 
            fontFamily: '"Press Start 2P", sans-serif',
            fontSize: '28px',
            fill: '#FFD700',
            stroke: '#8B0000',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#FFD700',
                blur: 5,
                stroke: true,
                fill: true
            }
        }).setScrollFactor(0);
    
        this.fechaText = this.add.text(770, 665, `Fecha: ${jugador.fecha}`, { 
            fontSize: '32px',
            fill: '#fff'
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
        berserker.setScale(1.7);
        berserker.setSize(24,34);
        berserker.setOffset(8,4);
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
        this.sound.play('moneda',{volume:0.2});
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
        this.sound.play('recursoespSonido',{volume:0.2});
        recurso.destroy();
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
        canon.setScale(0.5);
        canon.setSize(70,70);
        canon.setOffset(55,20);
        canon.play('canon-iddle');
        // Dispara de 2 a 4 segundos estaticos para cada uno
        canon.intervaloDisparo = Phaser.Math.Between(2, 4); 
       
        // console.log(canon.intervaloDisparo);
        this.tweens.add({
            
            targets: canon,
            alpha: 1,
            duration: canon.intervaloDisparo * 1000,
            repeat: -1,
            onRepeat: () => {
                this.dispararProyectil(canon);
            }
        });
        
        return canon;
    }
    dispararProyectil(canon) {
        let proyectil = this.proyectiles.get(canon.x, canon.y);
        if (proyectil) {
            proyectil.setActive(true);
            proyectil.setScale(0.5);
            proyectil.setVisible(true);
            proyectil.play('ataque-anim');
            proyectil.once('animationcomplete', () => {
                proyectil.setVelocity(0, 0);
                proyectil.play('ataque');
            });

            canon.play('canon-atacar');

            if((this.player.sprite.x - canon.x)<0){
                canon.setFlipX(true);
            }
            else{
                canon.setFlipX(false);
            }

            
            // Nunca pense usar teorema de pitagoras pero aqui andamos
            let dx = this.player.sprite.x - canon.x; 
            let dy = this.player.sprite.y - canon.y; 
            let distancia = Math.sqrt(dx * dx + dy * dy); 
            
            // Normalizando 
            let velocidad = 300; 
            // Necsito ajustar esto
            let vx = (dx / distancia) * velocidad  ; 
            // let vy = (dy / distancia) * velocidad   ; 
            let vy = -50;
            // console.log("Vx:" +vx);
            // console.log("Vy:" +vy);
            // console.log("Dy:" +dy);
            // Quitar ???
            if(dy< -18 ){
                vy-=200;
            }
            canon.once('animationcomplete', () => {
                canon.play('canon-iddle');
            });
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
        if(this.pausa.activarPausa())return;
        if (this.pausa.isPaused) return;

        
        if (this.cursors.left.isDown && this.player.sprite.anims.currentAnim.key !== 'dude-atacar') {
            // Si el jugador presiona izquierda y no está en la animación 'dude-atacar'
            this.player.sprite.setVelocityX(-160);
            this.player.sprite.setFlipX(true);
            this.player.sprite.anims.play('left', true);
            this.player.sprite.voltear = false;
        } else if (this.cursors.right.isDown && this.player.sprite.anims.currentAnim.key !== 'dude-atacar') {
            // Si el jugador presiona derecha y no está en la animación 'dude-atacar'
            this.player.sprite.setVelocityX(160);
            this.player.sprite.setFlipX(false);
            this.player.sprite.anims.play('right', true);
            this.player.sprite.voltear = true;
        } else if (this.cursors.space.isDown) {
            // Ejecutar animación de ataque sin la verificación de que no esté ya en 'dude-atacar'
            if (this.player.sprite.anims.currentAnim.key !== 'dude-atacar'&&this.player.cooldown<=0) {
                this.player.sprite.anims.play('dude-atacar');

            }
        }

        else {
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
                this.tiempoEspecialText.setVisible(false); 
            }
        } else if(this.recursosEspeciales.countActive() === 0){
            this.tiempoEspecialText.setVisible(false);
        }

        // pasar al siguiente nivel
        if (this.player.sprite.x >= 3200 - 20) {//cambiar ancho 
            this.musicaF.destroy();
            
            this.scene.start('Boss', { score: this.score, vidas: this.vidas });
        }
    }
    

    hitEnemy(ataque, enemy) {

        enemy.disableBody(true, true); 
        this.score += 20;             
        this.scoreText.setText('Score: ' + this.score);
    }

    hitPlayer(player, enemigo) {
        if (enemigo && enemigo.texture && enemigo.texture.key === 'ataque') {
            enemigo.play('explosion-anim'); // enemigo ya es el proyectil
            enemigo.once('animationcomplete', () => {
                enemigo.setVelocity(0, 0);
                enemigo.play('ataque');
            });
        }
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
                let records = JSON.parse(localStorage.getItem("records")) || [];
                const jugadorIndex = parseInt(sessionStorage.getItem("jugadorIndex"));
        
                if (records.length > 0 && jugadorIndex >= 0 && jugadorIndex < records.length) {
                    const puntuacionAnterior = records[jugadorIndex].puntuacion;
                    if (this.score > puntuacionAnterior) {
                        records[jugadorIndex].puntuacion = this.score;
                        records[jugadorIndex].fecha = new Date().toLocaleDateString();
                        localStorage.setItem("records", JSON.stringify(records));
                    }
                }
                this.sound.play('perder',{volume:0.3});
                this.musicaF.destroy();
                this.physics.pause();
                this.scene.pause();
                player.setTint(0xff0000);
                player.anims.play('turn');
                this.gameOver = true;
                this.scene.stop('Juego');
                this.scene.launch('GameOver');
                // this.scene.start('GameOver');
            }
        }
    }
    
}