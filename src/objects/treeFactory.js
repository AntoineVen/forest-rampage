export class TreeFactory {
    static totalTrees = 0; // compteur statique pour le nombre total d'arbres créés

    // CHÊNES (sphères)
    createOakTree(range = 400) {
        const treeGroup = new THREE.Group();
        TreeFactory.totalTrees++;

        // facteur de taille aléatoire
        const scale = Math.random() * 1.5 + 0.5; // de 0.5 à 2

        // tronc
        const trunkHeight = 3 * scale;
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3 * scale, 0.3 * scale, trunkHeight, 12),
            new THREE.MeshPhongMaterial({ color: 0x8B4513 })
        );
        trunk.position.y = trunkHeight / 2;
        treeGroup.add(trunk);

        // feuillage
        const leavesGroup = new THREE.Group();
        const leafMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22, flatShading: true });
        for (let j = 0; j < 5; j++) {
            const sphereSize = 1.5 * scale;
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(sphereSize, 8, 8),
                leafMaterial
            );
            sphere.position.set(
                (Math.random() - 0.5) * 2 * scale,
                trunkHeight + Math.random() * 1.5 * scale,
                (Math.random() - 0.5) * 2 * scale
            );
            leavesGroup.add(sphere);
        }
        treeGroup.add(leavesGroup);

        // position aléatoire
        treeGroup.position.set((Math.random() - 0.5) * range, 0, (Math.random() - 0.5) * range);

        return treeGroup;
    }

    // SAPINS (cônes)
    createPineTree(range = 400) {
        TreeFactory.totalTrees++;

        const height = Math.random() * 5 + 5; // hauteur du cône
        const radius = height / 3;

        // Tronc
        const trunkHeight = height / 4;
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, trunkHeight, 6);
        const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // marron
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = trunkHeight / 2; // base sur le sol

        // Feuillage
        const coneGeometry = new THREE.ConeGeometry(radius, height, 8);
        const coneMaterial = new THREE.MeshPhongMaterial({ color: 0x006400 });
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.position.y = trunkHeight + height / 2; // au-dessus du tronc

        // Groupe
        const pineGroup = new THREE.Group();
        pineGroup.add(trunk);
        pineGroup.add(cone);

        // Position aléatoire
        pineGroup.position.x = (Math.random() - 0.5) * range;
        pineGroup.position.z = (Math.random() - 0.5) * range;

        return pineGroup;
    }
}