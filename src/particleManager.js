const MAX_PARTICLES = 300; // nombre max de particules
export function createParticle(scene, particles, position, color = 0xffffff, life = 1) {
    // Supprime la plus ancienne si on dépasse le max
    if (particles.length >= MAX_PARTICLES) {
        const old = particles.shift(); // retire la première (la plus ancienne)
        scene.remove(old);
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute([position.x, position.y, position.z], 3));

    const mat = new THREE.PointsMaterial({
        color: color,
        size: 0.2,         // tu peux réduire à 0.1 pour densité plus forte
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
    scene.add(point);
    particles.push(point);
}

export function updateParticles(scene, particles, delta) {
    // --- Particules ---
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        // déplacement selon la vitesse
        p.position.add(p.userData.velocity.clone().multiplyScalar(delta * 5));
        // gravité légère
        p.userData.velocity.y -= 9.8 * delta * 0.2;
        // diminution de la durée de vie
        p.userData.life -= delta;
        // suppression si durée écoulée
        if (p.userData.life <= 0) {
            scene.remove(p);
            particles.splice(i, 1);
        }
    }
}