/* Ajusta el tamano del menu y del juego a la ventana (solo escritorio) */
function fitGame() {
	var w = window.innerWidth, h = window.innerHeight;
	var desktop = w >= 1025 && h >= 641;
	var s = 1;
	if (desktop) {
		// la caja del juego mide aprox. 570 x 705 px
		s = Math.min(w / 640, h / 740);
		s = Math.max(1, Math.min(s, 1.6));
	}
	document.documentElement.style.setProperty('--s', s.toFixed(3));
}
window.addEventListener('resize', fitGame);
fitGame();
