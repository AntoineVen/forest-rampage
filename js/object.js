export class Object {
    constructor(name, position) {
        this.name = name;
        this.position = position; // position should be a THREE.Vector3
    }

    info() {
        return `Object: ${this.name}, Position: (${this.position.x}, ${this.position.y}, ${this.position.z})`;
    }
}