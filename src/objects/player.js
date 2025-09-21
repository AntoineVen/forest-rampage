import { GameObject } from "./object.js";

export class Player extends GameObject {
    constructor(name, game, input, position, maxLives) {
        super(name, position);
        this.maxLives = maxLives;
        this.lives = maxLives; // Initialiser la vie actuelle à la vie maximale
        this.score = 0; // Initialiser le score du joueur
        this.speed = 0.5; // Vitesse de déplacement du joueur
        this.mesh = this.createCar();
        this.game = game;
        this.input = input;
    }

    update(delta) {
        // Déplacement basé sur les entrées clavier
        // Move forward
        if (this.input.isDown("z")) {
            this.mesh.position.z += Math.cos(this.mesh.rotation.y) * 20 * delta;
            this.mesh.position.x += Math.sin(this.mesh.rotation.y) * 20 * delta;
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
}
