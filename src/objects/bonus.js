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
        } else if (this.type === "shield") {
            player.isInvincible = true; // Rendre le joueur invincible
            const playerShield = createActiveShield(player.mesh); // Crée un bouclier visuel autour de la voiture
            adaptLifeBarForShield(); // Change l'apparence de la barre de vie
            setTimeout(() => {
                player.isInvincible = false; // Enlever l'invincibilité après 5 secondes
                player.mesh.remove(playerShield); // Retire le bouclier visuel
            }, 5000);
        }
    }

    createBonus() {
        if (this.type === "turbo") {
            return createTurboBoostBonus();
        } else if (this.type === "shield") {
            return createShieldBonus();
        }
    }
}

export function createTurboBoostBonus() {
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

// Bonus "Bouclier" gris métal
export function createShieldBonus() {
    const shield = new THREE.Group();

    // Matériaux métal
    const metalLight = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        metalness: 0.8,
        roughness: 0.3,
        flatShading: true
    });
    const metalDark = new THREE.MeshStandardMaterial({
        color: 0x555555,
        metalness: 0.9,
        roughness: 0.4,
        flatShading: true
    });

    // Forme principale : disque low-poly (bouclier simplifié)
    const geom = new THREE.CylinderGeometry(1, 1, 0.2, 8); // polygone à 8 faces
    const core = new THREE.Mesh(geom, metalLight);
    shield.add(core);

    // Bordure plus foncée
    const rimGeom = new THREE.CylinderGeometry(1.1, 1.1, 0.25, 8);
    const rim = new THREE.Mesh(rimGeom, metalDark);
    shield.add(rim);

    // Glow énergétique (léger halo bleuté)
    const glowGeom = new THREE.SphereGeometry(1.3, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0x66ccff,
        transparent: true,
        opacity: 0.25
    });
    const glow = new THREE.Mesh(glowGeom, glowMat);
    shield.add(glow);

    // Position et échelle
    shield.position.set(0, 1, 0);
    shield.scale.set(1.2, 1.2, 1.2);

    // Animation flottante + rotation lente
    shield.tick = () => {
        const time = Date.now() * 0.002;
        shield.position.y = 1 + Math.sin(time * 2) * 0.2; // effet de flottement
        shield.rotation.y += 0.01; // rotation lente
        glow.material.opacity = 0.25 + 0.1 * Math.sin(time * 5); // pulsing glow
    };

    return shield;
}

function createActiveShield(car) {
    const shieldGeom = new THREE.SphereGeometry(3.5, 16, 16);
    const shieldMat = new THREE.MeshBasicMaterial({
        color: 0x66ccff,
        transparent: true,
        opacity: 0.25
    });
    const shieldMesh = new THREE.Mesh(shieldGeom, shieldMat);

    // Attach au joueur
    car.add(shieldMesh);

    // Animation pulsante
    shieldMesh.tick = () => {
        const time = Date.now() * 0.002;
        shieldMesh.material.opacity = 0.25 + 0.1 * -Math.sin(time * 2);
        shieldMesh.scale.setScalar(1 + 0.075 * Math.sin(time * 2));
    };

    return shieldMesh;
}

function showShieldHUD(duration = 5) {
    const hud = document.getElementById("shield-hud");
    const timerText = document.getElementById("shield-timer");
    hud.style.display = "flex";

    let startTime = Date.now();
    const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = Math.ceil(Math.max(0, duration - elapsed));
        timerText.textContent = remaining;

        if (remaining <= 0) {
            hud.style.display = "none";
            clearInterval(interval);
        }
    }, 100);
}

function adaptLifeBarForShield() {
    showShieldHUD(5); // Affiche le HUD du bouclier pendant 5 secondes
    // --- Activer le bouclier
    const lifeBar = document.getElementById('life-bar');
    // Sauvegarde des styles initiaux
    const originalLifeBarStyle = {
        background: lifeBar.style.background || getComputedStyle(lifeBar).background,
        boxShadow: lifeBar.style.boxShadow || getComputedStyle(lifeBar).boxShadow
    };
    lifeBar.style.background = 'linear-gradient(90deg, #00CCFF, #0066FF)';
    lifeBar.style.boxShadow = '0 0 10px #00CCFF, 0 0 20px #0066FF';
    const lifeContainer = document.getElementById('life-container');
    lifeContainer.style.border = '2px solid #00CCFF'; // bleu
    setTimeout(() => {
        // Restaure les styles initiaux
        lifeBar.style.background = originalLifeBarStyle.background;
        lifeBar.style.boxShadow = originalLifeBarStyle.boxShadow;
        lifeContainer.style.border = '2px solid #FFD700'; // jaune
    }, 5000);
}

