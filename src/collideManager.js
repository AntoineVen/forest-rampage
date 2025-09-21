export class CollideManager {
    constructor(car, fencePosts) {
        this.car = car;
        this.fencePosts = fencePosts;
    }

    handleFenceCollisions() {
        const CAR_RADIUS = 1.5; // rayon de la voiture
        const POST_RADIUS = 0.25; // rayon approximatif du poteau

        // On parcourt seulement les poteaux
        for (let i = 0; i < this.fencePosts.length; i++) {
            const post = this.fencePosts[i];
            const dx = this.car.position.x - post.position.x;
            const dz = this.car.position.z - post.position.z;
            const distance = Math.sqrt(dx * dx + dz * dz);

            if (distance < CAR_RADIUS + POST_RADIUS) {
                // Reculer la voiture
                this.car.position.x += (dx / distance) * (CAR_RADIUS + POST_RADIUS - distance);
                this.car.position.z += (dz / distance) * (CAR_RADIUS + POST_RADIUS - distance);

                // Légère rotation pour réalisme
                this.car.rotation.y += (Math.random() - 0.5) * 0.2;

            }
        }
    }
}