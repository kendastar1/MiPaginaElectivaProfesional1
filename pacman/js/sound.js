var EATING_SOUND = new buzz.sound([
    "./sound/eating.mp3" 
]);
var GHOST_EATEN_SOUND = new buzz.sound([
	"./sound/ghost-eaten.mp3" 
]);
var EXTRA_LIFE_SOUND = new buzz.sound([
    "./sound/extra-life.mp3" 
]);
var EAT_PILL_SOUND = new buzz.sound([
    "./sound/eat-pill.mp3" 
]);
var EAT_FRUIT_SOUND = new buzz.sound([
    "./sound/eat-fruit.mp3" 
]);
var EAT_GHOST_SOUND = new buzz.sound([
    "./sound/eat-ghost.mp3" 
]);
var SIREN_SOUND = new buzz.sound([
    "./sound/siren.wav" 
]);
var WAZA_SOUND = new buzz.sound([
    "./sound/turn-to-blue.wav" 
]);
var READY_SOUND = new buzz.sound([
    "./sound/ready.mp3" 
]);
var DIE_SOUND = new buzz.sound([
    "./sound/die.mp3" 
]);

var GROUP_SOUND = new buzz.group( [ EATING_SOUND, SIREN_SOUND, EAT_PILL_SOUND, EAT_GHOST_SOUND, READY_SOUND, DIE_SOUND, WAZA_SOUND, GHOST_EATEN_SOUND, EXTRA_LIFE_SOUND, EAT_FRUIT_SOUND ] );


/* ---------- Sirena y turn-to-blue en bucle SIN CORTES (Web Audio API) ----------
   El elemento <audio> siempre deja un pequeno hueco al repetir. Con un AudioBufferSource
   en loop el audio se repite de forma continua. Si el navegador no lo soporta,
   se usa el sonido normal (SIREN_SOUND / WAZA_SOUND) como respaldo. */
var WA_CTX = null, WA_MUTED = false;

function makeLoopWA(getBase64) { 
	return { gain: null, buffer: null, source: null, ready: false, failed: false, wantPlay: false, started: false, getBase64: getBase64 };
}
var SIREN_WA = makeLoopWA(function() { return (typeof SIREN_WAV_BASE64 === "undefined") ? null : SIREN_WAV_BASE64; });
var WAZA_WA  = makeLoopWA(function() { return (typeof WAZA_WAV_BASE64 === "undefined") ? null : WAZA_WAV_BASE64; });
/* Sonido de comer puntos: en el movil el <audio> en bucle deja un hueco al repetir.
   Con Web Audio el bucle es continuo y a 1.35x igual que en PC. */
var EAT_WAV_BASE64 = "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";
var EAT_WA = makeLoopWA(function() { return EAT_WAV_BASE64; });
EAT_WA.rate = 1.35;

function initLoopWA(L) { 
	if ( L.started || L.failed ) return;
	try { 
		var AC = window.AudioContext || window.webkitAudioContext;
		var data = L.getBase64();
		if ( !AC || !data ) { L.failed = true; return; }
		if ( !WA_CTX ) WA_CTX = new AC();
		L.started = true;
		L.gain = WA_CTX.createGain();
		L.gain.gain.value = WA_MUTED ? 0 : 1;
		L.gain.connect(WA_CTX.destination);
		var bin = atob(data);
		var bytes = new Uint8Array(bin.length);
		for ( var i = 0; i < bin.length; i++ ) bytes[i] = bin.charCodeAt(i);
		WA_CTX.decodeAudioData(bytes.buffer, function(buffer) { 
			L.buffer = buffer;
			L.ready = true;
			if ( L.onReady ) { if ( L.wantPlay ) L.onReady(); } else if ( L.wantPlay ) startLoopWA(L);
		}, function() { L.failed = true; });
	} catch (e) { L.failed = true; }
}
function startLoopWA(L) { 
	L.wantPlay = true;
	if ( !L.ready ) return;
	if ( WA_CTX.state === "suspended" ) WA_CTX.resume();
	if ( L.source ) return; // ya esta sonando
	var src = WA_CTX.createBufferSource();
	src.buffer = L.buffer;
	src.loop = true;
	if ( L.rate ) src.playbackRate.value = L.rate;
	src.connect(L.gain);
	src.start(0);
	L.source = src;
}
function stopLoopWA(L) { 
	L.wantPlay = false;
	if ( L.source ) { 
		try { L.source.stop(0); } catch (e) {}
		L.source.disconnect();
		L.source = null;
	}
}

function initSirenWA() { initLoopWA(SIREN_WA); }
function startSirenWA() { startLoopWA(SIREN_WA); }
function stopSirenWA() { stopLoopWA(SIREN_WA); }
function initWazaWA() { initLoopWA(WAZA_WA); }
function startWazaWA() { startLoopWA(WAZA_WA); }
function stopWazaWA() { stopLoopWA(WAZA_WA); }

function setSirenMuted(muted) { 
	WA_MUTED = muted;
	if ( EAT_WA.gain ) EAT_WA.gain.gain.value = muted ? 0 : 1;
	if ( SIREN_WA.gain ) SIREN_WA.gain.gain.value = muted ? 0 : 1;
	if ( WAZA_WA.gain ) WAZA_WA.gain.gain.value = muted ? 0 : 1;
}

var EATING_SOUND_LOOPING = false;

function isAvailableSound() { 
	// Antes se ocultaba el sonido en pantallas pequenas (movil). Ahora siempre esta disponible;
	// el usuario lo silencia con el boton de la bocina.
	return true;
}

/* ---------- Desbloqueo de audio en el movil ----------
   Los navegadores moviles (Chrome Android, Safari iOS) bloquean el audio hasta que el usuario
   toca la pantalla. En el primer toque reanudamos el AudioContext y "activamos" cada elemento
   de audio con una reproduccion silenciosa, para que luego suenen cuando el juego lo pida. */
var AUDIO_UNLOCKED = false;
var ALL_SOUNDS = [ EATING_SOUND, GHOST_EATEN_SOUND, EXTRA_LIFE_SOUND, EAT_PILL_SOUND, EAT_FRUIT_SOUND, EAT_GHOST_SOUND, SIREN_SOUND, WAZA_SOUND, READY_SOUND, DIE_SOUND ];

function unlockAudio() { 
	if ( AUDIO_UNLOCKED ) return;
	AUDIO_UNLOCKED = true;
	try { 
		initSirenWA();
		initWazaWA();
		initLoopWA(EAT_WA);
		if ( WA_CTX ) { 
			if ( WA_CTX.state === "suspended" ) WA_CTX.resume();
			// sonido vacio para terminar de activar el contexto en iOS
			var b = WA_CTX.createBuffer(1, 1, 22050);
			var src = WA_CTX.createBufferSource();
			src.buffer = b;
			src.connect(WA_CTX.destination);
			src.start(0);
		}
	} catch (e) {}
	for ( var i = 0; i < ALL_SOUNDS.length; i++ ) { 
		(function(a) { 
			if ( !a || !a.paused || a === READY_SOUND.sound ) return; // si ya esta sonando (o es la musica de inicio) no lo tocamos
			var wasMuted = a.muted;
			try { 
				a.muted = true;
				var p = a.play();
				var done = function() { 
					try { a.pause(); a.currentTime = 0; } catch (e) {}
					a.muted = wasMuted;
				};
				if ( p && p.then ) { p.then(done, function() { a.muted = wasMuted; }); } else { done(); }
			} catch (e) { a.muted = wasMuted; }
		})(ALL_SOUNDS[i].sound);
	}
	// si la sirena o el sonido azul ya estaban pedidos, que arranquen
	if ( WA_CTX && WA_CTX.state === "suspended" ) WA_CTX.resume();
}

function bindAudioUnlock() { 
	var evs = ["touchend", "click", "mousedown", "keydown"];
	var handler = function() { 
		unlockAudio();
		for ( var i = 0; i < evs.length; i++ ) document.removeEventListener(evs[i], handler, true);
	};
	for ( var i = 0; i < evs.length; i++ ) document.addEventListener(evs[i], handler, true);
}

function loadAllSound() { 
	if ( isAvailableSound() ) GROUP_SOUND.load();
	initSirenWA();
	initWazaWA();
	initLoopWA(EAT_WA);
}

/* Cada punto que se come dispara su propio "waka" (se reinicia el sonido en cada punto).
   Antes era un bucle: en el movil el bucle de <audio> se cortaba y se saltaba puntos. */
function playEatingSound() { 
	if (isAvailableSound()) { 
		initLoopWA(EAT_WA);
		if ( !EAT_WA.failed ) { 
			if ( !EAT_WA.ready ) return;
			if ( WA_CTX.state === "suspended" ) WA_CTX.resume();
			// cortamos el anterior y arrancamos uno nuevo para este punto
			if ( EAT_WA.source ) { 
				var old = EAT_WA.source;
				EAT_WA.source = null;
				old.onended = null;
				try { old.stop(0); } catch (e) {}
				try { old.disconnect(); } catch (e) {}
			}
			var src = WA_CTX.createBufferSource();
			src.buffer = EAT_WA.buffer;
			src.playbackRate.value = EAT_WA.rate;
			src.connect(EAT_WA.gain);
			src.onended = function() { 
				if ( EAT_WA.source === src ) EAT_WA.source = null;
				try { src.disconnect(); } catch (e) {}
			};
			src.start(0);
			EAT_WA.source = src;
		} else { 
			EATING_SOUND.stop();
			EATING_SOUND.setSpeed(1.35);
			EATING_SOUND.play();
		}
	}
}
function stopEatingSound() { 
	// nada: cada "waka" termina solo
}
function killEatingWA() { 
	EAT_WA.wantPlay = false;
	EATING_SOUND_LOOPING = false;
	if ( EAT_WA.source ) { 
		var s = EAT_WA.source;
		EAT_WA.source = null;
		s.onended = null;
		try { s.stop(0); } catch (e) {}
		try { s.disconnect(); } catch (e) {}
	}
}

function playExtraLifeSound() { 
	if (isAvailableSound()) { 
		EXTRA_LIFE_SOUND.play();
	}
}

function playEatFruitSound() { 
	if (isAvailableSound()) { 
		EAT_FRUIT_SOUND.play();
	}
}
function playEatPillSound() { 
	if (isAvailableSound()) { 
		EAT_PILL_SOUND.play();
	}
}
function playEatGhostSound() { 
	if (isAvailableSound()) { 
		EAT_GHOST_SOUND.play();
	}
}

function playWazaSound(restart) { 
	if (isAvailableSound()) { 
		stopSirenSound();
		stopEatSound();
		initWazaWA();
		// Al volverse azules los fantasmas, el sonido se repite en bucle SIN cortes
		// hasta que termina el efecto y vuelven a la normalidad (stopWazaSound)
		if ( !WAZA_WA.failed ) { 
			if ( restart ) stopWazaWA();
			startWazaWA();
		} else { 
			if ( restart ) { 
				WAZA_SOUND.stop();
			}
			// Si ya esta sonando no lo reiniciamos (evita cortes/repeticiones rapidas)
			if ( WAZA_SOUND.isPaused() || WAZA_SOUND.isEnded() ) { 
				WAZA_SOUND.loop();
				WAZA_SOUND.play();
			}
		}
	}
}
function stopWazaSound() { 
	if (isAvailableSound()) { 
		stopWazaWA();
		WAZA_SOUND.stop();
	}
}

function playGhostEatenSound() { 
	if (isAvailableSound()) { 
		stopSirenSound();
		stopWazaSound();
		GHOST_EATEN_SOUND.play();
		GHOST_EATEN_SOUND.loop();
	}
}
function stopEatSound() { 
	if (isAvailableSound()) { 
		GHOST_EATEN_SOUND.stop();
	}
}

function playSirenSound() { 
	if (isAvailableSound()) { 
		stopWazaSound();
		stopEatSound();
		initSirenWA();
		if ( !SIREN_WA.failed ) { 
			startSirenWA();
		} else { 
			SIREN_SOUND.loop();
			SIREN_SOUND.play();
		}
	}
}
function stopSirenSound() { 
	if (isAvailableSound()) { 
		stopSirenWA();
		SIREN_SOUND.stop();
	}
}

function playReadySound() { 
	if (isAvailableSound()) { 
		try { if ( WA_CTX && WA_CTX.state === "suspended" ) WA_CTX.resume(); } catch (e) {}
		READY_SOUND.stop();
		READY_SOUND.play();
		// Primera visita en el movil: si el navegador aun no dejaba sonar (audio bloqueado o
		// sin cargar), reintentamos unas veces mientras dura la pantalla "READY!"
		var tries = 0;
		var retry = function() { 
			tries++;
			if ( tries > 12 || READY_SOUND.getTime() > 0.2 ) return;
			if ( READY_SOUND.isPaused() ) READY_SOUND.play();
			setTimeout(retry, 250);
		};
		setTimeout(retry, 250);
	}
}

function playDieSound() { 
	if (isAvailableSound()) { 
		GROUP_SOUND.stop();
		killEatingWA();
		stopSirenWA();
		stopWazaWA();
		DIE_SOUND.play();
	}
}

function stopAllSound() { 
	if (isAvailableSound()) { 
		killEatingWA();
		stopSirenWA();
		stopWazaWA();
		GROUP_SOUND.stop();
	}
}