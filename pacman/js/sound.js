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
			if ( L.wantPlay ) startLoopWA(L);
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
}

function playEatingSound() { 
	if (isAvailableSound()) { 
		if ( !EATING_SOUND_LOOPING ) { 
			EATING_SOUND_LOOPING = true;
			
			EATING_SOUND.setSpeed(1.35);
			EATING_SOUND.loop();
			EATING_SOUND.play();
		}
	}
}
function stopEatingSound() { 
	if (isAvailableSound()) { 
		if ( EATING_SOUND_LOOPING ) { 
			EATING_SOUND.unloop();
			EATING_SOUND_LOOPING = false;
		}
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
		stopSirenWA();
		stopWazaWA();
		DIE_SOUND.play();
	}
}

function stopAllSound() { 
	if (isAvailableSound()) { 
		stopSirenWA();
		stopWazaWA();
		GROUP_SOUND.stop();
	}
}
