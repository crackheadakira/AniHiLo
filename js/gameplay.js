import getGQL from "./gQL";

let series = [];
let gamemode = "Popularity";
let originalData = [];
let score = document.getElementById('score');
let scoreValue = 0;
score.textContent = `Score: ${scoreValue}`
let series1;
let series2;
let series1Index;
let series2Index;

let higherBTN = document.getElementById('higher');
let lowerBTN = document.getElementById('lower');

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
setSeries(1)
setSeries(2)

higherBTN.addEventListener('click', (e) => {
  if (series1.popularity <= series2.popularity) {
    addScore()
  } else {
    gameOver();
  }
  replaceSeries()
})

lowerBTN.addEventListener('click', (e) => {
  if (series1.popularity >= series2.popularity) {
    addScore()
  } else {
    gameOver();
  }
  replaceSeries()
})

function updateVars() {
  return vars.page = getRandomArbitrary(0, 20);
}

async function updateData() {
  updateVars()
  aniListData = (await getGQL(query, vars)).Page.media;
}

function updateArray() {
  series1Index = aniListData.indexOf(series1);
  series2Index = aniListData.indexOf(series2);
  console.log(series1Index, series2Index, aniListData);
  aniListData = aniListData.filter((data, idx) => idx !== series1Index)
  series2Index = aniListData.indexOf(series2);
  aniListData = aniListData.filter((data, idx) => idx !== series2Index);
  console.log(series1Index, series2Index, aniListData);
}

function fetchSeries() {
  if (series1_spot == aniListData.length) { series1_spot-- }
  series1 = aniListData[series1_spot];
  series2 = aniListData[series2_spot];
  updateArray()
  series = [series1, series2];
  originalData = series;
}

function gameOver() {
  //window.location.replace('../html/gameover.html')
}

function addScore() {
  scoreValue++
  score.textContent = `Score: ${scoreValue}`;
}
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getSeries(series_id) {
  return series[+series_id - 1]
}

function replaceSeries() {
  series1_spot = series2_spot;
  series2_spot = getRandomArbitrary(0, aniListData.length);
  series1 = originalData[1];
  series2 = aniListData[series2_spot]
  series.unshift(series1, series2)
  setSeries(1)
  setSeries(2)
  fetchSeries()
}

function setSeries(series_id) {

  let series = getSeries(series_id)
  let seriesTitle = document.getElementById(`seriesTitle${series_id}`);
  let seriesImage = document.getElementById(`seriesImage${series_id}`);
  if (series_id == 1) {
    let gmValue = document.getElementById(`gmValue${series_id}`);
    gmValue.textContent = `${gamemode}: ${series.popularity}`;
  }

  seriesTitle.textContent = series?.title?.romaji || series?.title?.english || series?.title?.native || "Unknown";
  seriesImage.src = series.coverImage.extraLarge;
}