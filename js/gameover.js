let currentScore = 0;
currentScore = localStorage.getItem('sessionScore');
let score = document.getElementById('scoreResult')
score.textContent = `Your score was ${currentScore}`