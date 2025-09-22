import { Game } from "./game.js";
export class InputManager {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.listeners = [];

        // Écouteurs d'événements pour les touches
        window.addEventListener("keydown", e => this.onKey(e.key.toLocaleLowerCase(), true));
        window.addEventListener("keyup", e => this.onKey(e.key.toLocaleLowerCase(), false));

        // Gestion du menu pause avec la touche Echap
        // Échap
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'escape') togglePause();
        });

        // Événement bouton pause dans le jeu
        document.getElementById('pause-btn-in-game').addEventListener('click', togglePause);

        // Gestion des boutons pause
        document.getElementById('resume-btn').addEventListener('click', togglePause);
        document.getElementById('restart-btn').addEventListener('click', () => {
            togglePause();
            this.game.resetGame();
        });
        document.getElementById('options-btn').addEventListener('click', () => {
            console.log('Ouvrir options');
            //code pour options
        });

        // Bouton retour au menu principal depuis le menu pause
        document.getElementById('quit-btn').addEventListener('click', () => {
            togglePause();
            this.game.resetGame();
            document.getElementById('menu').style.display = 'flex';
            Game.inGame = false;
        });

        // Gestion des boutons Game Over
        document.getElementById('restart-game-btn').addEventListener('click', () => {
            hideGameOver();
            this.game.resetGame();
        });

        // Bouton retour au menu principal depuis le menu Game Over
        document.getElementById('main-menu-btn').addEventListener('click', () => {
            hideGameOver();
            this.game.resetGame();
            document.getElementById('menu').style.display = 'flex';
            Game.inGame = false;
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

// Ouvrir/fermer le menu pause
function togglePause() {
    if (!Game.inGame) return; // ne pas ouvrir le menu pause si on n'est pas en jeu
    const pauseMenu = document.getElementById('pause-menu');
    Game.isPaused = !Game.isPaused;
    if (Game.isPaused) {
        pauseMenu.classList.add('active');
        // mettre le jeu en pause
    } else {
        pauseMenu.classList.remove('active');
        // reprendre le jeu
    }
}

// Afficher le menu Game Over
export function showGameOver() {
    document.getElementById('game-over-menu').classList.add('active');
}
// Cacher le menu Game Over
export function hideGameOver() {
    document.getElementById('game-over-menu').classList.remove('active');
}


