const GQL = require('./gQL')

let query = `
query($page: Int, $perPage: Int){
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
      }
      media(format: TV, sort: POPULARITY_DESC, status_not: NOT_YET_RELEASED) {
        popularity
        averageScore
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

let x1 = getRandomArbitrary(0, 50)
let x2 = getRandomArbitrary(0, 20)

let vars = {
    page: x2,
    perPage: 50,
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

GQL(query, vars)
    .then((response, headers) => {
        let data = response.Page
        console.log(data.media[x1])
        console.log(`Page ${x2} \n Entry ${x1} \n Final number ${x1 * x2}`)
    })