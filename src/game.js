

//changeLives(0); // met à jour texte + barre
import { InputManager } from "./inputManager.js";
import { Player } from './objects/player.js';
import { ParticleManager } from "./particleManager.js";
import { CollideManager } from "./collideManager.js";
import { TreeFactory } from "./objects/treeFactory.js";
export class Game {
    static inGame = false; // variable globale pour savoir si on est en jeu (utile pour le menu pause)
    static isPaused = false; // variable globale pour savoir si le jeu est en pause
    constructor() {
        // Variables du jeu
        this.totalCurrentTrees = 0; // nombre total d'arbres actuels
        this.totalTrees = 0; // nombre total d'arbres créés depuis le début
        this.destroyedTrees = 0; // nombre d'arbres détruits

        this.trees = []; // tableau pour les arbres
        this.fencePosts = []; // tableau pour les poteaux de la clôture (collision optimisée)


        // Variables de contrôle
        this.moveForward = false, this.moveBackward = false, this.turnLeft = false, this.turnRight = false;

        // Horloge pour le timing
        this.clock = new THREE.Clock();


        // Initialisation du jeu
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener("resize", () => this.onWindowResize());

        // Caméra
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 10, 15);
        this.camera.lookAt(0, 0, 0);
        this.cameraShakeOffset = new THREE.Vector3(0, 0, 0);

        // Scène
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); // ciel bleu

        // Lumière
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(30, 50, 30);
        this.scene.add(directionalLight);
        this.scene.add(new THREE.AmbientLight(0x404040));

        // Sol
        const groundTexture = new THREE.TextureLoader().load('./assets/images/grassTexture3.png');
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(50, 50); // répète la texture sur le terrain

        const groundGeometry = new THREE.PlaneGeometry(400, 400, 80, 80); // plus de segments pour le bump
        const groundMaterial = new THREE.MeshPhongMaterial({
            map: groundTexture,
            flatShading: true // pour un effet low-poly
        });

        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.scene.add(this.ground);

        // Herbe low-poly
        this.grass = this.createGrassPatch(2500);
        this.scene.add(this.grass);

        // Clôture en bois autour de la carte
        this.fence = this.createMinecraftFence();
        this.scene.add(this.fence);
        this.fencePosts = this.getFencePosts(); // tableau des poteaux pour collision optimisée


        // Gestionnaire de particules
        this.particleManager = new ParticleManager(this.scene);

        // Arbres
        this.treeFactory = new TreeFactory(this);
        for (let i = 0; i < 50; i++) {
            let oak = this.treeFactory.createOakTree(200);
            this.scene.add(oak);
            this.trees.push(oak);
            let pine = this.treeFactory.createPineTree(200);
            this.trees.push(pine);
            this.scene.add(pine);
        }
        this.totalTrees = TreeFactory.totalTrees;
        this.totalCurrentTrees = TreeFactory.totalTrees;
        TreeFactory.updateProgressBar(this.destroyedTrees, this.totalTrees);

        // Gestionnaire d'inputs
        this.input = new InputManager(this);

        // Joueur
        this.player = new Player("Player1", this, this.input, new THREE.Vector3(0, 0, 0), 3);
        this.scene.add(this.player.mesh);

        // Gestionnaire de collisions
        this.collideManager = new CollideManager(this, this.fencePosts);
    }

    resetGame() {
        this.player.changeLives(this.player.maxLives); // met à jour texte + barre
        this.player.setScore(0); // réinitialise le score
        this.player.mesh.visible = true; // rend la voiture principale visible
        this.totalCurrentTrees = TreeFactory.totalTrees; // réinitialise le nombre d'arbres actuels
        this.destroyedTrees = 0; // réinitialise le nombre d'arbres détruits
        TreeFactory.updateProgressBar(this.destroyedTrees, this.totalTrees);
        this.player.mesh.position.set(0, 0, 0); // remet la voiture au centre
        this.player.mesh.rotation.set(0, 0, 0); // remet la voiture droite
        this.camera.position.set(0, 10, 15); // remet la caméra en position initiale
        this.cameraShakeOffset.set(0, 0, 0); // remet le shake de la caméra à zéro
        this.particleManager.particles.forEach(p => this.scene.remove(p)); // supprime toutes les particules
        this.particleManager.particles = [];
        // Supprime les arbres actuels
        this.trees.forEach(tree => this.scene.remove(tree));
        this.trees = [];
        TreeFactory.totalTrees = 0; // réinitialise le compteur d'arbres créés
        // Recrée les arbres
        for (let i = 0; i < 50; i++) {
            let oak = this.treeFactory.createOakTree(200);
            this.scene.add(oak);
            this.trees.push(oak);
            let pine = this.treeFactory.createPineTree(200);
            this.trees.push(pine);
            this.scene.add(pine);
        }
        this.totalTrees = TreeFactory.totalTrees;
        this.totalCurrentTrees = TreeFactory.totalTrees;
        Game.inGame = true; // le jeu est en cours
        Game.isPaused = false; // le jeu n'est pas en pause


    }


    // Boucle d’animation
    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();

        // --- Mettre à jour le joueur en fonction de son move ---
        this.player.updatePlayer(delta);

        // --- Particules ---
        this.particleManager.updateParticles(delta);

        // --- Collisions ---
        this.collideManager.handleFenceCollisions(this.fencePosts);
        this.collideManager.handleTreeCollisions(this.trees);

        // --- Caméra ---
        this.updateCameraPosition();


        // --- Rendu ---
        this.renderer.render(this.scene, this.camera);
    }

    start() {
        Game.inGame = true; // le jeu est en cours
        this.animate();
    }

    onWindowResize() {
        // Ajuster la caméra
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        // Ajuster le renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    updateCameraPosition() {
        // position normale de la caméra
        const relativeCameraOffset = new THREE.Vector3(0, 5, -10);

        // applique le recul si explosion
        const offsetWithShake = relativeCameraOffset.clone().add(this.cameraShakeOffset);

        // transforme en coordonnées mondiales
        const cameraTargetPos = offsetWithShake.applyMatrix4(this.player.mesh.matrixWorld);

        // lissage du mouvement
        this.camera.position.lerp(cameraTargetPos, 0.1);

        // regarde toujours la voiture
        this.camera.lookAt(this.player.mesh.position);
    }

    // --- HERBE LOW-POLY ---
    createGrassPatch(num = 500) {
        const grassGroup = new THREE.Group();
        const grassMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00, flatShading: true });

        for (let i = 0; i < num; i++) {
            const height = 0.5 + Math.random() * 1; // hauteur aléatoire
            const width = 0.1 + Math.random() * 0.1;

            // brin d'herbe en triangle
            const geometry = new THREE.ConeGeometry(width, height, 3);
            const blade = new THREE.Mesh(geometry, grassMaterial);

            // position aléatoire sur le sol
            blade.position.x = (Math.random() - 0.5) * 400;
            blade.position.z = (Math.random() - 0.5) * 400;
            blade.position.y = height / 2; // pour que la base touche le sol

            // rotation aléatoire
            blade.rotation.y = Math.random() * Math.PI;

            grassGroup.add(blade);
        }

        return grassGroup;
    }


    // --- CLÔTURE EN BOIS AUTOUR DE LA CARTE ---
    createMinecraftFence() {
        const fenceGroup = new THREE.Group();
        const mapSize = 400;           // taille du terrain
        const postHeight = 2.5;        // hauteur des poteaux
        const postThickness = 0.2;     // largeur des poteaux
        const railHeight = 1.5;        // hauteur des lattes
        const railThickness = 0.15;    // épaisseur des lattes
        const panelSpacing = 3;        // distance entre poteaux
        const postMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513, flatShading: true });
        const railMaterial = postMaterial;

        const numPostsPerSide = Math.floor(mapSize / panelSpacing) + 1;

        for (let i = 0; i < numPostsPerSide; i++) {
            const offset = -mapSize / 2 + i * panelSpacing;

            // --- CÔTÉ AVANT (z positif) ---
            const postFront = new THREE.Mesh(new THREE.BoxGeometry(postThickness, postHeight, postThickness), postMaterial);
            postFront.position.set(offset, postHeight / 2, mapSize / 2);
            fenceGroup.add(postFront);

            if (i < numPostsPerSide - 1) {
                const railFront = new THREE.Mesh(new THREE.BoxGeometry(panelSpacing, railThickness, railThickness), railMaterial);
                railFront.position.set(offset + panelSpacing / 2, railHeight, mapSize / 2);
                fenceGroup.add(railFront);
            }

            // --- CÔTÉ ARRIÈRE (z négatif) ---
            const postBack = postFront.clone();
            postBack.position.z = -mapSize / 2;
            fenceGroup.add(postBack);

            if (i < numPostsPerSide - 1) {
                const railBack = new THREE.Mesh(new THREE.BoxGeometry(panelSpacing, railThickness, railThickness), railMaterial);
                railBack.position.set(offset + panelSpacing / 2, railHeight, -mapSize / 2);
                fenceGroup.add(railBack);
            }

            // --- CÔTÉ GAUCHE (x négatif) ---
            const postLeft = new THREE.Mesh(new THREE.BoxGeometry(postThickness, postHeight, postThickness), postMaterial);
            postLeft.position.set(-mapSize / 2, postHeight / 2, offset);
            fenceGroup.add(postLeft);

            if (i < numPostsPerSide - 1) {
                const railLeft = new THREE.Mesh(new THREE.BoxGeometry(railThickness, railThickness, panelSpacing), railMaterial);
                railLeft.position.set(-mapSize / 2, railHeight, offset + panelSpacing / 2);
                fenceGroup.add(railLeft);
            }

            // --- CÔTÉ DROIT (x positif) ---
            const postRight = postLeft.clone();
            postRight.position.x = mapSize / 2;
            fenceGroup.add(postRight);

            if (i < numPostsPerSide - 1) {
                const railRight = new THREE.Mesh(new THREE.BoxGeometry(railThickness, railThickness, panelSpacing), railMaterial);
                railRight.position.set(mapSize / 2, railHeight, offset + panelSpacing / 2);
                fenceGroup.add(railRight);
            }
        }

        return fenceGroup;
    }

    getFencePosts() {
        // --- COLLISION OPTIMISÉE VOITURE / CLÔTURE ---
        // Crée un tableau pour stocker uniquement les poteaux de la clôture
        const fencePosts = [];
        this.scene.traverse(obj => {
            // On récupère uniquement les poteaux : BoxGeometry vertical
            if (obj.isMesh && obj.geometry.type === "BoxGeometry" && obj.geometry.parameters.height >= 2) {
                fencePosts.push(obj);
            }
        });
        return fencePosts;
    }

}




