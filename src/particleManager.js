export class ParticleManager {
    static MAX_PARTICLES = 300; // limite le nombre de particules pour la performance
    constructor(scene) {
        this.particles = []; // tableau pour les particules
        this.scene = scene;
    }

    createParticle(position, color = 0xffffff, life = 1) {
        // Supprime la plus ancienne si on dépasse le max
        if (this.particles.length >= ParticleManager.MAX_PARTICLES) {
            const old = this.particles.shift(); // retire la première (la plus ancienne)
            this.scene.remove(old);
        }

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.Float32BufferAttribute([position.x, position.y, position.z], 3));

        const mat = new THREE.PointsMaterial({
            color: color,
            size: 0.2,
            transparent: true,
            opacity: 0.6       // transparence
        });

        const point = new THREE.Points(geom, mat);
        point.userData = {
            life: life,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                Math.random() * 2,
                (Math.random() - 0.5) * 2
            )
        };
        this.scene.add(point);
        this.particles.push(point);
    }

    updateParticles(delta) {
        // --- Particules ---
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            // déplacement selon la vitesse
            p.position.add(p.userData.velocity.clone().multiplyScalar(delta * 5));
            // gravité légère
            p.userData.velocity.y -= 9.8 * delta * 0.2;
            // diminution de la durée de vie
            p.userData.life -= delta;
            // suppression si durée écoulée
            if (p.userData.life <= 0) {
                this.scene.remove(p);
                this.particles.splice(i, 1);
            }
        }
    }

    playerMoveForward(car) {
        for (let i = 0; i < 3; i++) {
            let offset = new THREE.Vector3(0, 0, 2).applyAxisAngle(new THREE.Vector3(0, 1, 0), car.rotation.y);
            let pos = car.position.clone().sub(offset).add(new THREE.Vector3((Math.random() - 0.5) * 0.5, 0, (Math.random() - 0.5) * 0.5));
            this.createParticle(pos, 0x000000, 0.5);
        }
    }
}
