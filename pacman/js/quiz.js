/* ===== Encuesta de conocimientos – Electiva Profesional I =====
   Cuando Pacman come una galleta grande (super bubble) el juego se pausa y
   aparece una pregunta aleatoria. Si se responde bien, los fantasmas se
   vuelven azules (se pueden comer). Si se responde mal, no cambian.
   Cambia QUIZ_TRIGGER a 'all' para preguntar con TODAS las galletas. */
var QUIZ_TRIGGER = 'super';   // 'super' = galletas grandes | 'all' = todas
var QUIZ_OPEN = false;
var QUIZ_BAG = [];
var QUIZ_CURRENT = null;
var QUIZ_ANSWERED = false;
var QUIZ_CORRECT = 0;     // respuestas correctas en esta partida
var QUIZ_TOTAL = 0;       // preguntas respondidas en esta partida
var QUIZ_TOTAL_MAX = 8;   // total de galletas grandes en el tablero
var QUIZ_ORDER = [];      // orden mezclado de las opciones
var QUIZ_RIGHT_POS = 0;   // posición de la correcta ya mezclada

var QUIZ_QUESTIONS = [
	{ q: "¿Qué es la transformación empresarial?", correct: 0, o: [
		"Cambiar cómo opera y crea valor",
		"Renovar los equipos tecnológicos",
		"Aumentar el personal contratado",
		"Abrir nuevas sedes físicas" ] },
	{ q: "¿Qué impulsa a una empresa a transformarse?", correct: 0, o: [
		"Las nuevas necesidades del cliente",
		"La antigüedad de la empresa",
		"El tamaño de sus oficinas",
		"El número de empleados actuales" ] },
	{ q: "¿Qué es la digitalización de procesos?", correct: 0, o: [
		"Usar tecnología para mejorar procesos",
		"Escanear documentos en papel",
		"Comprar computadores nuevos",
		"Instalar internet en la oficina" ] },
	{ q: "¿Qué busca la transformación digital?", correct: 0, o: [
		"Mejorar la organización con tecnología",
		"Agregar tecnología sin cambiar procesos",
		"Cambiar solo los computadores",
		"Eliminar los procesos existentes" ] },
	{ q: "¿Qué define la estrategia empresarial?", correct: 0, o: [
		"Hacia dónde va y cómo compite",
		"Cómo se organiza el personal",
		"Cómo se financian las compras",
		"Cuánto cuesta cada producto" ] },
	{ q: "¿Qué es una capacidad digital?", correct: 0, o: [
		"Usar datos para decidir mejor",
		"Tener muchos equipos nuevos",
		"Contar con redes sociales",
		"Trabajar solo desde casa" ] },
	{ q: "¿Qué es el Business Model Canvas?", correct: 0, o: [
		"Un esquema visual del negocio",
		"Un programa para diseñar webs",
		"Un software de contabilidad",
		"Un sistema de facturación" ] },
	{ q: "¿Para qué sirve la propuesta de valor?", correct: 0, o: [
		"Mostrar qué ofreces y por qué sirve",
		"Definir quiénes son los socios",
		"Fijar los canales de venta",
		"Calcular los costos de operar" ] }
];

function quizUpdateStats() {
	$("#quiz-correct").text(QUIZ_CORRECT);
	$("#quiz-total").text(QUIZ_TOTAL_MAX);
}

function quizResetStats() {
	QUIZ_CORRECT = 0;
	QUIZ_TOTAL = 0;
	quizUpdateStats();
}

function quizNextQuestion() {
	if (QUIZ_BAG.length === 0) {
		for (var i = 0; i < QUIZ_QUESTIONS.length; i ++) QUIZ_BAG.push(i);
		for (var j = QUIZ_BAG.length - 1; j > 0; j --) {
			var k = Math.floor(Math.random() * (j + 1));
			var t = QUIZ_BAG[j]; QUIZ_BAG[j] = QUIZ_BAG[k]; QUIZ_BAG[k] = t;
		}
	}
	return QUIZ_QUESTIONS[QUIZ_BAG.pop()];
}

function quizEscape(s) {
	return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function showQuiz() {
	if (QUIZ_OPEN || PACMAN_DEAD || GAMEOVER) return;

	QUIZ_OPEN = true;
	QUIZ_ANSWERED = false;
	QUIZ_CURRENT = quizNextQuestion();

	pauseGame();
	clearMessage();

	// Mezclar las opciones cada vez para que la correcta no tenga posición fija
	QUIZ_ORDER = [];
	for (var a = 0; a < QUIZ_CURRENT.o.length; a ++) QUIZ_ORDER.push(a);
	for (var b = QUIZ_ORDER.length - 1; b > 0; b --) {
		var c = Math.floor(Math.random() * (b + 1));
		var tmp = QUIZ_ORDER[b]; QUIZ_ORDER[b] = QUIZ_ORDER[c]; QUIZ_ORDER[c] = tmp;
	}
	QUIZ_RIGHT_POS = QUIZ_ORDER.indexOf(QUIZ_CURRENT.correct);

	var letters = ["A", "B", "C", "D"];
	var html = '<h2>Pregunta</h2><p class="quiz-q">' + quizEscape(QUIZ_CURRENT.q) + '</p><div class="quiz-options">';
	for (var i = 0; i < QUIZ_CURRENT.o.length; i ++) {
		html += '<button type="button" class="quiz-option" data-i="' + i + '"><b>' + letters[i] + '</b><span>' + quizEscape(QUIZ_CURRENT.o[QUIZ_ORDER[i]]) + '</span></button>';
	}
	html += '</div><div class="quiz-result"></div>';

	$("#quiz-box").html(html);
	$("#quiz").css("display", "flex");
	if (document.activeElement) document.activeElement.blur();   // ninguna opción resaltada al abrir
}

function answerQuiz(i) {
	if (!QUIZ_OPEN || QUIZ_ANSWERED) return;
	QUIZ_ANSWERED = true;

	var ok = (i === QUIZ_RIGHT_POS);
	QUIZ_TOTAL ++;
	if (ok) QUIZ_CORRECT ++;
	quizUpdateStats();
	$("#quiz .quiz-option").prop("disabled", true);
	$("#quiz .quiz-option").eq(QUIZ_RIGHT_POS).addClass("quiz-right");
	if (!ok) $("#quiz .quiz-option").eq(i).addClass("quiz-wrong");

	$("#quiz .quiz-result")
		.addClass(ok ? "ok" : "bad")
		.html(ok ? "CORRECTO<br><small>Los fantasmas se vuelven azules</small>" : "INCORRECTO<br><small>Los fantasmas no cambian</small>");

	setTimeout(function () { closeQuiz(ok); }, 1600);
}

function closeQuiz(ok) {
	$("#quiz").css("display", "none");
	QUIZ_OPEN = false;

	resumeGame();
	if (ok) affraidGhosts();
}

$(document).on("click", "#quiz .quiz-option", function (e) {
	e.stopPropagation();
	answerQuiz(parseInt($(this).attr("data-i"), 10));
});
$(document).on("keydown", function (e) {
	if (!QUIZ_OPEN) return;
	var n = e.keyCode - 49;           // teclas 1-4
	if (n < 0 || n > 3) n = e.keyCode - 97;   // teclado numérico
	if (n >= 0 && n <= 3) answerQuiz(n);
	var l = e.keyCode - 65;           // teclas A-D
	if (l >= 0 && l <= 3) answerQuiz(l);
});
