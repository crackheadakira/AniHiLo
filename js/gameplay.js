import getGQL from "./gQL";

let series = [];
let gamemode = "Popularity";
let originalData;

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

function makeSeries() {
    let series1 = alData.media[getRandomArbitrary(0, 50)];
    let series2 = alData.media[getRandomArbitrary(0, 50)];
    series = series.concat(series1, series2)
    originalData = series;
}

makeSeries()

setSeries(1)
setSeries(2)

let higherBTN = document.getElementById('higher');
higherBTN.addEventListener('click', (e) => {
    replaceSeries()
})

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getSeries(series_id) {
    return series[+series_id - 1]
}

function replaceSeries() {
    series1 = originalData[1];
    series2 = alData.media[getRandomArbitrary(0, 50)]
    series = [series1, series2]
    setSeries(1)
    setSeries(2)
    makeSeries()
}

function setSeries(series_id) {

    let series = getSeries(series_id)
    let seriesT = document.getElementById(`seriesTitle${series_id}`);
    let seriesI = document.getElementById(`seriesImage${series_id}`);
    if (series_id == 1) {
        let gmValue = document.getElementById(`gmValue${series_id}`);
        gmValue.textContent = `${gamemode}: ${series.popularity}`;
    }

    seriesT.textContent = series.title.romaji || series.title.english || series.title.native;
    seriesI.src = series.coverImage.extraLarge;

}