var app = angular.module('quizApp', []);

app.directive('quiz', function(quizFactory){
    return {
        restrict: 'AE',
        scope : {},
        templateUrl : 'template.html',
        link : function(scope, elem, attrs){
            scope.start = function(){
                scope.id = 0;
                scope.quizOver = false;
                scope.inProgress = true;
                scope.getQuestion();
            };
            scope.reset = function(){
                scope.inProgress = false;
                scope.score = 0;
            };
            scope.getQuestion = function(){
                var q = quizFactory.getQuestion(scope.id);
                
                if (q){
                    console.log('hi');
                    scope.question = q.question;
                    scope.options = q.options;
                    scope.answer = q.answer;
                    scope.answerMode = true;
                } else {
                    scope.quizOver = true;
                }
            };
            scope.checkAnswer = function(){
                if(!$('input[name=answer]:checked').length) return;
                
 
				var ans =$('input[name=answer]:checked').val();
 
				if(ans == scope.options[scope.answer]) {
					scope.score++;
					scope.correctAns = true;
				} else {
					scope.correctAns = false;
				}
 
				scope.answerMode = false;
            };
            
            scope.nextQuestion = function(){
                scope.id++;
                scope.getQuestion();
            
            };
            
            scope.reset();
            
        }
    }

});

app.factory('quizFactory', function() {
    
    var shuffle = function(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    };
 
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", 'https://opentdb.com/api.php?amount=10&type=multiple', false ); // false for synchronous request
    xmlHttp.send( null );
    var questions = JSON.parse(xmlHttp.responseText)['results'];
    
    //JSON.parse(data.replace(/&quot;/g,'"'));
    var questionsArray = [];
    
    for (var i = 0; i < questions.length; i++){
        
        var incorrectAnswers = questions[i]['incorrect_answers'];
        var answers = [];
        
        for(var j = 0; j < incorrectAnswers.length; j++){
            var curr = incorrectAnswers[j].replace(/&quot;/g,'"');
            curr.replace(/&#039;/g,'"');
            answers.push(unescape(curr));
        }
        
        var ans = questions[i]['correct_answer'].replace(/&quot;/g,'"');
        ans.replace(/&#039;/g,'"');
        answers.push(unescape(ans));
        var q = shuffle(answers)
        
        var quest = questions[i]['question'].replace(/&quot;/g,'"');
        quest.replace(/&#039;/g,'"');
        
        questionsArray.push({
            question : unescape(quest),
            options: q,
            answer: q.indexOf(unescape(questions[i]['correct_answer']))
        })     
    }
    
    
 
	return {
		getQuestion: function(id) {
			if(id < questions.length) {
				return questionsArray[id];
			} else {
				return false;
			}
		}
	};
});
