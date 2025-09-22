import { showGameOver } from "../inputManager.js";
import { GameObject } from "./object.js";
import { Game } from "../game.js";

export class Player extends GameObject {
    constructor(name, game, input, position, maxLives) {
        super(name, position);
        this.maxLives = maxLives;
        this.lives = maxLives; // Initialiser la vie actuelle à la vie maximale
        this.score = 0; // Initialiser le score du joueur
        this.speed = 1; // Vitesse de déplacement du joueur
        this.mesh = this.createCar();
        this.game = game;
        this.input = input;
        this.changeLives(this.lives)
    }

    updatePlayer(delta) {
        if (Game.isPaused) return;
        if (document.getElementById('game-over-menu').classList.contains('active')) return; // bloque toute action du joueur tant que menu Game Over actif
        if (!Game.inGame) return; // ne pas mettre à jour si on n'est pas en jeu

        // Déplacement basé sur les entrées clavier
        // Move forward
        if (this.input.isDown("z")) {
            this.mesh.position.z += Math.cos(this.mesh.rotation.y) * 20 * delta * this.speed;
            this.mesh.position.x += Math.sin(this.mesh.rotation.y) * 20 * delta * this.speed;
            // Traînée voiture (particules derrière la voiture)
            this.game.particleManager.playerMoveForward(this.mesh);
        }
        // Move backward
        if (this.input.isDown("s")) {
            this.mesh.position.z -= Math.cos(this.mesh.rotation.y) * 20 * delta;
            this.mesh.position.x -= Math.sin(this.mesh.rotation.y) * 20 * delta;
        }
        // Rotate left
        if (this.input.isDown("q")) this.mesh.rotation.y += 2 * delta;
        // Rotate right
        if (this.input.isDown("d")) this.mesh.rotation.y -= 2 * delta;

    }
    createCar() {
        // Voiture
        const car = new THREE.Group();

        // Base
        const chassis = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 0.6, 5),
            new THREE.MeshPhongMaterial({ color: 0xFFCC00, flatShading: true })
        );
        chassis.position.y = 0.3;
        car.add(chassis);

        // Toit
        const roof = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 0.8, 2.5),
            new THREE.MeshPhongMaterial({ color: 0xFFD755, flatShading: true })
        );
        roof.position.set(0, 0.9, -0.5);
        car.add(roof);

        // Capot
        const hood = new THREE.Mesh(
            new THREE.BoxGeometry(2.3, 0.4, 1.5),
            new THREE.MeshPhongMaterial({ color: 0xCC9900, flatShading: true })
        );
        hood.position.set(0, 0.5, 1.75);
        car.add(hood);

        // Spoiler arrière
        const spoiler = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 0.1, 0.5),
            new THREE.MeshPhongMaterial({ color: 0x333333 })
        );
        spoiler.position.set(0, 1.1, -2.5);
        car.add(spoiler);

        // Roues
        function makeWheel(x, z) {
            const wheel = new THREE.Mesh(
                new THREE.CylinderGeometry(0.5, 0.5, 0.5, 12),
                new THREE.MeshPhongMaterial({ color: 0x111111 })
            );
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(x, 0.25, z);
            return wheel;
        }
        car.add(makeWheel(-1.3, 1.8));
        car.add(makeWheel(1.3, 1.8));
        car.add(makeWheel(-1.3, -1.8));
        car.add(makeWheel(1.3, -1.8));

        // Pots d'échappement
        // Pot d'échappement gauche
        const exhaustLeft = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8),
            new THREE.MeshPhongMaterial({ color: 0x333333 }) // gris foncé
        );
        exhaustLeft.rotation.x = Math.PI / 2; // le cylindre pointé vers l'arrière
        exhaustLeft.position.set(-0.6, 0.2, -2.6); // côté gauche
        car.add(exhaustLeft);

        // Pot d'échappement droit
        const exhaustRight = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8),
            new THREE.MeshPhongMaterial({ color: 0x333333 }) // gris foncé
        );
        exhaustRight.rotation.x = Math.PI / 2;
        exhaustRight.position.set(0.6, 0.2, -2.6); // côté droit
        car.add(exhaustRight);

        car.position.y = 0;

        return car;
    }

    setScore(newScore) {
        this.score = newScore;
        document.getElementById('score').innerText = "Score : " + this.score;
    }

    changeLives(amount) {
        // Change le nombre de vies
        this.lives += amount;

        // Empêche de dépasser les limites
        if (this.lives > this.maxLives) this.lives = this.maxLives;
        if (this.lives < 0) this.lives = 0;

        // Met à jour l'affichage texte
        document.getElementById('lives').innerText = "Vies : " + this.lives;

        // Met à jour la barre
        this.updateLifeBar();

        // Option : si plus de vie, fin du jeu
        if (this.lives <= 0) {
            this.explodeCar(); // explosion de la voiture

            // attendre 1 seconde avant de recharger la page
            setTimeout(() => {
                showGameOver();
            }, 1000);
        }
    }

    updateLifeBar() {
        const percentage = (this.lives / this.maxLives) * 100;
        const lifeBar = document.getElementById('life-bar');

        // Met à jour la taille
        lifeBar.style.width = percentage + "%";

        // Change la couleur selon le pourcentage

        if (percentage > 67) {
            lifeBar.style.background = "linear-gradient(90deg, #00FF00, #88FF00)"; // vert
            lifeBar.style.boxShadow = "0 0 10px #00FF00, 0 0 20px #88FF00";
        } else if (percentage > 34) {
            lifeBar.style.background = "linear-gradient(90deg, #FFFF00, #FFD700)"; // jaune
            lifeBar.style.boxShadow = "0 0 10px #FFFF00, 0 0 20px #FFD700";
        } else {
            lifeBar.style.background = "linear-gradient(90deg, #FF0000, #880000)"; // rouge
            lifeBar.style.boxShadow = "0 0 10px #FF0000, 0 0 20px #880000";
        }
    }

    // EXPLOSION voiture
    explodeCar() {
        const carPosition = this.mesh.position.clone();

        // Explosion des morceaux de la voiture
        this.mesh.children.forEach(mesh => {
            const meshClone = mesh.clone();
            meshClone.position.copy(mesh.getWorldPosition(new THREE.Vector3()));
            meshClone.userData = {
                life: 2,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 10,
                    Math.random() * 10,
                    (Math.random() - 0.5) * 10
                )
            };
            this.game.scene.add(meshClone);
            this.game.particleManager.particles.push(meshClone);
        });

        // Particules feu
        this.game.particleManager.playerExlose(this.mesh);

        // Retire la voiture principale
        //this.game.scene.remove(this.mesh);

        this.mesh.visible = false; // cache la voiture principale

        // Arrête le jeu
        Game.inGame = false;

        // Recul de caméra
        this.game.cameraShakeOffset.set(0, 2, -10);
        setTimeout(() => { this.game.cameraShakeOffset.set(0, 0, 0); }, 1000); // revient après 1s
    }
}
