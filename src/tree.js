import { Object } from "./object";

export class Tree extends Object {
    constructor(name, position, type) {
        super(name, position);
        this.type = type; // e.g., "oak", "pine", etc.
    }

    // Surcharge de la méthode info pour inclure la hauteur et le type
    info() {
        return `${super.info()}, Type: ${this.type}`;
    }
}