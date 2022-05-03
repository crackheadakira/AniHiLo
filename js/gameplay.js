import getGQL from "./gQL";

let series = [];
let gamemode = "Popularity";
let originalData;
let score = document.getElementById('score');
let scoreValue = 0;
score.textContent = `Score: ${scoreValue}`
let series1;
let series2;
let series1_spot = getRandomArbitrary(0, 50);
let series2_spot = getRandomArbitrary(0, 50);

let higherBTN = document.getElementById('higher');
let odometer = document.querySelector('.odometer');

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

let alData = (await getGQL(query, vars)).Page;

fetchSeries()
setSeries(1)
setSeries(2)

function fetchSeries() {
    series1 = alData.media[series1_spot];
    series2 = alData.media[series2_spot];
    series = series.concat(series1, series2)
    originalData = series;
}

higherBTN.addEventListener('click', (e) => {
    replaceSeries()
    odometer.innerHTML = series1.popularity;
    console.log(series1)
    if (series1.popularity < series2.popularity || series1.popularity == series2.popularity) {
        addScore()
    }
})

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
    series2_spot = getRandomArbitrary(0, 50);
    series1 = originalData[1];
    series2 = alData.media[series2_spot]
    series = [series1, series2]
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

    seriesTitle.textContent = series.title.romaji || series.title.english || series.title.native;
    seriesImage.src = series.coverImage.extraLarge;

}