/* Ajusta el tamano del menu y del juego a la ventana.
   - Escritorio: el juego se centra y se agranda un poco.
   - Movil / pantallas pequenas: el juego se escala para caber completo en la pantalla y
     abajo (o a los lados si el telefono esta horizontal) aparecen los botones de movimiento. */
function fitGame() {
	var w = window.innerWidth, h = window.innerHeight;
	var root = document.documentElement;
	var desktop = w >= 1025 && h >= 641;
	var land = w > h;
	var s = 1, avail = h;

	if (desktop) {
		// la caja del juego mide aprox. 570 x 705 px
		s = Math.min(w / 640, h / 740);
		s = Math.max(1, Math.min(s, 1.6));
	} else {
		var padH = 0;
		if (!land) { 
			// zona de botones abajo (vertical): 2 filas de botones
			padH = Math.max(150, Math.min(190, Math.round(h * 0.24)));
		}
		avail = h - padH;
		s = Math.min(w / 575, avail / 710);
		s = Math.max(0.2, s);
		root.style.setProperty('--pad-h', padH + 'px');
	}
	root.style.setProperty('--s', s.toFixed(3));
	root.style.setProperty('--avail', avail + 'px');
	root.classList.toggle('mobile', !desktop);
	root.classList.toggle('land', land);
}
window.addEventListener('resize', fitGame);
window.addEventListener('orientationchange', function() { setTimeout(fitGame, 150); });
fitGame();
