import { Object } from "./object";

export class Player extends Object {
    constructor(name, position, health) {
        super(name, position);
        this.health = health;
    }
    // Méthode pour infliger des dégâts au joueur
    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
    }
    // Méthode pour vérifier si le joueur est en vie
    isAlive() {
        return this.health > 0;
    }
    // Surcharge de la méthode info pour inclure la santé
    info() {
        return `${super.info()}, Health: ${this.health}`;
    }
}