const highScore = document.querySelector('#highScore')
let HSvalue = 0;
HSvalue = localStorage.getItem('highscore')
highScore.textContent = `Highscore : ${HSvalue}`