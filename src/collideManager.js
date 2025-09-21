import { TreeFactory } from "./objects/treeFactory.js";
export class CollideManager {

    static CAR_RADIUS = 1.5; // rayon de la voiture
    static POST_RADIUS = 0.25; // rayon approximatif du poteau
    static TREE_RADIUS = 1; // rayon approximatif des arbres
    constructor(game) {
        this.game = game;
        this.player = game.player;
        this.car = game.player.mesh;
    }

    handleFenceCollisions(fencePosts) {

        // On parcourt seulement les poteaux
        for (let i = 0; i < fencePosts.length; i++) {
            const post = fencePosts[i];
            const dx = this.car.position.x - post.position.x;
            const dz = this.car.position.z - post.position.z;
            const distance = Math.sqrt(dx * dx + dz * dz);

            if (distance < CollideManager.CAR_RADIUS + CollideManager.POST_RADIUS) {
                // Reculer la voiture
                this.car.position.x += (dx / distance) * (CollideManager.CAR_RADIUS + CollideManager.POST_RADIUS - distance);
                this.car.position.z += (dz / distance) * (CollideManager.CAR_RADIUS + CollideManager.POST_RADIUS - distance);

                // Légère rotation pour réalisme
                this.car.rotation.y += (Math.random() - 0.5) * 0.2;

            }
        }
    }

    handleTreeCollisions(trees) {
        trees.forEach((tree) => {
            const distance = this.car.position.distanceTo(tree.position);

            if (distance < CollideManager.CAR_RADIUS + CollideManager.TREE_RADIUS) {
                // Explosion de l'arbre
                TreeFactory.explodeTree(this.game, tree);

                // Décrémenter vies
                this.player.changeLives(-1);

                // Recul de la voiture
                const pushBack = this.car.position.clone().sub(tree.position).normalize().multiplyScalar(2);
                this.car.position.add(pushBack);
                this.car.rotation.y += (Math.random() - 0.5) * 0.2;

                return;
            }
        });
    }
}