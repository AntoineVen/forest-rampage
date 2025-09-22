import { Game } from "./game.js";
export function initMenu(game) {
    const menu = document.getElementById("menu");
    const playBtn = document.getElementById("play-btn");
    const creditsBtn = document.getElementById("credits-btn");
    const optionsBtn = document.getElementById("options-btn");
    const ath = document.getElementById("ath");

    playBtn.addEventListener("click", () => {
        menu.style.display = "none"; // cache le menu
        ath.style.display = "block"; // affiche l'ATH
        game.start();              // démarre la boucle du jeu
    });

    creditsBtn.addEventListener("click", () => {
        alert("Forest Rampage\nCréé par Antoine Venturelli\n© 2025");
    });

    optionsBtn.addEventListener("click", () => {
        alert("Options à venir...");
    });

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
        game.resetGame();
    });
    document.getElementById('options-btn').addEventListener('click', () => {
        console.log('Ouvrir options');
        //code pour options
    });

    // Bouton retour au menu principal depuis le menu pause
    document.getElementById('quit-btn').addEventListener('click', () => {
        togglePause();
        game.resetGame();
        document.getElementById('menu').style.display = 'flex';
        Game.inGame = false;
    });

    // Gestion des boutons Game Over
    document.getElementById('restart-game-btn').addEventListener('click', () => {
        hideGameOver();
        game.resetGame();
    });

    // Bouton retour au menu principal depuis le menu Game Over
    document.getElementById('main-menu-btn').addEventListener('click', () => {
        hideGameOver();
        game.resetGame();
        document.getElementById('menu').style.display = 'flex';
        Game.inGame = false;
    });
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
