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
}
