// inputManager.js
export class InputManager {
    constructor() {
        this.keys = {};
        this.listeners = [];

        window.addEventListener("keydown", e => this.onKey(e.key.toLocaleLowerCase(), true));
        window.addEventListener("keyup", e => this.onKey(e.key.toLocaleLowerCase(), false));
    }

    onKey(key, isDown) {
        this.keys[key] = isDown;
        this.listeners.forEach(cb => cb(key, isDown));
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    isDown(key) {
        return !!this.keys[key.toLowerCase()];
    }
}
