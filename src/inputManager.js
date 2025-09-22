// inputManager.js
export class InputManager {
    constructor() {
        this.keys = {};
        this.listeners = [];

        window.addEventListener("keydown", e => this.onKey(e.key.toLocaleLowerCase(), true));
        window.addEventListener("keyup", e => this.onKey(e.key.toLocaleLowerCase(), false));
        // Gestion du menu pause avec la touche Echap
        // Échap
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'escape') togglePause();
        });

        // Événement bouton pause dans le jeu
        pauseBtnInGame.addEventListener('click', togglePause);

        // Gestion des boutons pause
        document.getElementById('resume-btn').addEventListener('click', togglePause);
        document.getElementById('restart-btn').addEventListener('click', () => {
            console.log('Recommencer le jeu');
            // ajoute ton code de restart
        });
        document.getElementById('options-btn').addEventListener('click', () => {
            console.log('Ouvrir options');
            // ajoute ton code pour options
        });
        document.getElementById('quit-btn').addEventListener('click', () => {
            console.log('Quitter le jeu');
            // ajoute ton code pour quitter
        });
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
const pauseMenu = document.getElementById('pause-menu');
const pauseBtnInGame = document.getElementById('pause-btn-in-game');
let isPaused = false;

// Ouvrir/fermer le menu pause
function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseMenu.classList.add('active');
        // ici tu peux aussi mettre le jeu en pause
    } else {
        pauseMenu.classList.remove('active');
        // reprendre le jeu
    }
}
