import getGQL from "./gQL";

let series = [];
let gamemode = "Popularity";
let originalData = [];
let score = document.getElementById('scoreValue');
let scoreValue = 0;
let series1;
let series2;
let series1Index;
let series2Index;
let seriesInfo = document.querySelectorAll('.seriesInfo')

let gamemodeBox = document.getElementById("gamemodeValue");
let allBTNs = document.getElementById('series2BTNs');
let higherBTN = document.getElementById('higher');
let lowerBTN = document.getElementById('lower');

gamemodeBox.style.display = 'none';

let query = `
query($page: Int, $perPage: Int){
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
      }
      media(format: TV, sort: POPULARITY_DESC, status_not: NOT_YET_RELEASED) {
        popularity
        averageScore
        siteUrl
        favourites
        id
        coverImage {
          extraLarge
        }
        title {
          native
          english
          romaji
        }
        startDate {
          day
          month
          year
        }
      }
    }
  }
`;

let vars = {
  page: getRandomArbitrary(0, 20),
  perPage: 50,
}

let aniListData = (await getGQL(query, vars)).Page.media;
let series1_spot = getRandomArbitrary(0, aniListData.length);
let series2_spot = getRandomArbitrary(0, aniListData.length);

fetchSeries()
gamemodeBox.textContent = series1.popularity
setSeries(1)
setSeries(2)

higherBTN.addEventListener('click', (e) => {
  if (series1.popularity <= series2.popularity) {
    animateIn(gamemodeBox, "2.85", "tada")
    gamemodeBox.classList.add('correctAnswer')
    setTimeout(addScore, 1500)
  } else {
    animateIn(gamemodeBox, "2.85", "wobble")
    gamemodeBox.classList.add('wrongAnswer')
    setTimeout(gameOver, 2500)
  }
  displayNumber(series2.popularity, gamemodeBox)
  setTimeout(seriesTransistion, 3000, "1.25", "fadeInRight")
})

lowerBTN.addEventListener('click', (e) => {
  if (series1.popularity >= series2.popularity) {
    animateIn(gamemodeBox, "2.85", "tada")
    gamemodeBox.classList.add('correctAnswer')
    setTimeout(addScore, 1500)
  } else {
    animateIn(gamemodeBox, "2.85", "wobble")
    gamemodeBox.classList.add('wrongAnswer')
    setTimeout(gameOver, 2500)
  }
  displayNumber(series2.popularity, gamemodeBox)
  setTimeout(seriesTransistion, 3000, "1.25", "fadeInRight")
})

function updateVars() {
  return vars.page = getRandomArbitrary(0, 20);
}

async function updateData() {
  updateVars()
  return aniListData = (await getGQL(query, vars)).Page.media;
}

function updateArray() {
  series1Index = aniListData.indexOf(series1);
  series2Index = aniListData.indexOf(series2);
  aniListData = aniListData.filter((data, idx) => idx !== series1Index)
  series2Index = aniListData.indexOf(series2);
  aniListData = aniListData.filter((data, idx) => idx !== series2Index);
}

function displayNumber(displayNumber, div) {
  div.style.display = 'flex';
  higherBTN.style.display = 'none';
  lowerBTN.style.display = 'none';
  div.textContent = displayNumber;
  setTimeout(fixDisplayNumber, 2850, div)
}

function fixDisplayNumber(div) {
  div.style.display = 'none';
  higherBTN.style.display = 'flex';
  lowerBTN.style.display = 'flex';
  gamemodeBox.classList.remove('correctAnswer', 'wrongAnswer')
  animateIn(allBTNs, "1.25", "fadeInUp")
}

function fetchSeries() {
  series1 = aniListData[series1_spot];
  series2 = aniListData[series2_spot];
  updateArray()
  series = [series1, series2];
  originalData = series;
}

function gameOver() {
  window.location.replace('../html/gameover.html')
}

function addScore() {
  scoreValue++
  score.textContent = scoreValue;
}
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getSeries(series_id) {
  return series[+series_id - 1]
}

function replaceSeries() {
  if (aniListData.length <= 3) {
    updateData()
  }
  while (series2_spot >= aniListData.length) {
    series2_spot--
  }
  series1_spot = series2_spot;
  series2_spot = getRandomArbitrary(0, aniListData.length);
  series1 = originalData[1];
  series2 = aniListData[series2_spot]
  series.unshift(series1, series2)
  setSeries(1)
  setSeries(2)
  fetchSeries()
}

function seriesTransistion(duration = "1.25", animationType) {
  animateIn(seriesInfo[1], duration, animationType)
  animateIn(seriesInfo[0], duration, animationType)
  replaceSeries()
}

function animateIn(element, duration = "1.25", animationType = "fadeInRight") {
  element.style.setProperty('--animate-duration', `${duration}s`);
  element.classList.add('animate__animated', `animate__${animationType}`);
  element.addEventListener('animationend', () => {
    element.classList.remove('animate__animated', `animate__${animationType}`);
  });
};

function setSeries(series_id) {

  let series = getSeries(series_id);
  let seriesTitle = document.getElementById(`seriesTitle${series_id}`);
  let seriesImage = document.getElementById(`seriesImage${series_id}`);
  if (series_id == 1) {
    let gmValue = document.getElementById(`gmValue${series_id}`);
    gmValue.textContent = `${gamemode}: ${series.popularity}`;
  }

  seriesTitle.textContent = series?.title?.romaji || series?.title?.english || series?.title?.native || "Unknown";
  seriesImage.src = series.coverImage.extraLarge;
}