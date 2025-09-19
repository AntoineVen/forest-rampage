

//changeLives(0); // met à jour texte + barre
import { Player } from './player.js';
export class Game {
    constructor() {
        // Variables du jeu
        this.totalTrees = 0;
        this.destroyedTrees = 0;

        this.bullets = []; // tableau pour les balles
        this.obstacles = []; // tableau pour les obstacles
        this.particles = []; // tableau pour les particules


        // Variables de contrôle
        this.moveForward = false, this.moveBackward = false, this.turnLeft = false, this.turnRight = false;

        // Horloge pour le timing
        this.clock = new THREE.Clock();


        // Initialisation du jeu
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Caméra
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 10, 15);
        this.camera.lookAt(0, 0, 0);

        // Scène
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); // ciel bleu

        // Lumière
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(30, 50, 30);
        this.scene.add(directionalLight);
        this.scene.add(new THREE.AmbientLight(0x404040));

        // Sol
        const groundTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(20, 20); // répète la texture sur le terrain

        const groundGeometry = new THREE.PlaneGeometry(400, 400, 80, 80); // plus de segments pour le bump
        const groundMaterial = new THREE.MeshPhongMaterial({
            map: groundTexture,
            flatShading: true // pour un effet low-poly
        });

        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.scene.add(this.ground);


        // Joueur
        this.player = new Player();
        this.scene.add(this.player.mesh);

        // Exemple : un cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
    }

    // Boucle d’animation
    animate() {
        requestAnimationFrame(() => this.animate());

        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.renderer.render(this.scene, this.camera);
    }

    start() {
        this.animate();
    }
}




