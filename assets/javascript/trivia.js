$( document ).ready()

var triviaQuestions = [{
	question: "What was Mulan's name when she was disguised as a boy?",
	answerList: ["Bao", "Ping", "Chao", "Feng"],
	answer: 1
},{
	question: "When time did Cinderella have to be home?",
	answerList: ["1", "11", "10", "12"],
	answer: 3
},{
	question: "What was the lobster's name is the Little Mermaid?",
	answerList: ["Dolphin", "Sebastian", "Merida", "Elsa"],
	answer: 1
},{
	question: "What was Princess Jasmine's tiger's name?",
	answerList: ["Abu", "Khan", "Rajah", "Sultan"],
	answer: 2
},{
	question: "Which Princess was not born a princess ? ",
	answerList: ["Sleeping Beuty", "Princess Jasmine", "Cinderella", "Ariel"],
	answer: 2
},{
	question: "What fruit was Snow White posioned with?",
	answerList: ["Orange", "Apple", "Banana", "Mango"],
	answer: 1
},{
	question: "Who did Princess Jasmine fall in love with?",
	answerList: ["Aladdin", "Jafar", "Ahmed", "Tom"],
	answer: 0
},{
	question: "What woke Sleeping Beauty up?",
	answerList: ["Water", "A slap", "A pinch", "A kiss"],
	answer: 3
},{
	question: "What year was Pocahontas released'?",
	answerList: ["1985", "1990", "1995", "1993"],
	answer: 2
},{
	question: "Whay is the name of Belle's Horse?",
	answerList: ["Maximus", "Phillipe", "Fred", "Archilles"],
	answer: 1
}];

var search = ['mulan', 'cinderella', 'sebastian', 'princessjasmine+tiger', 'cinderella+prince', 'snow+white', 'jasmine+aladin', 'sleeping+beauty+kiss', 'pocahontas+racoon', 'beauty+beast'];
var currentQuestion; var correctAnswer; var incorrectAnswer; var unanswered; var seconds; var time; var answered; var userSelect;
var messages = {
	correct: "Yes, that is the right answer!",
	incorrect: "No, that's not it.",
	endTime: "Out of time!",
	finished: "Alright! Let's see how well you did."
}

$('#startBtn').on('click', function(){
	$(this).hide();
	newGame();
});

$('#startOverBtn').on('click', function(){
	$(this).hide();
	newGame();
});

function newGame(){
	$('#finalMessage').empty();
	$('#correctAnswers').empty();
	$('#incorrectAnswers').empty();
	$('#unanswered').empty();
	currentQuestion = 0;
	correctAnswer = 0;
	incorrectAnswer = 0;
	unanswered = 0;
	newQuestion();
}

function newQuestion(){
	$('#message').empty();
	$('#correctedAnswer').empty();
	$('#gif').empty();
	answered = true;
	
	//sets up new questions & answerList
	$('#currentQuestion').html('Question #'+(currentQuestion+1)+' out of '+triviaQuestions.length);
	$('.question').html('<h2>' + triviaQuestions[currentQuestion].question + '</h2>');
	for(var i = 0; i < 4; i++){
		var choices = $('<div>');
		choices.text(triviaQuestions[currentQuestion].answerList[i]);
		choices.attr({'data-index': i });
		choices.addClass('thisChoice');
		$('.answerList').append(choices);
	}
	countdown();
	//clicking an answer will pause the time and setup answerPage
	$('.thisChoice').on('click',function(){
		userSelect = $(this).data('index');
		clearInterval(time);
		answerPage();
	});
}

function countdown(){
	seconds = 15;
	$('#timeLeft').html('<h3>Time Remaining: ' + seconds + '</h3>');
	answered = true;
	//sets timer to go down
	time = setInterval(showCountdown, 1000);
}

function showCountdown(){
	seconds--;
	$('#timeLeft').html('<h3>Time Remaining: ' + seconds + '</h3>');
	if(seconds < 1){
		clearInterval(time);
		answered = false;
		answerPage();
	}
}

function answerPage(){
	$('#currentQuestion').empty();
	$('.thisChoice').empty();
	$('.question').empty();

	var rightAnswerText = triviaQuestions[currentQuestion].answerList[triviaQuestions[currentQuestion].answer];
	var rightAnswerIndex = triviaQuestions[currentQuestion].answer;

	//used giphy ajax for gifs
	var giphyURL = "http://api.giphy.com/v1/gifs/search?q=disney+" + search[currentQuestion] + "&api_key=15147yUPC72ycCrrggC6aKyPWJaAId9E"
	$.ajax({url: giphyURL, method: 'GET'}).done(function(giphy){
		var currentGif = giphy.data;
		$.each(currentGif, function(index,value){
		var embedGif = value.images.original.url;
		newGif = $('<img>');
		newGif.attr('src', embedGif);
		newGif.addClass('gifImg');
		$('#gif').html(newGif);
		});
	});
	//checks to see correct, incorrect, or unanswered
	if((userSelect == rightAnswerIndex) && (answered == true)){
		correctAnswer++;
		$('#message').html(messages.correct);
	} else if((userSelect != rightAnswerIndex) && (answered == true)){
		incorrectAnswer++;
		$('#message').html(messages.incorrect);
		$('#correctedAnswer').html('The correct answer was: ' + rightAnswerText);
	} else{
		unanswered++;
		$('#message').html(messages.endTime);
		$('#correctedAnswer').html('The correct answer was: ' + rightAnswerText);
		answered = true;
	}
	
	if(currentQuestion == (triviaQuestions.length-1)){
		setTimeout(scoreboard, 5000)
	} else{
		currentQuestion++;
		setTimeout(newQuestion, 5000);
	}	
}

function scoreboard(){
	$('#timeLeft').empty();
	$('#message').empty();
	$('#correctedAnswer').empty();
	$('#gif').empty();

	$('#finalMessage').html(messages.finished);
	$('#correctAnswers').html("Correct Answers: " + correctAnswer);
	$('#incorrectAnswers').html("Incorrect Answers: " + incorrectAnswer);
	$('#unanswered').html("Unanswered: " + unanswered);
	$('#startOverBtn').addClass('reset');
	$('#startOverBtn').show();
	$('#startOverBtn').html('Start Over?');
}