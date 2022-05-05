import { CountUp } from "countup.js";
import getGQL from "./gQL";

let countUpOptions = {
  separator: ' ',
};
let gamemode = "Popularity";
let scoreValue = 0;

const score = document.getElementById('scoreValue');
const seriesInfo = document.querySelectorAll('.seriesInfo')
const gamemodeBox = document.getElementById("gamemodeValue");
const series2BTNs = document.getElementById('series2BTNs');
const allBTNs = document.querySelectorAll(`button`);

let aniListData = (await getGQL()).Page.media;
let originalSeriesPick = getRandomArbitrary(0, aniListData.length);
let newSeriesPick = getRandomArbitrary(0, aniListData.length);
let series = fetchSeries(originalSeriesPick, newSeriesPick, aniListData);
let backupSeries = series;

setSeries(1, series);
setSeries(2, series);
score.textContent = scoreValue;
gamemodeBox.style.display = 'none';
gamemodeBox.textContent = series[0].popularity;

allBTNs.forEach(button => {
  button.addEventListener('click', (buttonInfo) => {
    const animate = animateValue(series[1], countUpOptions);
    animate.start();
    switch (buttonInfo.target.id) {
      case "higher":
        if (series[0].popularity <= series[1].popularity) {
          correctAnswer(gamemodeBox);
        } else {
          wrongAnswer(gamemodeBox);
        };
        break;

      case "lower":
        if (series[0].popularity >= series[1].popularity) {
          correctAnswer(gamemodeBox);
        } else {
          wrongAnswer(gamemodeBox);
        };
        break;

    };
    // Replaces the buttons to display the newSeries popularity
    // and then does a transistion after 3 seconds to the new pick
    displayNumber(series[1].popularity, gamemodeBox, allBTNs)
    setTimeout(seriesTransistion, 3000, "1.25", "fadeInRight", aniListData, backupSeries, newSeriesPick)
  });
});

// FUNCTIONS BELOW

function correctAnswer(div) {
  animateIn(div, "2.85", "tada")
  div.classList.add('correctAnswer')
  setTimeout(addScore, 1500, countUpOptions)
}

function wrongAnswer(div) {
  animateIn(div, "2.85", "headShake")
  div.classList.add('wrongAnswer')
  setTimeout(gameOver, 2500, scoreValue)
}

function updateVars() {
  return vars.page = getRandomArbitrary(0, 20);
}

async function updateData() {
  updateVars()
  return aniListData = (await getGQL(query, vars)).Page.media;
}

// Find's the currently shown series and
// removes them from the data array.

function removeDataDupes(data, series) {
  let ogSeriesIndex = data.indexOf(series[0]);
  data = data.filter((data, idx) => idx !== ogSeriesIndex)
  let newSeriesIndex = data.indexOf(series[1]);
  data = data.filter((data, idx) => idx !== newSeriesIndex);
  return data;
}

// It hides the buttons and shows a
// div with the series 2 popularity
// counting up using CountUp.js and
// animations from animate.css

function displayNumber(displayNumber, div, allBTNs) {
  div.style.display = 'flex';
  allBTNs[0].style.display = 'none';
  allBTNs[1].style.display = 'none';
  div.textContent = displayNumber;
  setTimeout(fixDisplayNumber, 2850, div, allBTNs)
}

// Reenables the buttons and removes
// the animations from the buttons

function fixDisplayNumber(div, allBTNs) {
  div.style.display = 'none';
  allBTNs[0].style.display = 'flex';
  allBTNs[1].style.display = 'flex';
  gamemodeBox.classList.remove('correctAnswer', 'wrongAnswer')
  animateIn(series2BTNs, "1.25", "slideInUp")
}

function fetchSeries(ogSeriesPick, newSeriesPick, data) {
  let ogSeries = data[ogSeriesPick];
  let newSeries = data[newSeriesPick];
  let series = [ogSeries, newSeries];
  removeDataDupes(data, series)
  return series;
}

function gameOver(score) {
  localStorage.setItem('sessionScore', score);
  if (score >= localStorage.getItem('highscore')) {
    localStorage.setItem('highscore', score)
  }
  window.location.replace('../html/gameover.html')
}

function animateValue(series, options) {
  let animateValue = new CountUp('gamemodeValue', series.popularity, options);
  return animateValue;
}

function animateScore(score, options) {
  options.startVal = score;
  let animateScore = new CountUp('scoreValue', score, options);
  return animateScore;
}

function addScore(options) {
  scoreValue++
  let animate = animateScore(scoreValue, options);
  animate.start();
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getSeries(series_id, series) {
  let selectedSeries = series[+series_id - 1]
  return selectedSeries
}

function replaceSeries(data, newSeriesPick, series, originalData) {
  if (data.length <= 3) {
    updateData()
  }
  while (newSeriesPick >= data.length) {
    newSeriesPick--
  }
  originalSeriesPick = newSeriesPick;
  let newSeriesNewPick = getRandomArbitrary(0, data.length);
  series[0] = originalData[1];
  series[1] = data[newSeriesNewPick]
  series.unshift(series[0], series[1])
  setSeries(1, series)
  setSeries(2, series)
  fetchSeries(originalSeriesPick, newSeriesNewPick, data)
}

function seriesTransistion(duration, animationType, data, originalData, newSeriesPick) {
  animateIn(seriesInfo[1], duration, animationType)
  animateIn(seriesInfo[0], duration, animationType)
  replaceSeries(data, newSeriesPick, series, originalData)
}

// Function for easy animation control, 
// animation's are from animate.css

function animateIn(element, duration = "1.25", animationType = "fadeInRight") {
  element.style.setProperty('--animate-duration', `${duration}s`);
  element.classList.add('animate__animated', `animate__${animationType}`);
  element.addEventListener('animationend', () => {
    element.classList.remove('animate__animated', `animate__${animationType}`);
  });
};

function setSeries(series_id, series) {

  const selectedSeries = getSeries(series_id, series);
  const seriesTitle = document.getElementById(`seriesTitle${series_id}`);
  const seriesImage = document.getElementById(`seriesImage${series_id}`);
  if (series_id == 1) {
    const gmValue = document.getElementById(`gmValue${series_id}`);
    gmValue.textContent = `${gamemode}: ${selectedSeries.popularity}`;
  }

  seriesTitle.textContent = selectedSeries?.title?.romaji || selectedSeries?.title?.english || selectedSeries?.title?.native || "Unknown";
  seriesImage.src = selectedSeries.coverImage.extraLarge;
}