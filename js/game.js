export class Game {
    constructor() {
        // Initialisation du jeu
        // Crée le moteur de rendu
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Ajoute le canvas généré par Three.js dans la page
        document.body.appendChild(this.renderer.domElement);

        // Crée une scène
        this.scene = new THREE.Scene();

        // Ajoute une caméra
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

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




