// Includes both the variables and query for aniListData in Gameplay.js

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

let vars = {
    page: getRandomArbitrary(0, 20),
    perPage: 50,
};

let query = `query($page: Int, $perPage: Int){
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
  }`;

export { vars, query };