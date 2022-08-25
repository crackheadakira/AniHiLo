const highScore = document.querySelector('#highScore')
let HSvalue = localStorage.getItem('highscore')
if (HSvalue == null) {
    HSvalue = 0;
}
highScore.textContent = `Highscore: ${HSvalue}`