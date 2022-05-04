let currentScore = localStorage.getItem('sessionScore');
let score = document.getElementById('scoreResult')
if(currentScore == null){
    currentScore = 0;
}
score.textContent = `Your score was ${currentScore}`