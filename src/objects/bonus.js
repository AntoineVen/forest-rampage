import { GameObject } from "./object.js";
// Fonction pour créer un Turbo Boost stylisé low-poly “fractale” avec inclinaison et glow renforcés
export class Bonus extends GameObject {
    constructor(name, position, type) {
        super(name, position);
        this.type = type; // type de bonus, ex: "turbo"
        this.mesh = this.createBonus();
        this.mesh.position.copy(position);
    }

    applyEffect(player) {
        if (this.type === "turbo") {
            player.setSpeed(2 * player.speed); // Double la vitesse du joueur
            setTimeout(() => {
                player.setSpeed(1); // Remet la vitesse normale après 5 secondes
            }, 5000);
        }
    }

    createBonus() {
        if (this.type === "turbo") {
            return createTurboBoost();
        }
    }
}

export function createTurboBoost() {
    const lightning = new THREE.Group();

    // Matériaux
    const yellowMat = new THREE.MeshStandardMaterial({
        color: 0xFFFF33,
        emissive: 0xFFEE33,
        flatShading: true
    });
    const orangeMat = new THREE.MeshStandardMaterial({
        color: 0xFFAA00,
        emissive: 0xFF7700,
        flatShading: true
    });

    // Utilitaire : créer un segment d’éclair
    function createSegment(width, height, depth, material, rotationZ = 0, offsetY = 0) {
        const geom = new THREE.BoxGeometry(width, height, depth);
        const mesh = new THREE.Mesh(geom, material);
        mesh.rotation.z = rotationZ;
        mesh.position.y = offsetY + height / 2;
        return mesh;
    }

    // Segments principaux – inclinaison plus prononcée
    lightning.add(createSegment(0.25, 0.5, 0.1, yellowMat, 0.5, 0));        // bas
    lightning.add(createSegment(0.2, 0.45, 0.1, orangeMat, -0.5, 0.45));    // milieu
    lightning.add(createSegment(0.18, 0.4, 0.1, yellowMat, 0.45, 0.85));    // milieu haut
    lightning.add(createSegment(0.15, 0.35, 0.1, orangeMat, -0.4, 1.2));    // haut
    lightning.add(createSegment(0.12, 0.25, 0.1, yellowMat, 0.35, 1.5));    // pointe

    // Mini-branches fractales – plus inclinées
    lightning.add(createSegment(0.08, 0.2, 0.05, orangeMat, 0.7, 0.7));
    lightning.add(createSegment(0.08, 0.15, 0.05, orangeMat, -0.7, 1.0));
    lightning.add(createSegment(0.06, 0.1, 0.05, yellowMat, 0.75, 1.3));

    // Glow plus fort et plus large
    const glowGeom = new THREE.SphereGeometry(1.0, 12, 12);
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0xFFFF33,
        transparent: true,
        opacity: 0.45
    });
    const glow = new THREE.Mesh(glowGeom, glowMat);
    glow.position.y = 0.8;
    lightning.add(glow);

    // Position et échelle
    lightning.position.set(0, 1, 0);
    lightning.scale.set(1.5, 1.5, 1.5);

    // Animation plus dynamique
    lightning.tick = () => {
        const time = Date.now() * 0.002;
        const scale = 1 + 0.05 * Math.sin(time * 2) + 0.03 * Math.sin(time * 7);
        lightning.scale.set(scale * 1.5, scale * 1.5, 1.5);
        lightning.rotation.y += 0.02;
        lightning.rotation.x = 0.08 * Math.sin(time * 3);
    };

    return lightning;
}
