import axios from 'axios';
import { query, vars } from './query&vars';
let Query = query;
let Vars = vars;

function getGQL(query = Query, vars = Vars, url = "https://graphql.anilist.co") {
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


export default getGQL;