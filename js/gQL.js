import axios from 'axios';

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

let s1 = getRandomArbitrary(0, 50)
let s2 = getRandomArbitrary(0, 50)
let x2 = getRandomArbitrary(0, 20)

let vars = {
  page: x2,
  perPage: 50,
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function GQL(query, vars, url = "https://graphql.anilist.co") {
  return new Promise((resolve, reject) => {
    axios.post(url, {
      query,
      variables: vars
    }).then(res => {
      resolve(res.data.data, res.headers);
    }).catch(err => {
      reject("GraphQL Request Rejected\n\n" + err?.response?.data?.errors.map(e => `> ${e.message}\n`) || err);
    });
  });
};

GQL(query, vars)
  .then((response, headers) => {
    let data = response.Page;

    let series1 = data.media[s1];
    let series2 = data.media[s2];

    let series1Title = document.getElementById('seriesTitle1')
    let series1Img = document.getElementById('seriesImage1')

    let series2Title = document.getElementById('seriesTitle2')
    let series2Img = document.getElementById('seriesImage2')


    series1Title.textContent = series1.title.romaji || series1.title.english;
    series1Img.src = series1.coverImage.extraLarge;

    series2Title.textContent = series2.title.romaji || series2.title.english;
    series2Img.src = series2.coverImage.extraLarge;
  });