import { Game } from './game.js';
import { initMenu } from './menu.js';

// Crée une instance du jeu
const game = new Game();
// Initialise le menu en lui passant la référence du jeu
initMenu(game);