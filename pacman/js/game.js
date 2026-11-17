var KEYDOWN = false;
var PAUSE = false;
var LOCK = false;

var HIGHSCORE = 0;
var SCORE = 0;
var SCORE_BUBBLE = 10;
var SCORE_SUPER_BUBBLE = 50;
var SCORE_GHOST_COMBO = 200;

var LIFES = 2;
var GAMEOVER = false;

var LEVEL = 1;
var LEVEL_NEXT_TIMER = -1;
var LEVEL_NEXT_STATE = 0;

var TIME_GENERAL_TIMER = -1;
var TIME_GAME = 0;
var TIME_LEVEL = 0;
var TIME_LIFE = 0;
var TIME_FRUITS = 0;

var HELP_DELAY = 1500;
var HELP_TIMER = -1;
			
function blinkHelp() { 
	if ( !$('.help-button').length ) return;
	if ( $('.help-button').attr("class").indexOf("yo") > -1 ) { 
		$('.help-button').removeClass("yo");
	} else { 
		$('.help-button').addClass("yo");
	}
}

function initGame(newgame) { 

	if (newgame) { 
		stopPresentation();
		stopTrailer();
	
		HOME = false;
		GAMEOVER = false;

		$('#help').fadeOut("slow");
		
		score(0);
		if (typeof quizResetStats === "function") quizResetStats();
		clearMessage();
		$("#home").hide();
		$("#panel").show();
		$("html").addClass("in-game");
		
		var ctx = null;
		var canvas = document.getElementById('canvas-panel-title-pacman');
		canvas.setAttribute('width', '38');
		canvas.setAttribute('height', '32');
		if (canvas.getContext) { 
			ctx = canvas.getContext('2d');
		}
		
		var x = 15;
		var y = 16;
		
		ctx.fillStyle = "#fff200";
		ctx.beginPath();
		ctx.arc(x, y, 14, (0.35 - (3 * 0.05)) * Math.PI, (1.65 + (3 * 0.05)) * Math.PI, false);
		ctx.lineTo(x - 5, y);
		ctx.fill();
		ctx.closePath();
		
		x = 32;
		y = 16;
		
		ctx.fillStyle = "#dca5be";
		ctx.beginPath();
		ctx.arc(x, y, 4, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.closePath();
	}

	initBoard();
	drawBoard();
	drawBoardDoor();
	
	initPaths();
	drawPaths();
	
	initBubbles();
	drawBubbles();
	
	initFruits();
	
	initPacman();
	drawPacman();
	
	initGhosts();
	drawGhosts();
	
	lifes();
	
	ready();
}

function win() { 
	stopAllSound();

	LOCK = true;
	stopPacman();
	stopGhosts();
	stopBlinkSuperBubbles();
	stopTimes();
	
	eraseGhosts();

	// Se comio el ultimo punto del tablero (la fruta es opcional): la partida termina.
	// Primero parpadean las paredes en blanco (prepareNextLevel) y despues salen los resultados.
	FINAL_SCORE = SCORE;
	GAMEOVER = true;
	clearMessage();
	setTimeout("prepareNextLevel()", 1000);
}
function prepareNextLevel(i) { 
	if ( LEVEL_NEXT_TIMER === -1 ) { 
		eraseBoardDoor();
		LEVEL_NEXT_TIMER = setInterval("prepareNextLevel()", 250);
	} else { 
		LEVEL_NEXT_STATE ++;
		drawBoard( ((LEVEL_NEXT_STATE % 2) === 0) );
		
		if ( LEVEL_NEXT_STATE > 6) { 
			LEVEL_NEXT_STATE = 0;
			clearInterval(LEVEL_NEXT_TIMER);
			LEVEL_NEXT_TIMER = -1;
			// En vez de pasar al siguiente nivel, se muestran los resultados
			if ( RESULTS_TIMER !== -1 ) clearTimeout(RESULTS_TIMER);
			RESULTS_TIMER = setTimeout(function() { showResults(true); }, 500);
		}
	}
}
function nextLevel() { 
	LOCK = false;
	
	LEVEL ++;
	
	erasePacman();
	eraseGhosts();
	
	resetPacman();
	resetGhosts();

	initGame();
	
	TIME_LEVEL = 0;
	TIME_LIFE = 0;
	TIME_FRUITS = 0;
}


function retry() { 
	stopTimes();

	erasePacman();
	eraseGhosts();
	
	resetPacman();
	resetGhosts();
	
	drawPacman();
	drawGhosts();
	
	TIME_LIFE = 0;
	TIME_FRUITS = 0;
	
	ready();
}

function ready() { 
	LOCK = true;
	message("ready!");
	
	playReadySound();
	setTimeout("go()", "4100");
}
function go() { 
	playSirenSound();

	// Aplicar velocidad según dificultad seleccionada en el menú
	if (typeof GAME_DIFFICULTY !== 'undefined' && GAME_DIFFICULTY === 'dificil') {
		GHOST_MOVING_SPEED = GHOST_MOVING_SPEED_HARD;
	} else {
		GHOST_MOVING_SPEED = GHOST_MOVING_SPEED_NORMAL;
	}
	GHOST_POSITION_STEP = 2; // siempre 2px para respetar la cuadrícula

	LOCK = false;
	
	startTimes();
	
	clearMessage();
	blinkSuperBubbles();

	movePacman();

	moveGhosts();
}
function startTimes() { 
	if (TIME_GENERAL_TIMER === -1) { 
		TIME_GENERAL_TIMER = setInterval("times()", 1000);
	}
}
function times() { 
	TIME_GAME ++;
	TIME_LEVEL ++;
	TIME_LIFE ++;
	TIME_FRUITS ++;
	
	fruit();
}
function pauseTimes() { 
	if (TIME_GENERAL_TIMER != -1) { 
		clearInterval(TIME_GENERAL_TIMER);
		TIME_GENERAL_TIMER = -1;
	}
	if (FRUIT_CANCEL_TIMER != null) FRUIT_CANCEL_TIMER.pause();
}
function resumeTimes() { 
	startTimes();
	if (FRUIT_CANCEL_TIMER != null) FRUIT_CANCEL_TIMER.resume();
}
function stopTimes() { 
	if (TIME_GENERAL_TIMER != -1) { 
		clearInterval(TIME_GENERAL_TIMER);
		TIME_GENERAL_TIMER = -1;
	}
	if (FRUIT_CANCEL_TIMER != null) { 
		FRUIT_CANCEL_TIMER.cancel();
		FRUIT_CANCEL_TIMER = null;
		eraseFruit();
	}
}

function pauseGame() { 

	if (!PAUSE) { 
		stopAllSound();
		PAUSE = true;
		
		message("pause");
		
		pauseTimes();
		pausePacman();
		pauseGhosts();
		stopBlinkSuperBubbles();
	}
}
function resumeGame() { 
	if (PAUSE) { 
		testStateGhosts();

		PAUSE = false;
		
		clearMessage();
		
		resumeTimes();
		resumePacman();
		resumeGhosts();
		blinkSuperBubbles();
	}
}

function lifes(l) { 
	if (l) { 
		if ( l > 0 ) { 
			playExtraLifeSound();
		}
		LIFES += l;
	}
	
	var canvas = document.getElementById('canvas-lifes');
	canvas.setAttribute('width', '120');
	canvas.setAttribute('height', '30');
	if (canvas.getContext) { 
		var ctx = canvas.getContext('2d');
		
		ctx.clearRect(0, 0, 120, 30);
		ctx.fillStyle = "#fff200";
		for (var i = 0, imax = LIFES; (i < imax && i < 4); i ++) { 
			ctx.beginPath();
			
			var lineToX = 13;
			var lineToY = 15;
			
			ctx.arc(lineToX + (i * 30), lineToY, 13, (1.35 - (3 * 0.05)) * Math.PI, (0.65 + (3 * 0.05)) * Math.PI, false);
			ctx.lineTo(lineToX + (i * 30) + 4, lineToY);
			ctx.fill();
			ctx.closePath();
		}
	}
}

/* ---------- Pantalla de resultados (al terminar la partida) ---------- */
var FINAL_SCORE = 0;
var RESULTS_OPEN = false;
var RESULTS_TIMER = -1;

function showResults(won) { 
	RESULTS_TIMER = -1;
	var ok = QUIZ_CORRECT;
	var bad = Math.max(0, QUIZ_TOTAL - QUIZ_CORRECT);
	$("#results-title").text(won ? "ganaste!" : "game over").toggleClass("win", !!won);
	$("#res-score").text(FINAL_SCORE);
	$("#res-ok").text(ok);
	$("#res-bad").text(bad);
	clearMessage();
	$("html").removeClass("in-game");
	RESULTS_OPEN = true;
	$("#results").show();
}
function hideResults() { 
	if ( RESULTS_TIMER !== -1 ) { clearTimeout(RESULTS_TIMER); RESULTS_TIMER = -1; }
	RESULTS_OPEN = false;
	$("#results").hide();
}
function restartFromResults() { 
	if ( !RESULTS_OPEN ) return;
	hideResults();
	// Dejar todo como al inicio de la primera partida (posiciones, estados y temporizadores)
	stopAllSound();
	stopTimes();
	stopBlinkSuperBubbles();
	erasePacman();
	eraseGhosts();
	resetPacman();
	resetGhosts();
	PAUSE = false;
	LOCK = false;
	PACMAN_DEAD = false;
	GAMEOVER = false;
	SCORE = 0;
	LIFES = 2;
	LEVEL = 1;
	TIME_GAME = 0;
	TIME_LEVEL = 0;
	TIME_LIFE = 0;
	TIME_FRUITS = 0;
	initGame(true);
}

function gameover() { 
	FINAL_SCORE = SCORE;
	GAMEOVER = true;
	message("game over");
	// Muestra "GAME OVER" un momento y luego la pantalla de resultados
	if ( RESULTS_TIMER !== -1 ) clearTimeout(RESULTS_TIMER);
	RESULTS_TIMER = setTimeout(showResults, 1800);
	stopTimes();

	erasePacman();
	eraseGhosts();
	
	resetPacman();
	resetGhosts();
	
	TIME_GAME = 0;
	TIME_LEVEL = 0;
	TIME_LIFE = 0;
	TIME_FRUITS = 0;

	LIFES = 2;
	LEVEL = 1;
	SCORE = 0;
}

function message(m) { 
	$("#message").html(m);
	if (m === "game over") $("#message").addClass("red");
}
function clearMessage() { 
	$("#message").html("");
	$("#message").removeClass("red");
}

function score(s, type) { 

	var scoreBefore = (SCORE / 10000) | 0;
	
	SCORE += s;
	if (SCORE === 0) { 
		$('#score span').html("00");
	} else { 
		$('#score span').html(SCORE);
	}
	
	var scoreAfter = (SCORE / 10000) | 0;
	if (scoreAfter > scoreBefore) { 
		lifes( +1 );
	}

	
	if (SCORE > HIGHSCORE) { 
		HIGHSCORE = SCORE;
		if (HIGHSCORE === 0) { 
			$('#highscore span').html("00");
		} else { 
			$('#highscore span').html(HIGHSCORE);
		}
	}
	
	if (type && (type === "clyde" || type === "pinky" || type === "inky" || type === "blinky") ) { 
		erasePacman(); 
		eraseGhost(type); 
		$("#board").append('<span class="combo">' + SCORE_GHOST_COMBO + '</span>');
		$("#board span.combo").css('top', eval('GHOST_' + type.toUpperCase() + '_POSITION_Y - 10') + 'px');
		$("#board span.combo").css('left', eval('GHOST_' + type.toUpperCase() + '_POSITION_X - 10') + 'px');
		SCORE_GHOST_COMBO = SCORE_GHOST_COMBO * 2;
	} else if (type && type === "fruit") { 
		$("#board").append('<span class="fruits">' + s + '</span>');
		$("#board span.fruits").css('top', (FRUITS_POSITION_Y - 14) + 'px');
		$("#board span.fruits").css('left', (FRUITS_POSITION_X - 14) + 'px');
	}
}